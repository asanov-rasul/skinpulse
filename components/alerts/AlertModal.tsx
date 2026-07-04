"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Bell, ArrowUp, ArrowDown } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function AlertModal({
  open,
  onClose,
  currentPrice,
  itemName,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  currentPrice: number;
  itemName: string;
  onCreate: (direction: "above" | "below", price: number) => void;
}) {
  const [direction, setDirection] = useState<"above" | "below">("above");
  const min = currentPrice * 0.5;
  const max = currentPrice * 1.5;
  const [target, setTarget] = useState(currentPrice);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="glass fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl p-5 shadow-glass"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-white/70" />
                <h3 className="text-sm font-medium text-white">Set price alert</h3>
              </div>
              <button onClick={onClose} className="rounded-full p-1 text-white/40 hover:bg-white/5 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mb-4 truncate text-xs text-white/50">{itemName}</p>

            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setDirection("above")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition",
                  direction === "above"
                    ? "border-accent-up/40 bg-accent-up/10 text-accent-up"
                    : "border-white/10 text-white/50 hover:text-white/80"
                )}
              >
                <ArrowUp className="h-3.5 w-3.5" /> Above
              </button>
              <button
                onClick={() => setDirection("below")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition",
                  direction === "below"
                    ? "border-accent-down/40 bg-accent-down/10 text-accent-down"
                    : "border-white/10 text-white/50 hover:text-white/80"
                )}
              >
                <ArrowDown className="h-3.5 w-3.5" /> Below
              </button>
            </div>

            <div className="mb-1 flex items-center justify-between text-xs text-white/50">
              <span>Target price</span>
              <motion.span
                key={target.toFixed(2)}
                initial={{ opacity: 0.5, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                className="tabular font-semibold text-white"
              >
                {formatPrice(target)}
              </motion.span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={(max - min) / 100}
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="w-full accent-white"
            />
            <div className="mb-5 flex justify-between text-[10px] text-white/30">
              <span>{formatPrice(min)}</span>
              <span>{formatPrice(max)}</span>
            </div>

            <button
              onClick={() => {
                onCreate(direction, target);
                onClose();
              }}
              className="w-full rounded-lg bg-white py-2.5 text-sm font-medium text-base-950 transition hover:bg-white/90"
            >
              Create alert
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
