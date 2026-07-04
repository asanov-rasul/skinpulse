import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { formatPercent } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function PriceChange({
  value,
  size = "sm",
}: {
  value: number | null | undefined;
  size?: "sm" | "md";
}) {
  const isUp = (value ?? 0) > 0;
  const isDown = (value ?? 0) < 0;
  const isFlat = !value;

  const Icon = isUp ? ArrowUpRight : isDown ? ArrowDownRight : Minus;

  return (
    <span
      className={cn(
        "tabular inline-flex items-center gap-0.5 font-medium",
        size === "sm" ? "text-xs" : "text-sm",
        isUp && "text-accent-up",
        isDown && "text-accent-down",
        isFlat && "text-accent-neutral"
      )}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} strokeWidth={2.5} />
      {formatPercent(value)}
    </span>
  );
}
