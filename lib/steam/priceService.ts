import { LRUCache } from "lru-cache";
import { prisma } from "@/lib/prisma";
import { fetchPriceOverview } from "./client";

const TTL_MS = 5 * 60 * 1000; // 5 minutes — matches typical Steam market update cadence

interface CachedPrice {
  price: number | null;
  medianPrice: number | null;
  volume: number | null;
  fetchedAt: Date;
  stale: boolean;
}

// In-memory LRU as the hot path (works standalone without Redis for MVP).
// Swap this out for an ioredis-backed implementation behind the same
// interface if Redis is available — see README for the drop-in notes.
const memoryCache = new LRUCache<string, CachedPrice>({
  max: 2000,
  ttl: TTL_MS,
});

/**
 * Gets a price for an item, preferring (in order):
 *  1. Fresh in-memory cache
 *  2. A live Steam API fetch (queued + rate-limited)
 *  3. The last known-good value from Postgres, marked `stale: true`
 *
 * This function never throws for "Steam is down" — it degrades to cached
 * data instead, so the UI can render a "data may be outdated" badge rather
 * than a blank/error state.
 */
export async function getItemPrice(
  itemId: string,
  marketHashName: string
): Promise<CachedPrice> {
  const cached = memoryCache.get(marketHashName);
  if (cached) return cached;

  try {
    const live = await fetchPriceOverview(marketHashName);

    if (live.price !== null) {
      const result: CachedPrice = { ...live, stale: false };
      memoryCache.set(marketHashName, result);

      // Fire-and-forget persistence — don't block the response on writes.
      void persistSnapshot(itemId, live.price, live.volume);
      void prisma.item
        .update({
          where: { id: itemId },
          data: {
            lastPrice: live.price,
            lastVolume: live.volume,
            lastFetchedAt: live.fetchedAt,
            fetchStale: false,
          },
        })
        .catch(() => {
          /* best-effort; a failed denormalized write shouldn't break the request */
        });

      return result;
    }
  } catch (err) {
    console.error(`[priceService] live fetch failed for ${marketHashName}:`, err);
  }

  // Graceful degradation: fall back to last known value in Postgres.
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { lastPrice: true, lastVolume: true, lastFetchedAt: true },
  });

  if (item?.lastPrice != null) {
    const fallback: CachedPrice = {
      price: item.lastPrice,
      medianPrice: null,
      volume: item.lastVolume,
      fetchedAt: item.lastFetchedAt ?? new Date(0),
      stale: true,
    };
    void prisma.item
      .update({ where: { id: itemId }, data: { fetchStale: true } })
      .catch(() => {});
    return fallback;
  }

  // Genuinely no data anywhere — caller must handle this (e.g. "price unavailable").
  return { price: null, medianPrice: null, volume: null, fetchedAt: new Date(0), stale: true };
}

async function persistSnapshot(itemId: string, price: number, volume: number | null) {
  try {
    await prisma.priceSnapshot.create({
      data: { itemId, price, volume: volume ?? undefined },
    });
  } catch (err) {
    console.error(`[priceService] failed to persist snapshot for ${itemId}:`, err);
  }
}
