import { RARITY_COLOR, RARITY_LABEL, type Rarity } from "@/lib/utils/rarity";
import { cn } from "@/lib/utils/cn";

export function RarityBadge({ rarity, className }: { rarity: Rarity; className?: string }) {
  const color = RARITY_COLOR[rarity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        className
      )}
      style={{
        color,
        backgroundColor: `${color}1a`,
        border: `1px solid ${color}40`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {RARITY_LABEL[rarity]}
    </span>
  );
}
