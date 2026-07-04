import { create } from "zustand";
import type { Rarity } from "@/lib/utils/rarity";

interface FilterState {
  query: string;
  rarities: Rarity[];
  weaponTypes: string[];
  minPrice: number | null;
  maxPrice: number | null;
  setQuery: (q: string) => void;
  toggleRarity: (r: Rarity) => void;
  toggleWeaponType: (w: string) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  reset: () => void;
}

const initial = {
  query: "",
  rarities: [] as Rarity[],
  weaponTypes: [] as string[],
  minPrice: null as number | null,
  maxPrice: null as number | null,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initial,
  setQuery: (query) => set({ query }),
  toggleRarity: (r) =>
    set((state) => ({
      rarities: state.rarities.includes(r)
        ? state.rarities.filter((x) => x !== r)
        : [...state.rarities, r],
    })),
  toggleWeaponType: (w) =>
    set((state) => ({
      weaponTypes: state.weaponTypes.includes(w)
        ? state.weaponTypes.filter((x) => x !== w)
        : [...state.weaponTypes, w],
    })),
  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
  reset: () => set(initial),
}));
