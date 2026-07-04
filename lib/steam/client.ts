import { steamQueue, RateLimitError } from "./queue";

const PRICEOVERVIEW_URL = "https://steamcommunity.com/market/priceoverview/";

export interface SteamPriceOverview {
  success: boolean;
  lowest_price?: string; // e.g. "$12.34"
  median_price?: string;
  volume?: string; // comma-separated string, e.g. "1,234"
}

export interface NormalizedPrice {
  price: number | null;
  medianPrice: number | null;
  volume: number | null;
  fetchedAt: Date;
}

/**
 * Fetches a single item's price overview from Steam's unofficial market
 * endpoint. This is an UNDOCUMENTED, UNAUTHENTICATED endpoint — Valve can
 * change or throttle it without notice, and it has no CORS headers, so it
 * must only ever be called server-side. All calls go through the shared
 * rate-limited queue; do not call fetch() on this endpoint directly
 * anywhere else in the codebase.
 */
export async function fetchPriceOverview(
  marketHashName: string,
  appId = 730,
  currency = 1 // 1 = USD
): Promise<NormalizedPrice> {
  return steamQueue.enqueue(async () => {
    const url = new URL(PRICEOVERVIEW_URL);
    url.searchParams.set("appid", String(appId));
    url.searchParams.set("market_hash_name", marketHashName);
    url.searchParams.set("currency", String(currency));

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "SkinPulse/1.0 (+price tracker; contact via app)",
        Accept: "application/json",
      },
      // Steam's endpoint is not cacheable by Next's fetch cache in any
      // meaningful way for our use case — we do our own DB/LRU caching.
      cache: "no-store",
    });

    if (res.status === 429 || res.status >= 500) {
      throw new RateLimitError(res.status, `Steam market request failed: ${res.status}`);
    }

    if (!res.ok) {
      throw new Error(`Steam market request failed: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as SteamPriceOverview;

    if (!data.success) {
      // Steam returns { success: false } for delisted / unknown items —
      // this is a legitimate "no data" response, not a transport error.
      return { price: null, medianPrice: null, volume: null, fetchedAt: new Date() };
    }

    return {
      price: parseSteamCurrency(data.lowest_price),
      medianPrice: parseSteamCurrency(data.median_price),
      volume: parseSteamVolume(data.volume),
      fetchedAt: new Date(),
    };
  });
}

function parseSteamCurrency(raw: string | undefined): number | null {
  if (!raw) return null;
  // Strips currency symbols/thousands separators, e.g. "$1,234.56" -> 1234.56
  const cleaned = raw.replace(/[^0-9.,]/g, "").replace(/,(?=\d{3}(\D|$))/g, "");
  const value = parseFloat(cleaned.replace(",", "."));
  return Number.isFinite(value) ? value : null;
}

function parseSteamVolume(raw: string | undefined): number | null {
  if (!raw) return null;
  const value = parseInt(raw.replace(/,/g, ""), 10);
  return Number.isFinite(value) ? value : null;
}
