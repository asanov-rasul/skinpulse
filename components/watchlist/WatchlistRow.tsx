"use client";

import Link from "next/link";
import Image from "next/image";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, X } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { PriceChange } from "@/components/ui/PriceChange";
import { RarityBadge } from "@/components/ui/RarityBadge";
import type { WatchlistItem } from "@/lib/store/useWatchlistStore";
import type { Rarity } from "@/lib/utils/rarity";
import { getMockItemById } from "@/lib/mock/items";
import { Sparkline } from "@/components/ui/Sparkline";

export function WatchlistRow({
  entry,
  onRemove,
}: {
  entry: WatchlistItem;
  onRemove: (itemId: string) => void;
}) {
  const controls = useDragControls();
  const mockItem = getMockItemById(entry.itemId);

  return (
    <Reorder.Item
      value={entry}
      dragListener={false}
      dragControls={controls}
      className="glass mb-2 flex items-center gap-3 rounded-xl p-3"
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
      drag="x"
      dragConstraints={{ left: -80, right: 0 }}
      dragElastic={{ left: 0.5, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x < -60) onRemove(entry.itemId);
      }}
    >
      <button
        onPointerDown={(e) => controls.start(e)}
        className="hidden shrink-0 cursor-grab touch-none text-white/20 hover:text-white/50 sm:block"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <Link href={`/item/${entry.itemId}`} className="relative h-12 w-12 shrink-0">
        <Image
          src={entry.imageUrl}
          alt={entry.name}
          fill
          className="object-contain"
          sizes="48px"
          unoptimized
        />
      </Link>

      <Link href={`/item/${entry.itemId}`} className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white/90">{entry.name}</p>
        <RarityBadge rarity={entry.rarity as Rarity} />
      </Link>

      {mockItem && (
        <div className="hidden w-20 sm:block">
          <Sparkline
            data={mockItem.sparkline}
            color={mockItem.change24h >= 0 ? "#3fd67a" : "#ef4a5f"}
            height={28}
          />
        </div>
      )}

      <div className="text-right">
        <p className="tabular text-sm font-semibold text-white">{formatPrice(entry.lastPrice)}</p>
        <PriceChange value={entry.change24h} />
      </div>

      <button
        onClick={() => onRemove(entry.itemId)}
        className="hidden shrink-0 rounded-full p-1.5 text-white/30 hover:bg-white/5 hover:text-white sm:block"
        aria-label="Remove from watchlist"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </Reorder.Item>
  );
}
