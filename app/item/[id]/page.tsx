import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ItemDetailView } from "@/components/item/ItemDetailView";
import type { MockItem } from "@/lib/mock/items";

// Always fetch fresh — price data changes via cron, this page shouldn't
// serve a stale build-time snapshot.
export const dynamic = "force-dynamic";

// Prisma's Item (+ denormalized price fields) doesn't line up 1:1 with the
// old MockItem shape every child component expects (volume vs lastVolume,
// no sparkline, etc). Mapping here means ItemDetailView/SimilarItems/
// VolatilityStats stay untouched.
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

export default async function ItemPage({ params }: { params: { id: string } }) {
  const dbItem = await prisma.item.findUnique({ where: { id: params.id } });
  if (!dbItem) notFound();

  const history = await prisma.priceSnapshot.findMany({
    where: { itemId: dbItem.id },
    orderBy: { timestamp: "asc" },
    take: 500,
  });

  const similarDb = await prisma.item.findMany({
    where: { weaponType: { not: dbItem.weaponType }, id: { not: dbItem.id } },
    orderBy: { lastFetchedAt: "desc" },
    take: 6,
  });

  const item = toMockItemShape(dbItem);
  const similar = similarDb.map(toMockItemShape);

  return (
    <ItemDetailView
      item={item}
      similar={similar}
      history={history.map((h) => ({ date: h.timestamp.toISOString(), price: h.price }))}
    />
  );
}
