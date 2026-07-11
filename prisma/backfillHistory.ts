import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// One-time (but safely re-runnable) backfill: seeds 7 daily PriceSnapshot
// rows per item that has no history yet, ending at that item's current
// lastPrice, using a random walk. Points are flagged isSynthetic: true.
//
// This exists purely so the price chart isn't empty right after an item is
// added — the real cron (see app/api/cron/snapshot/route.ts) now runs once
// a day for every item and takes over from here with genuine Steam data.
// Because PriceChart.tsx filters snapshots to "now - range days", these
// synthetic points age out of the 7D window after ~7 real days of cron
// runs, and out of 30D after ~30 — no manual cleanup required.
//
// Safe to re-run: it skips items that already have ANY snapshot (real or
// synthetic), so it never overwrites real data.
async function main() {
  const items = await prisma.item.findMany({
    where: { lastPrice: { not: null } },
  });

  console.log(`Found ${items.length} items with a price set.`);

  for (const item of items) {
    const existing = await prisma.priceSnapshot.count({ where: { itemId: item.id } });
    if (existing > 0) {
      console.log(`Skipping ${item.name} — already has ${existing} snapshot(s).`);
      continue;
    }

    const basePrice = item.lastPrice!;
    const days = 7;
    const volatility = Math.max(2, Math.abs(item.change7d ?? 5));
    const points: {
      itemId: string;
      price: number;
      volume: number;
      timestamp: Date;
      isSynthetic: boolean;
    }[] = [];

    let price = basePrice * (1 - volatility / 100);
    const now = Date.now();

    for (let i = days; i >= 0; i--) {
      price += (Math.random() - 0.48) * (basePrice * (volatility / 100) * 0.08);
      price = Math.max(price, basePrice * 0.5);
      points.push({
        itemId: item.id,
        price: Number(price.toFixed(2)),
        volume: Math.round(200 + Math.random() * 2000),
        timestamp: new Date(now - i * 24 * 60 * 60 * 1000),
        isSynthetic: true,
      });
    }
    // Anchor the last point to the item's real current price instead of
    // whatever the random walk landed on.
    points[points.length - 1].price = basePrice;

    await prisma.priceSnapshot.createMany({ data: points });
    console.log(`Backfilled ${points.length} synthetic days for ${item.name}.`);
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
