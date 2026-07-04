import { PrismaClient } from "@prisma/client";
import { MOCK_ITEMS } from "../lib/mock/items";

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding ${MOCK_ITEMS.length} items...`);

  for (const item of MOCK_ITEMS) {
    await prisma.item.upsert({
      where: { marketHashName: item.marketHashName },
      update: {},
      create: {
        marketHashName: item.marketHashName,
        name: item.name,
        weaponType: item.weaponType,
        rarity: item.rarity as any,
        imageUrl: item.imageUrl,
        lastPrice: item.lastPrice,
        lastVolume: item.volume,
        change24h: item.change24h,
        change7d: item.change7d,
        lastFetchedAt: new Date(),
      },
    });
  }

  console.log("Done. Run `npm run cron:snapshot` (or hit /api/cron/snapshot) to pull live Steam prices.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
