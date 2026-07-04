import { TrendingUp, TrendingDown } from "lucide-react";
import { getTopMovers } from "@/lib/mock/items";
import { ItemCard } from "./ItemCard";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";

export function HeroBento() {
  const gainers = getTopMovers("up", 4);
  const losers = getTopMovers("down", 4);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Market Pulse
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Live CS2 skin prices, tracked across the market.
        </p>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-accent-up" />
        <h2 className="text-sm font-medium text-white/80">Top Gainers · 24h</h2>
      </div>
      <StaggerGrid className="mb-10">
        {gainers.map((item) => (
          <StaggerItem key={item.id}>
            <ItemCard item={item} />
          </StaggerItem>
        ))}
      </StaggerGrid>

      <div className="mb-6 flex items-center gap-2">
        <TrendingDown className="h-4 w-4 text-accent-down" />
        <h2 className="text-sm font-medium text-white/80">Top Losers · 24h</h2>
      </div>
      <StaggerGrid>
        {losers.map((item) => (
          <StaggerItem key={item.id}>
            <ItemCard item={item} />
          </StaggerItem>
        ))}
      </StaggerGrid>
    </section>
  );
}
