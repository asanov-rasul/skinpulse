"use client";

import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { MOCK_ITEMS } from "@/lib/mock/items";
import { useFilterStore } from "@/lib/store/useFilterStore";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { FilterPanel } from "@/components/search/FilterPanel";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { ItemCard } from "@/components/dashboard/ItemCard";
import { ItemCardSkeletonGrid } from "@/components/ui/Skeleton";

export function SearchView() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 200);
  const { rarities, weaponTypes } = useFilterStore();

  // Simulated loading state so the skeleton path is actually reachable —
  // in production this flips based on the real fetch/query lifecycle.
  const [isPending, setIsPending] = useState(false);

  function handleChange(value: string) {
    setQuery(value);
    setIsPending(true);
    setTimeout(() => setIsPending(false), 220);
  }

  const results = useMemo(() => {
    return MOCK_ITEMS.filter((item) => {
      const matchesQuery = item.name.toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesRarity = rarities.length === 0 || rarities.includes(item.rarity);
      const matchesWeapon = weaponTypes.length === 0 || weaponTypes.includes(item.weaponType);
      return matchesQuery && matchesRarity && matchesWeapon;
    });
  }, [debouncedQuery, rarities, weaponTypes]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="relative mb-6">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <input
          autoFocus
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search skins, cases, knives…"
          className="w-full rounded-full border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <FilterPanel />

        <div>
          <p className="mb-4 text-xs text-white/40">
            {isPending ? "Searching…" : `${results.length} result${results.length === 1 ? "" : "s"}`}
          </p>

          {isPending ? (
            <ItemCardSkeletonGrid count={8} />
          ) : results.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center text-sm text-white/40">
              No skins match your search.
            </div>
          ) : (
            <StaggerGrid>
              {results.map((item) => (
                <StaggerItem key={item.id}>
                  <ItemCard item={item} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}
        </div>
      </div>
    </div>
  );
}
