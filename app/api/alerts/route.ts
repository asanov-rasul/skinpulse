import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getUserId(req: NextRequest): string {
  return req.headers.get("x-user-id") ?? req.nextUrl.searchParams.get("userId") ?? "demo-user";
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  try {
    const alerts = await prisma.priceAlert.findMany({
      where: { userId },
      include: { item: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ alerts });
  } catch (err) {
    console.error("[/api/alerts GET] failed:", err);
    return NextResponse.json({ error: "Failed to load alerts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  const body = await req.json().catch(() => null);
  const { itemId, direction, targetPrice } = body ?? {};

  if (!itemId || !["above", "below"].includes(direction) || typeof targetPrice !== "number") {
    return NextResponse.json(
      { error: "itemId, direction ('above'|'below'), and numeric targetPrice are required" },
      { status: 400 }
    );
  }

  try {
    const alert = await prisma.priceAlert.create({
      data: { userId, itemId, direction, targetPrice },
    });
    return NextResponse.json({ alert }, { status: 201 });
  } catch (err) {
    console.error("[/api/alerts POST] failed:", err);
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
  }
}
