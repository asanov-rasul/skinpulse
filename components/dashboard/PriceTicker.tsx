import { formatPrice } from "@/lib/utils/format";
import { PriceChange } from "@/components/ui/PriceChange";
import { MOCK_ITEMS } from "@/lib/mock/items";

export function PriceTicker() {
  // Duplicate the list so the scroll loop (translateX -50%) is seamless
  const items = [...MOCK_ITEMS, ...MOCK_ITEMS];

  return (
    <div className="relative overflow-hidden border-b border-white/5 bg-base-950/80 py-2">
      <div className="flex w-max animate-ticker-scroll gap-8">
        {items.map((item, i) => (
          <div key={`${item.id}-${i}`} className="flex shrink-0 items-center gap-2 text-xs">
            <span className="text-white/60">{item.name}</span>
            <span className="tabular font-medium text-white">{formatPrice(item.lastPrice)}</span>
            <PriceChange value={item.change24h} size="sm" />
          </div>
        ))}
      </div>
      {/* Edge fades so the ticker doesn't hard-cut at the viewport edge */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-base-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-base-950 to-transparent" />
    </div>
  );
}
