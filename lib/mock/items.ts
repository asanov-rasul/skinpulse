import type { Rarity } from "@/lib/utils/rarity";

export interface MockItem {
  id: string;
  marketHashName: string;
  name: string;
  weaponType: string;
  rarity: Rarity;
  imageUrl: string;
  lastPrice: number;
  change24h: number;
  change7d: number;
  volume: number;
  sparkline: number[];
}

// Real Steam CDN image URLs, sourced from the ByMykel/CSGO-API open dataset
// (https://github.com/ByMykel/CSGO-API), matched by weapon + skin name.
// These are actual, working icon URLs — not guessed or placeholder paths.
const IMAGES: Record<string, string> = {
  "ak47-redline":
    "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSI_-RHGavzedxuPUnFniykEtzsWWBzoyuIiifaAchDZUjTOZe4RC_w4buM-6z7wzbgokUyzK-0H08hRGDMA",
  "awp-asiimov":
    "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6V-Kf2cGFidxOp_pewnF3nhxEt0sGnSzN76dH3GOg9xC8FyEORftRe-x9PuYurq71bW3d8UnjK-0H0YSTpMGQ",
  "karambit-doppler":
    "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iSze91u_FsTju_qhAmoT-Jn4bjJC_4Ml93UtZuRLQPsBawkNfiMbnl5AKMiopCnin7iCJBv31j4rkBBKEg-6zUjV3GY6p9v8dpLWT3Fg",
  "m4a4-neonoir":
    "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSLvWcMWmfyPxJvOhuRz39wE1142vSztmvInvBOgV0W5R1FLYNuxW4wIbgNrmx4g2Kj4tMmCX93zQJsHgJr0dqFw",
  "deagle-blaze":
    "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7vORbqhsLfWAMWuZxuZi_uI_TX6wxxkjsGXXnImsJ37COlUoWcByEOMOtxa5kdXmNu3htVPZjN1bjXKpkHLRfQU",
  "glock-fade":
    "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1a7s2oaaBoH_yaCW-Ej-8u5bZvHnq1w0Vz62TUzNj4eCiVblMmXMAkROJeskLpkdXjMrzksVTAy9US8PY25So",
  "usps-killconfirmed":
    "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_uV_vO1WTCa9kxQ1vjiBpYPwJiPTcFB2Xpp5TO5cskG9lYCxZu_jsVCL3o4Xnij23ClO5ik9tegFA_It8qHJz1aWe-uc160",
  "sportgloves-vice":
    "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Tk5UvzWCL2kpn2-DFk_OKherB0H_KfG2Kv0ed4u95lRi67gVNx4T-Bw434IHyVb1QlAsd1FOUDthG4xNznMu3m4QXXg90Wzn_33C1I8G81tLaDi_rK",
  "p250-sanddune":
    "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhzMOwwjFU0OGvZqBSLPmUBnPelesn5-RrSXDlwRhx5TjSwtmocCifPwQpDpshReBfsxPrk4DhNu3jshue1dy8VcXxuA",
  "mp7-nemesis":
    "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8jsHf_jdk4uL5V6poLeOaHVicyOl-pK87Hyu1kR5_5j_WntigcXmXOlBzCZUjQeMLtBG6x9HuNrvl4gCP2I1B02yg2TXalB0S",
  "ak47-fireserpent":
    "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0PSneqF-JeKDC2mE_u995LZWTTuygxIYvzSCkpu3cnvFPQB2DpUkROFY4Rntw93lP7i241DbiI1BxSuviHlKunk_6-sHU71lpPMTRLyP4Q",
  "fiveseven-casehardened":
    "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL3l4Dl7idN6vyRabVSL_mfC2OvzedxuPUnH3C1kRsi4jiAw4qtdXjCO1V2WcZxF-EO5xLsxtHmMeKw5g3fit4TnDK-0H1W4XC76Q",
};

const img = (key: string) => IMAGES[key];

function sparkline(base: number, volatility: number, points = 24): number[] {
  const arr: number[] = [];
  let v = base;
  for (let i = 0; i < points; i++) {
    v += (Math.random() - 0.5) * volatility;
    arr.push(Math.max(0.5, Number(v.toFixed(2))));
  }
  return arr;
}

export const MOCK_ITEMS: MockItem[] = [
  {
    id: "1",
    marketHashName: "AK-47 | Redline (Field-Tested)",
    name: "AK-47 | Redline",
    weaponType: "AK-47",
    rarity: "CLASSIFIED",
    imageUrl: img("ak47-redline"),
    lastPrice: 42.18,
    change24h: 6.4,
    change7d: 12.1,
    volume: 1834,
    sparkline: sparkline(40, 3),
  },
  {
    id: "2",
    marketHashName: "AWP | Asiimov (Field-Tested)",
    name: "AWP | Asiimov",
    weaponType: "AWP",
    rarity: "COVERT",
    imageUrl: img("awp-asiimov"),
    lastPrice: 112.5,
    change24h: -3.2,
    change7d: -1.8,
    volume: 892,
    sparkline: sparkline(115, 5),
  },
  {
    id: "3",
    marketHashName: "★ Karambit | Doppler (Factory New)",
    name: "★ Karambit | Doppler",
    weaponType: "Knife",
    rarity: "GOLD",
    imageUrl: img("karambit-doppler"),
    lastPrice: 1450.0,
    change24h: 2.1,
    change7d: 8.7,
    volume: 47,
    sparkline: sparkline(1420, 30),
  },
  {
    id: "4",
    marketHashName: "M4A4 | Neo-Noir (Minimal Wear)",
    name: "M4A4 | Neo-Noir",
    weaponType: "M4A4",
    rarity: "CLASSIFIED",
    imageUrl: img("m4a4-neonoir"),
    lastPrice: 28.9,
    change24h: 1.4,
    change7d: -0.5,
    volume: 654,
    sparkline: sparkline(28, 2),
  },
  {
    id: "5",
    marketHashName: "Desert Eagle | Blaze (Factory New)",
    name: "Desert Eagle | Blaze",
    weaponType: "Desert Eagle",
    rarity: "RESTRICTED",
    imageUrl: img("deagle-blaze"),
    lastPrice: 385.0,
    change24h: -8.9,
    change7d: -14.2,
    volume: 112,
    sparkline: sparkline(410, 20),
  },
  {
    id: "6",
    marketHashName: "Glock-18 | Fade (Factory New)",
    name: "Glock-18 | Fade",
    weaponType: "Glock-18",
    rarity: "RESTRICTED",
    imageUrl: img("glock-fade"),
    lastPrice: 498.2,
    change24h: 4.7,
    change7d: 3.1,
    volume: 203,
    sparkline: sparkline(480, 15),
  },
  {
    id: "7",
    marketHashName: "USP-S | Kill Confirmed (Minimal Wear)",
    name: "USP-S | Kill Confirmed",
    weaponType: "USP-S",
    rarity: "COVERT",
    imageUrl: img("usps-killconfirmed"),
    lastPrice: 76.4,
    change24h: -1.1,
    change7d: 5.6,
    volume: 445,
    sparkline: sparkline(75, 4),
  },
  {
    id: "8",
    marketHashName: "★ Sport Gloves | Vice (Field-Tested)",
    name: "★ Sport Gloves | Vice",
    weaponType: "Gloves",
    rarity: "GOLD",
    imageUrl: img("sportgloves-vice"),
    lastPrice: 890.0,
    change24h: 9.8,
    change7d: 21.3,
    volume: 38,
    sparkline: sparkline(820, 40),
  },
  {
    id: "9",
    marketHashName: "P250 | Sand Dune (Field-Tested)",
    name: "P250 | Sand Dune",
    weaponType: "P250",
    rarity: "CONSUMER",
    imageUrl: img("p250-sanddune"),
    lastPrice: 0.03,
    change24h: 0.0,
    change7d: 0.0,
    volume: 12043,
    sparkline: sparkline(0.03, 0.005),
  },
  {
    id: "10",
    marketHashName: "MP7 | Nemesis (Minimal Wear)",
    name: "MP7 | Nemesis",
    weaponType: "MP7",
    rarity: "MIL_SPEC",
    imageUrl: img("mp7-nemesis"),
    lastPrice: 3.15,
    change24h: 2.8,
    change7d: -2.1,
    volume: 3201,
    sparkline: sparkline(3.1, 0.3),
  },
  {
    id: "11",
    marketHashName: "AK-47 | Fire Serpent (Field-Tested)",
    name: "AK-47 | Fire Serpent",
    weaponType: "AK-47",
    rarity: "COVERT",
    imageUrl: img("ak47-fireserpent"),
    lastPrice: 1120.0,
    change24h: -0.6,
    change7d: 4.4,
    volume: 89,
    sparkline: sparkline(1130, 25),
  },
  {
    id: "12",
    marketHashName: "Five-SeveN | Case Hardened (Field-Tested)",
    name: "Five-SeveN | Case Hardened",
    weaponType: "Five-SeveN",
    rarity: "MIL_SPEC",
    imageUrl: img("fiveseven-casehardened"),
    lastPrice: 14.2,
    change24h: 12.6,
    change7d: 18.9,
    volume: 578,
    sparkline: sparkline(13, 1.2),
  },
];

export const WEAPON_TYPES = Array.from(new Set(MOCK_ITEMS.map((i) => i.weaponType))).sort();

export function getTopMovers(direction: "up" | "down", limit = 6): MockItem[] {
  const sorted = [...MOCK_ITEMS].sort((a, b) =>
    direction === "up" ? b.change24h - a.change24h : a.change24h - b.change24h
  );
  return sorted.slice(0, limit);
}

export function getMockItemById(id: string): MockItem | undefined {
  return MOCK_ITEMS.find((i) => i.id === id);
}

export function generatePriceHistory(
  basePrice: number,
  days: number,
  volatility: number
): { date: string; price: number }[] {
  const points: { date: string; price: number }[] = [];
  let price = basePrice * (1 - volatility / 100);
  const now = Date.now();
  const stepMs = (days * 24 * 60 * 60 * 1000) / 60;

  for (let i = 0; i <= 60; i++) {
    price += (Math.random() - 0.48) * (basePrice * (volatility / 100) * 0.08);
    price = Math.max(price, basePrice * 0.5);
    points.push({
      date: new Date(now - (60 - i) * stepMs).toISOString(),
      price: Number(price.toFixed(2)),
    });
  }
  // Ensure the series ends near the current known price
  points[points.length - 1].price = basePrice;
  return points;
}
