"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { RARITY_LABEL, type Rarity } from "@/lib/utils/rarity";
import { useFilterStore } from "@/lib/store/useFilterStore";
import { WEAPON_TYPES } from "@/lib/mock/items";
import { cn } from "@/lib/utils/cn";

const RARITIES: Rarity[] = [
  "CONSUMER",
  "INDUSTRIAL",
  "MIL_SPEC",
  "RESTRICTED",
  "CLASSIFIED",
  "COVERT",
  "GOLD",
];

export function FilterPanel() {
  const [expanded, setExpanded] = useState(true);
  const { rarities, weaponTypes, toggleRarity, toggleWeaponType, reset } = useFilterStore();

  const activeCount = rarities.length + weaponTypes.length;

  return (
    <div className="glass rounded-2xl p-4">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-white/80">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-white">
              {activeCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn("h-4 w-4 text-white/40 transition-transform", expanded && "rotate-180")}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-white/40">Rarity</p>
              <div className="flex flex-wrap gap-1.5">
                {RARITIES.map((r) => (
                  <button
                    key={r}
                    onClick={() => toggleRarity(r)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] transition",
                      rarities.includes(r)
                        ? "border-white/30 bg-white/10 text-white"
                        : "border-white/10 text-white/50 hover:text-white/80"
                    )}
                  >
                    {RARITY_LABEL[r]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-white/40">Weapon</p>
              <div className="flex flex-wrap gap-1.5">
                {WEAPON_TYPES.map((w) => (
                  <button
                    key={w}
                    onClick={() => toggleWeaponType(w)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] transition",
                      weaponTypes.includes(w)
                        ? "border-white/30 bg-white/10 text-white"
                        : "border-white/10 text-white/50 hover:text-white/80"
                    )}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {activeCount > 0 && (
              <button
                onClick={reset}
                className="mt-4 text-xs text-white/40 underline-offset-2 hover:text-white/70 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
