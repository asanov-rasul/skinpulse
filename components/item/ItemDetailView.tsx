"use client";

import { useState } from "react";
import { Star, Bell } from "lucide-react";
import { ParallaxImage } from "@/components/item/ParallaxImage";
import { PriceChart } from "@/components/item/PriceChart";
import { VolatilityStats } from "@/components/item/VolatilityStats";
import { SimilarItems } from "@/components/item/SimilarItems";
import { LiveViewers } from "@/components/item/LiveViewers";
import { AlertModal } from "@/components/alerts/AlertModal";
import { RarityBadge } from "@/components/ui/RarityBadge";
import { PriceChange } from "@/components/ui/PriceChange";
import { formatPrice } from "@/lib/utils/format";
import { RARITY_COLOR } from "@/lib/utils/rarity";
import { useWatchlistStore } from "@/lib/store/useWatchlistStore";
import { useToastStore } from "@/lib/store/useToastStore";
import { cn } from "@/lib/utils/cn";
import type { MockItem } from "@/lib/mock/items";

export function ItemDetailView({
  item,
  similar,
}: {
  item: MockItem;
  similar: MockItem[];
}) {
  const [alertOpen, setAlertOpen] = useState(false);
  const isWatched = useWatchlistStore((s) => s.isWatched(item.id));
  const addOptimistic = useWatchlistStore((s) => s.addOptimistic);
  const removeOptimistic = useWatchlistStore((s) => s.removeOptimistic);
  const pushToast = useToastStore((s) => s.push);

  function toggleWatch() {
    if (isWatched) {
      removeOptimistic(item.id);
    } else {
      addOptimistic({
        id: `local-${item.id}`,
        itemId: item.id,
        marketHashName: item.marketHashName,
        name: item.name,
        imageUrl: item.imageUrl,
        rarity: item.rarity,
        lastPrice: item.lastPrice,
        change24h: item.change24h,
        targetPrice: null,
        sortOrder: 0,
      });
    }
  }

  function handleCreateAlert(direction: "above" | "below", price: number) {
    pushToast({
      title: "Alert created",
      description: `We'll notify you when ${item.name} goes ${direction} ${formatPrice(price)}`,
      variant: "success",
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ParallaxImage
          src={item.imageUrl}
          alt={item.name}
          rarity={item.rarity}
          layoutId={`item-image-${item.id}`}
        />

        <div className="flex flex-col justify-center">
          <div className="mb-2 flex items-center gap-2">
            <RarityBadge rarity={item.rarity} />
            <LiveViewers seed={item.id} />
          </div>
          <h1 className="mb-1 text-2xl font-semibold text-white sm:text-3xl">{item.name}</h1>
          <p className="mb-4 text-sm text-white/40">{item.marketHashName}</p>

          <div className="mb-5 flex items-end gap-3">
            <span className="tabular text-3xl font-bold text-white">
              {formatPrice(item.lastPrice)}
            </span>
            <PriceChange value={item.change24h} size="md" />
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleWatch}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition",
                isWatched
                  ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                  : "border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.06]"
              )}
            >
              <Star className={cn("h-4 w-4", isWatched && "fill-amber-400")} />
              {isWatched ? "In watchlist" : "Add to watchlist"}
            </button>
            <button
              onClick={() => setAlertOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/[0.06]"
            >
              <Bell className="h-4 w-4" />
              Set alert
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <VolatilityStats change7d={item.change7d} volume={item.volume} />
      </div>

      <div className="mt-6">
        <PriceChart
          basePrice={item.lastPrice}
          volatility={Math.max(2, Math.abs(item.change7d))}
          color={RARITY_COLOR[item.rarity]}
        />
      </div>

      <div className="mt-8">
        <SimilarItems items={similar} />
      </div>

      <AlertModal
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        currentPrice={item.lastPrice}
        itemName={item.name}
        onCreate={handleCreateAlert}
      />
    </div>
  );
}
