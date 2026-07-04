"use client";

import { useEffect } from "react";
import { Reorder } from "framer-motion";
import { Star } from "lucide-react";
import { useWatchlistStore, type WatchlistItem } from "@/lib/store/useWatchlistStore";
import { useToastStore } from "@/lib/store/useToastStore";
import { WatchlistRow } from "./WatchlistRow";
import { MOCK_ITEMS } from "@/lib/mock/items";

// Seed a few watchlist entries on first load so the page isn't empty for a
// fresh demo session. In production this initial load comes from
// GET /api/watchlist instead.
const SEED: WatchlistItem[] = MOCK_ITEMS.slice(0, 3).map((item, i) => ({
  id: `seed-${item.id}`,
  itemId: item.id,
  marketHashName: item.marketHashName,
  name: item.name,
  imageUrl: item.imageUrl,
  rarity: item.rarity,
  lastPrice: item.lastPrice,
  change24h: item.change24h,
  targetPrice: null,
  sortOrder: i,
}));

export function WatchlistView() {
  const { items, loaded, setItems, reorder, removeOptimistic } = useWatchlistStore();
  const pushToast = useToastStore((s) => s.push);

  useEffect(() => {
    if (!loaded) setItems(SEED);
  }, [loaded, setItems]);

  function handleRemove(itemId: string) {
    const removed = removeOptimistic(itemId);
    if (!removed) return;

    // Optimistic remove: in production this fires DELETE /api/watchlist/:id
    // and calls rollbackRemove(removed) if the server call fails.
    pushToast({
      title: "Removed from watchlist",
      description: removed.name,
      variant: "default",
    });
  }

  if (!loaded) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Watchlist</h1>
        <p className="mt-1 text-sm text-white/50">Drag to reorder · swipe left to remove</p>
      </div>

      {items.length === 0 ? (
        <div className="glass flex flex-col items-center rounded-2xl p-12 text-center">
          <Star className="mb-3 h-8 w-8 text-white/20" />
          <p className="text-sm text-white/50">Your watchlist is empty.</p>
          <p className="mt-1 text-xs text-white/30">
            Tap the star on any skin to start tracking it here.
          </p>
        </div>
      ) : (
        <Reorder.Group axis="y" values={items} onReorder={reorder} className="list-none">
          {items.map((entry) => (
            <WatchlistRow key={entry.itemId} entry={entry} onRemove={handleRemove} />
          ))}
        </Reorder.Group>
      )}
    </div>
  );
}
