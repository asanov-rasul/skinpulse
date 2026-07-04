import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils/format";
import { PriceChange } from "@/components/ui/PriceChange";
import type { MockItem } from "@/lib/mock/items";

export function SimilarItems({ items }: { items: MockItem[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <h2 className="mb-3 text-sm font-medium text-white/80">Similar skins</h2>
      <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/item/${item.id}`}
            className="glass w-40 shrink-0 snap-start rounded-xl p-3 transition hover:bg-white/[0.06]"
          >
            <div className="relative mb-2 h-20 w-full">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-contain"
                sizes="160px"
                unoptimized
              />
            </div>
            <p className="truncate text-xs font-medium text-white/90">{item.name}</p>
            <div className="mt-1 flex items-center justify-between">
              <span className="tabular text-sm font-semibold text-white">
                {formatPrice(item.lastPrice)}
              </span>
              <PriceChange value={item.change24h} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
