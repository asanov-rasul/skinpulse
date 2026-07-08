import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// One-time backfill: seeds ~30 daily PriceSnapshot rows per item, ending at
// that item's current lastPrice, using a random walk. This exists purely so
// the price chart isn't empty/single-point right after deploy — the real
// cron (see app/api/cron/snapshot/route.ts) takes over from here with
// genuine Steam data. Safe to re-run: it skips items that already have
// snapshot history.
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
    const days = 30;
    const volatility = Math.max(2, Math.abs(item.change7d ?? 5));
    const points: { itemId: string; price: number; volume: number; timestamp: Date }[] = [];

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
      });
    }
    // Anchor the last point to the item's real current price instead of
    // whatever the random walk landed on.
    points[points.length - 1].price = basePrice;

    await prisma.priceSnapshot.createMany({ data: points });
    console.log(`Backfilled ${points.length} days for ${item.name}.`);
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
