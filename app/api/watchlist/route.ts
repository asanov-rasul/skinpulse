import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// NOTE: This demo has no auth system wired up, so userId is taken from a
// header/query param as a stand-in. Replace with your real session/user
// lookup before shipping (e.g. from next-auth or Clerk).
function getUserId(req: NextRequest): string {
  return req.headers.get("x-user-id") ?? req.nextUrl.searchParams.get("userId") ?? "demo-user";
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  try {
    const entries = await prisma.watchlistEntry.findMany({
      where: { userId },
      orderBy: { sortOrder: "asc" },
      include: { item: true },
    });
    return NextResponse.json({ entries });
  } catch (err) {
    console.error("[/api/watchlist GET] failed:", err);
    return NextResponse.json({ error: "Failed to load watchlist" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  const body = await req.json().catch(() => null);
  const itemId: string | undefined = body?.itemId;

  if (!itemId) {
    return NextResponse.json({ error: "itemId is required" }, { status: 400 });
  }

  try {
    const maxOrder = await prisma.watchlistEntry.aggregate({
      where: { userId },
      _max: { sortOrder: true },
    });

    const entry = await prisma.watchlistEntry.upsert({
      where: { userId_itemId: { userId, itemId } },
      update: {},
      create: { userId, itemId, sortOrder: (maxOrder._max.sortOrder ?? -1) + 1 },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (err) {
    console.error("[/api/watchlist POST] failed:", err);
    return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 });
  }
}
