import { Activity, BarChart3 } from "lucide-react";
import { formatCompactNumber } from "@/lib/utils/format";

function volatilityLabel(pct: number): { label: string; color: string } {
  if (pct < 3) return { label: "Low", color: "text-accent-up" };
  if (pct < 10) return { label: "Moderate", color: "text-amber-400" };
  return { label: "High", color: "text-accent-down" };
}

export function VolatilityStats({
  change7d,
  volume,
}: {
  change7d: number;
  volume: number;
}) {
  const vol = volatilityLabel(Math.abs(change7d));

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="glass rounded-xl p-4">
        <div className="mb-1.5 flex items-center gap-1.5 text-xs text-white/50">
          <Activity className="h-3.5 w-3.5" />
          7d Volatility
        </div>
        <p className={`text-lg font-semibold ${vol.color}`}>{vol.label}</p>
      </div>
      <div className="glass rounded-xl p-4">
        <div className="mb-1.5 flex items-center gap-1.5 text-xs text-white/50">
          <BarChart3 className="h-3.5 w-3.5" />
          24h Volume
        </div>
        <p className="tabular text-lg font-semibold text-white">{formatCompactNumber(volume)}</p>
      </div>
    </div>
  );
}
