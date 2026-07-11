import { TrendingUp, TrendingDown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ItemCard } from "./ItemCard";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import type { MockItem } from "@/lib/mock/items";

// Real Item (+ denormalized price fields) doesn't line up 1:1 with the
// old MockItem shape ItemCard expects (volume vs lastVolume). Mapping here
// keeps ItemCard untouched — same pattern used in app/item/[id]/page.tsx.
// sparkline is populated separately from PriceSnapshot (see fetchSparklines).
function toMockItemShape(
  item: {
    id: string;
    marketHashName: string;
    name: string;
    weaponType: string;
    rarity: string;
    imageUrl: string;
    lastPrice: number | null;
    lastVolume: number | null;
    change24h: number | null;
    change7d: number | null;
  },
  sparkline: number[]
): MockItem {
  return {
    id: item.id,
    marketHashName: item.marketHashName,
    name: item.name,
    weaponType: item.weaponType,
    rarity: item.rarity as MockItem["rarity"],
    imageUrl: item.imageUrl,
    lastPrice: item.lastPrice ?? 0,
    change24h: item.change24h ?? 0,
    change7d: item.change7d ?? 0,
    volume: item.lastVolume ?? 0,
    sparkline,
  };
}

// Fetches the last N price points per item in a single query and returns
// them grouped by itemId, oldest first (the shape Sparkline expects).
async function fetchSparklines(itemIds: string[], pointsPerItem = 7): Promise<Map<string, number[]>> {
  if (itemIds.length === 0) return new Map();

  const snapshots = await prisma.priceSnapshot.findMany({
    where: { itemId: { in: itemIds } },
    orderBy: { timestamp: "desc" },
    select: { itemId: true, price: true, timestamp: true },
  });

  const byItem = new Map<string, number[]>();
  for (const id of itemIds) byItem.set(id, []);

  // snapshots are desc; take the newest `pointsPerItem` per item, then
  // reverse to chronological order for the sparkline line to read left→right.
  const counts = new Map<string, number>();
  for (const snap of snapshots) {
    const count = counts.get(snap.itemId) ?? 0;
    if (count >= pointsPerItem) continue;
    byItem.get(snap.itemId)?.push(snap.price);
    counts.set(snap.itemId, count + 1);
  }
  for (const [id, prices] of byItem) {
    byItem.set(id, prices.reverse());
  }

  return byItem;
}

export async function HeroBento() {
  const [gainersDb, losersDb] = await Promise.all([
    prisma.item.findMany({
      where: { change24h: { not: null } },
      orderBy: { change24h: "desc" },
      take: 4,
    }),
    prisma.item.findMany({
      where: { change24h: { not: null } },
      orderBy: { change24h: "asc" },
      take: 4,
    }),
  ]);

  const allIds = [...gainersDb.map((i) => i.id), ...losersDb.map((i) => i.id)];
  const sparklines = await fetchSparklines(allIds);

  const gainers = gainersDb.map((item) => toMockItemShape(item, sparklines.get(item.id) ?? []));
  const losers = losersDb.map((item) => toMockItemShape(item, sparklines.get(item.id) ?? []));

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Market Pulse
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Live CS2 skin prices, tracked across the market.
        </p>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-accent-up" />
        <h2 className="text-sm font-medium text-white/80">Top Gainers · 24h</h2>
      </div>
      <StaggerGrid className="mb-10">
        {gainers.map((item) => (
          <StaggerItem key={item.id}>
            <ItemCard item={item} />
          </StaggerItem>
        ))}
      </StaggerGrid>

      <div className="mb-6 flex items-center gap-2">
        <TrendingDown className="h-4 w-4 text-accent-down" />
        <h2 className="text-sm font-medium text-white/80">Top Losers · 24h</h2>
      </div>
      <StaggerGrid>
        {losers.map((item) => (
          <StaggerItem key={item.id}>
            <ItemCard item={item} />
          </StaggerItem>
        ))}
      </StaggerGrid>
    </section>
  );
}
