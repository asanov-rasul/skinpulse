import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getItemPrice } from "@/lib/steam/priceService";

/**
 * GET /api/items/:id
 *
 * Unlike the list endpoint, this one attempts a live Steam price fetch
 * (through the shared rate-limited queue + cache) because item detail
 * pages are lower-traffic and benefit from fresher data. Falls back to
 * the last cached price with a `stale: true` flag if Steam is unavailable
 * or rate-limited — the client renders a "data may be outdated" badge in
 * that case instead of erroring out.
 */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.item.findUnique({ where: { id: params.id } });
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const price = await getItemPrice(item.id, item.marketHashName);

    const recentHistory = await prisma.priceSnapshot.findMany({
      where: { itemId: item.id },
      orderBy: { timestamp: "desc" },
      take: 200,
    });

    return NextResponse.json({
      item: {
        id: item.id,
        name: item.name,
        marketHashName: item.marketHashName,
        weaponType: item.weaponType,
        rarity: item.rarity,
        imageUrl: item.imageUrl,
        change24h: item.change24h,
        change7d: item.change7d,
      },
      price: {
        current: price.price,
        median: price.medianPrice,
        volume: price.volume,
        fetchedAt: price.fetchedAt,
        stale: price.stale,
      },
      history: recentHistory.reverse(),
    });
  } catch (err) {
    console.error(`[/api/items/${params.id}] failed:`, err);
    return NextResponse.json({ error: "Failed to load item" }, { status: 500 });
  }
}
