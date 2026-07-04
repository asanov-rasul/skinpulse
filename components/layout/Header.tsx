import Link from "next/link";
import { Activity, Search, Star, Bell } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-base-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-covert to-classified shadow-glow-covert" style={{ background: "linear-gradient(135deg, #eb4b4b, #d32ce6)" }}>
            <Activity className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-mono text-sm font-semibold tracking-tight text-white">
            SkinPulse
          </span>
        </Link>

        <Link
          href="/search"
          className="flex flex-1 max-w-md items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/40 transition hover:border-white/20 hover:bg-white/[0.05]"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search skins, cases, knives…</span>
          <span className="sm:hidden">Search…</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/watchlist"
            className="rounded-full p-2 text-white/60 transition hover:bg-white/5 hover:text-white"
            aria-label="Watchlist"
          >
            <Star className="h-4.5 w-4.5" />
          </Link>
          <button
            className="rounded-full p-2 text-white/60 transition hover:bg-white/5 hover:text-white"
            aria-label="Alerts"
          >
            <Bell className="h-4.5 w-4.5" />
          </button>
        </nav>
      </div>
    </header>
  );
}
