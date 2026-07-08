import { TrendingUp, TrendingDown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ItemCard } from "./ItemCard";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import type { MockItem } from "@/lib/mock/items";

// Real Item (+ denormalized price fields) doesn't line up 1:1 with the
// old MockItem shape ItemCard expects (volume vs lastVolume, no sparkline
// history yet). Mapping here keeps ItemCard untouched — same pattern used
// in app/item/[id]/page.tsx.
function toMockItemShape(item: {
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
}): MockItem {
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
    sparkline: [],
  };
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

  const gainers = gainersDb.map(toMockItemShape);
  const losers = losersDb.map(toMockItemShape);

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
