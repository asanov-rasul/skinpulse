"use client";

import { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import type { MockItem } from "@/lib/mock/items";
import { useFilterStore } from "@/lib/store/useFilterStore";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { FilterPanel } from "@/components/search/FilterPanel";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { ItemCard } from "@/components/dashboard/ItemCard";
import { ItemCardSkeletonGrid } from "@/components/ui/Skeleton";

type ApiItem = {
  id: string;
  name: string;
  marketHashName: string;
  weaponType: string;
  rarity: MockItem["rarity"];
  imageUrl: string;
  lastPrice: number | null;
  lastVolume: number | null;
  change24h: number | null;
  change7d: number | null;
  sparkline?: number[];
};

function toMockItemShape(item: ApiItem): MockItem {
  return {
    id: item.id,
    marketHashName: item.marketHashName,
    name: item.name,
    weaponType: item.weaponType,
    rarity: item.rarity,
    imageUrl: item.imageUrl,
    lastPrice: item.lastPrice ?? 0,
    change24h: item.change24h ?? 0,
    change7d: item.change7d ?? 0,
    volume: item.lastVolume ?? 0,
    sparkline: item.sparkline ?? [],
  };
}

export function SearchView() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 200);
  const { rarities, weaponTypes } = useFilterStore();

  const [results, setResults] = useState<MockItem[]>([]);
  const [isPending, setIsPending] = useState(true);

  function handleChange(value: string) {
    setQuery(value);
  }

  useEffect(() => {
    const controller = new AbortController();
    setIsPending(true);

    const params = new URLSearchParams();
    if (debouncedQuery) params.set("query", debouncedQuery);
    if (rarities.length) params.set("rarity", rarities.join(","));
    if (weaponTypes.length) params.set("weapon", weaponTypes.join(","));

    fetch(`/api/items?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data: { items: ApiItem[] }) => {
        setResults((data.items ?? []).map(toMockItemShape));
        setIsPending(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setIsPending(false);
      });

    return () => controller.abort();
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
