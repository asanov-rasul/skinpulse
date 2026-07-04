import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Rarity } from "@/lib/utils/rarity";

/**
 * GET /api/items?query=&rarity=COVERT,CLASSIFIED&weapon=AK-47&limit=24
 *
 * Reads from Postgres only — this endpoint never talks to Steam directly.
 * Prices come from the last cron snapshot (see /api/cron/snapshot), so
 * this stays fast regardless of Steam's availability.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.trim();
  const rarityParam = searchParams.get("rarity");
  const weaponParam = searchParams.get("weapon");
  const limit = Math.min(Number(searchParams.get("limit")) || 24, 100);

  const rarities = rarityParam ? (rarityParam.split(",") as Rarity[]) : undefined;
  const weapons = weaponParam ? weaponParam.split(",") : undefined;

  try {
    const items = await prisma.item.findMany({
      where: {
        ...(query ? { name: { contains: query, mode: "insensitive" } } : {}),
        ...(rarities?.length ? { rarity: { in: rarities } } : {}),
        ...(weapons?.length ? { weaponType: { in: weapons } } : {}),
      },
      orderBy: { lastFetchedAt: "desc" },
      take: limit,
      select: {
        id: true,
        name: true,
        marketHashName: true,
        weaponType: true,
        rarity: true,
        imageUrl: true,
        lastPrice: true,
        lastVolume: true,
        change24h: true,
        change7d: true,
        fetchStale: true,
        lastFetchedAt: true,
      },
    });

    return NextResponse.json({ items });
  } catch (err) {
    console.error("[/api/items] query failed:", err);
    return NextResponse.json({ error: "Failed to load items" }, { status: 500 });
  }
}
