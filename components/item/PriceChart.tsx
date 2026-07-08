"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const RANGES = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
] as const;

type RangeLabel = (typeof RANGES)[number]["label"];
type HistoryPoint = { date: string; price: number };

export function PriceChart({
  history,
  basePrice,
  color = "#3fd67a",
}: {
  history: HistoryPoint[];
  basePrice: number;
  color?: string;
}) {
  const [range, setRange] = useState<RangeLabel>("30D");

  const data = useMemo(() => {
    const days = RANGES.find((r) => r.label === range)!.days;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const filtered = history.filter((p) => new Date(p.date).getTime() >= cutoff);
    // Real snapshots only run once a day (see vercel.json cron), so early on
    // there may be just 1-2 points. Render what we actually have rather than
    // padding with fabricated data — the empty-state below covers 0 points.
    return filtered;
  }, [range, history]);

  const hasData = data.length > 0;

  return (
    <div className="glass rounded-2xl p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-white/50">Price history</p>
          <p className="tabular text-xl font-semibold text-white">{formatPrice(basePrice)}</p>
        </div>
        <div className="flex gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
          {RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setRange(r.label)}
              className={cn(
                "relative rounded-full px-3 py-1 text-xs font-medium transition-colors",
                range === r.label ? "text-base-950" : "text-white/50 hover:text-white/80"
              )}
            >
              {range === r.label && (
                <motion.div
                  layoutId="range-pill"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      {!hasData ? (
        <div className="flex h-64 items-center justify-center text-sm text-white/40 sm:h-80">
          Not enough price history yet for this range — check back after the next snapshot.
        </div>
      ) : (
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                stroke="rgba(255,255,255,0.3)"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                minTickGap={40}
              />
              <YAxis
                domain={["auto", "auto"]}
                stroke="rgba(255,255,255,0.3)"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}`}
                width={48}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "3 3" }} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={2}
                fill="url(#priceGradient)"
                animationDuration={500}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs shadow-glass">
      <p className="text-white/50">
        {label &&
          new Date(label).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
      </p>
      <p className="tabular mt-0.5 font-semibold text-white">{formatPrice(payload[0]?.value)}</p>
    </div>
  );
}
