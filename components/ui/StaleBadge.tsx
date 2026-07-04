import { AlertTriangle } from "lucide-react";
import { formatRelativeMinutes } from "@/lib/utils/format";

export function StaleBadge({ lastFetchedAt }: { lastFetchedAt: Date | string | null }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-400">
      <AlertTriangle className="h-3 w-3" />
      Data may be outdated · updated {formatRelativeMinutes(lastFetchedAt)}
    </span>
  );
}
