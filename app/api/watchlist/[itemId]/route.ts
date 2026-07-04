import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getUserId(req: NextRequest): string {
  return req.headers.get("x-user-id") ?? req.nextUrl.searchParams.get("userId") ?? "demo-user";
}

export async function DELETE(req: NextRequest, { params }: { params: { itemId: string } }) {
  const userId = getUserId(req);
  try {
    await prisma.watchlistEntry.delete({
      where: { userId_itemId: { userId, itemId: params.itemId } },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[/api/watchlist/${params.itemId} DELETE] failed:`, err);
    return NextResponse.json({ error: "Failed to remove from watchlist" }, { status: 500 });
  }
}
