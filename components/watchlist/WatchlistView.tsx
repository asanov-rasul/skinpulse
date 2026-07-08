"use client";

import { useEffect } from "react";
import { Reorder } from "framer-motion";
import { Star } from "lucide-react";
import { useWatchlistStore, type WatchlistItem } from "@/lib/store/useWatchlistStore";
import { useToastStore } from "@/lib/store/useToastStore";
import { WatchlistRow } from "./WatchlistRow";

type ApiWatchlistEntry = {
  id: string;
  itemId: string;
  targetPrice: number | null;
  sortOrder: number;
  item: {
    marketHashName: string;
    name: string;
    imageUrl: string;
    rarity: string;
    lastPrice: number | null;
    change24h: number | null;
  };
};

function toWatchlistItem(entry: ApiWatchlistEntry): WatchlistItem {
  return {
    id: entry.id,
    itemId: entry.itemId,
    marketHashName: entry.item.marketHashName,
    name: entry.item.name,
    imageUrl: entry.item.imageUrl,
    rarity: entry.item.rarity,
    lastPrice: entry.item.lastPrice,
    change24h: entry.item.change24h,
    targetPrice: entry.targetPrice,
    sortOrder: entry.sortOrder,
  };
}

export function WatchlistView() {
  const { items, loaded, setItems, reorder, removeOptimistic, rollbackRemove } = useWatchlistStore();
  const pushToast = useToastStore((s) => s.push);

  useEffect(() => {
    if (loaded) return;
    fetch("/api/watchlist")
      .then((res) => res.json())
      .then((data: { entries: ApiWatchlistEntry[] }) => {
        setItems((data.entries ?? []).map(toWatchlistItem));
      })
      .catch(() => setItems([]));
  }, [loaded, setItems]);

  function handleRemove(itemId: string) {
    const removed = removeOptimistic(itemId);
    if (!removed) return;

    fetch(`/api/watchlist/${itemId}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        pushToast({
          title: "Removed from watchlist",
          description: removed.name,
          variant: "default",
        });
      })
      .catch(() => {
        rollbackRemove(removed);
        pushToast({
          title: "Couldn't remove item",
          description: "Please try again.",
          variant: "default",
        });
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
