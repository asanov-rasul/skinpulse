"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { TiltCard } from "@/components/motion/TiltCard";
import { Sparkline } from "@/components/ui/Sparkline";
import { PriceChange } from "@/components/ui/PriceChange";
import { RarityBadge } from "@/components/ui/RarityBadge";
import { formatPrice } from "@/lib/utils/format";
import { RARITY_COLOR, RARITY_GLOW_CLASS } from "@/lib/utils/rarity";
import { cn } from "@/lib/utils/cn";
import type { MockItem } from "@/lib/mock/items";
import { useWatchlistStore } from "@/lib/store/useWatchlistStore";

export function ItemCard({ item }: { item: MockItem }) {
  const isUp = item.change24h >= 0;
  const isWatched = useWatchlistStore((s) => s.isWatched(item.id));
  const addOptimistic = useWatchlistStore((s) => s.addOptimistic);
  const removeOptimistic = useWatchlistStore((s) => s.removeOptimistic);

  function toggleWatch(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (isWatched) {
      const removed = removeOptimistic(item.id);
      fetch(`/api/watchlist/${item.id}`, { method: "DELETE" }).catch(() => {
        if (removed) {
          addOptimistic({
            id: removed.id,
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
      });
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

      fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id }),
      }).catch(() => removeOptimistic(item.id));
    }
  }

  return (
    <Link href={`/item/${item.id}`} className="block">
      <TiltCard
        className={cn("glass rounded-2xl p-3.5 transition-shadow", RARITY_GLOW_CLASS[item.rarity])}
      >
        <motion.div layoutId={`item-image-${item.id}`} className="relative mb-3 h-28 sm:h-32">
          <div
            className="absolute inset-0 rounded-xl opacity-40"
            style={{
              background: `radial-gradient(circle at 50% 40%, ${RARITY_COLOR[item.rarity]}22, transparent 70%)`,
            }}
          />
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-contain p-2 drop-shadow-lg"
            sizes="(max-width: 640px) 45vw, 220px"
            unoptimized
          />
          <button
            onClick={toggleWatch}
            className="absolute right-0 top-0 rounded-full bg-base-950/60 p-1.5 backdrop-blur-sm transition hover:bg-base-950/90"
            aria-label={isWatched ? "Remove from watchlist" : "Add to watchlist"}
          >
            <Star
              className={cn(
                "h-3.5 w-3.5 transition-colors",
                isWatched ? "fill-amber-400 text-amber-400" : "text-base-600"
              )}
            />
          </button>
        </motion.div>

        <motion.div layoutId={`item-title-${item.id}`}>
          <p className="truncate text-sm font-medium text-white/90">{item.name}</p>
        </motion.div>
        <div className="mb-2 mt-1">
          <RarityBadge rarity={item.rarity} />
        </div>

        <Sparkline
          data={item.sparkline}
          color={isUp ? "#3fd67a" : "#ef4a5f"}
          height={32}
        />

        <div className="mt-2 flex items-end justify-between">
          <span className="tabular text-base font-semibold text-white">
            {formatPrice(item.lastPrice)}
          </span>
          <PriceChange value={item.change24h} />
        </div>
      </TiltCard>
    </Link>
  );
}
