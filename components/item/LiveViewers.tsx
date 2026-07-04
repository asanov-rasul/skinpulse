"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Eye } from "lucide-react";

/**
 * Emulated "N people watching" counter. This is explicitly a UI-engagement
 * device, not real telemetry — the number is a seeded random walk, not
 * derived from any actual viewer tracking. Kept clearly scoped to this
 * component so it's obvious where to wire up real presence data later
 * (e.g. a WebSocket room count) if that's ever built.
 */
export function LiveViewers({ seed }: { seed: string }) {
  const [target, setTarget] = useState(() => seededBase(seed));
  const spring = useSpring(target, { stiffness: 60, damping: 15 });
  const rounded = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    spring.set(target);
  }, [target, spring]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTarget((prev) => Math.max(3, prev + Math.round((Math.random() - 0.5) * 6)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60">
      <Eye className="h-3.5 w-3.5 text-accent-up" />
      <motion.span className="tabular font-medium text-white">{rounded}</motion.span>
      watching now
    </div>
  );
}

function seededBase(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return 8 + (hash % 60);
}
