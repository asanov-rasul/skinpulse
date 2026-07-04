import { create } from "zustand";

export interface WatchlistItem {
  id: string; // watchlist entry id
  itemId: string;
  marketHashName: string;
  name: string;
  imageUrl: string;
  rarity: string;
  lastPrice: number | null;
  change24h: number | null;
  targetPrice: number | null;
  sortOrder: number;
}

interface WatchlistState {
  items: WatchlistItem[];
  loaded: boolean;
  setItems: (items: WatchlistItem[]) => void;
  addOptimistic: (item: WatchlistItem) => void;
  removeOptimistic: (itemId: string) => WatchlistItem | undefined;
  rollbackRemove: (item: WatchlistItem) => void;
  rollbackAdd: (itemId: string) => void;
  reorder: (items: WatchlistItem[]) => void;
  isWatched: (itemId: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  items: [],
  loaded: false,

  setItems: (items) => set({ items, loaded: true }),

  // Optimistic add: caller is responsible for calling the API and rolling
  // back (via rollbackAdd) if the request fails.
  addOptimistic: (item) =>
    set((state) => ({
      items: state.items.some((i) => i.itemId === item.itemId)
        ? state.items
        : [...state.items, item],
    })),

  removeOptimistic: (itemId) => {
    const existing = get().items.find((i) => i.itemId === itemId);
    set((state) => ({ items: state.items.filter((i) => i.itemId !== itemId) }));
    return existing;
  },

  rollbackRemove: (item) =>
    set((state) => ({
      items: state.items.some((i) => i.itemId === item.itemId)
        ? state.items
        : [...state.items, item],
    })),

  rollbackAdd: (itemId) =>
    set((state) => ({ items: state.items.filter((i) => i.itemId !== itemId) })),

  reorder: (items) => set({ items }),

  isWatched: (itemId) => get().items.some((i) => i.itemId === itemId),
}));
