import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchPriceOverview } from "@/lib/steam/client";
import { RateLimitError } from "@/lib/steam/queue";

// Force this route to be treated as fully dynamic (never statically
// analyzed/executed at build time). Without this, Next.js's build-time
// "collecting page data" step imports this module, which in turn
// instantiates PrismaClient — and that import fails on Vercel's clean
// build machine if the Prisma Client hasn't been generated yet, causing
// the whole build to fail on this route specifically.
export const dynamic = "force-dynamic";

/**
 * GET /api/cron/snapshot
 *
 * Polls Steam for every item that's either in someone's watchlist or in
 * the top-100-by-recent-volume set, writes a PriceSnapshot row for each,
 * and updates the item's denormalized lastPrice/change24h/change7d fields.
 *
 * IMPORTANT: this deliberately runs requests one at a time via
 * fetchPriceOverview (which itself queues through steamQueue) rather than
 * Promise.all-ing the whole batch. Steam's priceoverview endpoint starts
 * throwing 429s well before you'd expect for even moderate concurrency —
 * see lib/steam/queue.ts for the backoff strategy. For a watchlist-sized
 * batch (dozens to low hundreds of items) this job can take several
 * minutes to complete; that's expected and fine for an hourly/N-hourly cron.
 *
 * Wire this up to Vercel Cron (vercel.json `crons`) or an external
 * scheduler hitting this URL with the CRON_SECRET header.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const watchlistedItemIds = await prisma.watchlistEntry.findMany({
    select: { itemId: true },
    distinct: ["itemId"],
  });

  const topItems = await prisma.item.findMany({
    orderBy: { lastVolume: "desc" },
    take: 100,
    select: { id: true },
  });

  const targetIds = Array.from(
    new Set([
      ...watchlistedItemIds.map((w: { itemId: string }) => w.itemId),
      ...topItems.map((t: { id: string }) => t.id),
    ])
  );

  const items = await prisma.item.findMany({
    where: { id: { in: targetIds } },
  });

  let succeeded = 0;
  let failed = 0;
  let rateLimited = 0;

  for (const item of items) {
    try {
      const result = await fetchPriceOverview(item.marketHashName);

      if (result.price === null) {
        failed++;
        await logFetch(item.marketHashName, false, undefined, "No price data returned");
        continue;
      }

      await prisma.priceSnapshot.create({
        data: { itemId: item.id, price: result.price, volume: result.volume ?? undefined },
      });

      const change24h = await computeChange(item.id, result.price, 24);
      const change7d = await computeChange(item.id, result.price, 24 * 7);

      await prisma.item.update({
        where: { id: item.id },
        data: {
          lastPrice: result.price,
          lastVolume: result.volume,
          lastFetchedAt: result.fetchedAt,
          fetchStale: false,
          change24h,
          change7d,
        },
      });

      succeeded++;
      await logFetch(item.marketHashName, true);
    } catch (err) {
      failed++;
      if (err instanceof RateLimitError) rateLimited++;
      await prisma.item
        .update({ where: { id: item.id }, data: { fetchStale: true } })
        .catch(() => {});
      await logFetch(
        item.marketHashName,
        false,
        err instanceof RateLimitError ? err.status : undefined,
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }

  return NextResponse.json({
    processed: items.length,
    succeeded,
    failed,
    rateLimited,
  });
}

async function computeChange(itemId: string, currentPrice: number, hoursAgo: number): Promise<number | null> {
  const cutoff = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
  const past = await prisma.priceSnapshot.findFirst({
    where: { itemId, timestamp: { lte: cutoff } },
    orderBy: { timestamp: "desc" },
  });
  if (!past || past.price === 0) return null;
  return Number((((currentPrice - past.price) / past.price) * 100).toFixed(2));
}

async function logFetch(
  marketHashName: string,
  success: boolean,
  statusCode?: number,
  message?: string
) {
  await prisma.fetchLog
    .create({ data: { marketHashName, success, statusCode, message } })
    .catch(() => {
      /* logging is best-effort */
    });
}
