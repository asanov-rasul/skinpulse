# SkinPulse

CS2 skin price tracker with live charts, watchlist, and price alerts. Built with Next.js 14 (App Router), TypeScript, Tailwind, Framer Motion, Recharts, Prisma/PostgreSQL, and Zustand.

## Quick start

```bash
npm install
cp .env.example .env        # then fill in DATABASE_URL
npm run db:migrate           # creates tables from prisma/schema.prisma
npm run db:seed              # loads a starter catalog of items
npm run dev
```

Visit `http://localhost:3000`. The dashboard, item pages, search, and watchlist all render immediately using mock data from `lib/mock/items.ts` — no database or Steam connectivity required to explore the UI.

The **API routes** (`/api/items`, `/api/watchlist`, `/api/alerts`, `/api/cron/snapshot`) are the real, database-backed layer. They need `DATABASE_URL` set and the schema migrated/seeded.

## About the Steam Market integration — read this before relying on it

`priceoverview` (`lib/steam/client.ts`) is Valve's **unofficial, undocumented** market endpoint. It's the one every third-party skin tracker uses because there's no public alternative, but a few things follow from that:

- **No CORS, no API key.** It can only be called server-side (which is what this project does — all Steam calls happen in API routes/cron, never from the browser).
- **Aggressive, unpublished rate limiting.** In practice a single IP gets throttled to roughly 15–20 requests/minute before Steam starts returning 429s, sometimes for tens of minutes at a stretch. `lib/steam/queue.ts` enforces one request at a time with a 1.5s floor between calls and exponential backoff (up to 60s) on 429/5xx. **Do not remove this and fan requests out in parallel** — it will get you rate-limited almost immediately.
- **Can change without notice.** It's not a supported product; Valve has silently changed rate limits and response shapes before.
- **No historical data.** `priceoverview` only returns a current lowest/median price and volume — there's no "give me 90 days of history" endpoint. All price history in this app is built by polling on a schedule and accumulating our own `PriceSnapshot` rows over time. A fresh install has no real history until the cron job has run repeatedly — expect it to take days/weeks of snapshots to populate meaningful 30d/90d charts. The item detail page currently renders a generated mock series for the chart; swap in the real `history` array returned by `/api/items/:id` once you have enough snapshots.

Given that, treat this as **a real, working integration with real constraints** — not a mocked demo dressed up as one. The cache layer (`lib/steam/priceService.ts`) is load-bearing, not decorative: it serves last-known-good prices with a `stale: true` flag whenever a live fetch fails, which is what lets the UI show "data may be outdated" instead of breaking.

If you want a smoother ride, several paid Steam data providers (e.g. steamwebapi.com, Montuga) offer higher rate limits and historical endpoints — swapping one in means replacing `fetchPriceOverview` in `lib/steam/client.ts` with a call to their API.

## Cron job

`/api/cron/snapshot` polls every watchlisted item plus your top-100-by-volume items, one at a time, and writes a `PriceSnapshot` row for each. Point a scheduler at it:

- **Vercel Cron**: already configured in `vercel.json` (every 3 hours — tune this; more frequent runs will fight the rate limiter harder).
- **Anything else** (cron-job.org, a GitHub Action, a `cron` entry on a VPS): `curl https://yourdomain.com/api/cron/snapshot -H "Authorization: Bearer $CRON_SECRET"`.

Set `CRON_SECRET` in your env if you don't want the endpoint publicly callable.

## Project structure

```
app/
  api/            Route handlers — items, watchlist, alerts, cron
  item/[id]/      Item detail page
  search/         Search + filters page
  watchlist/      Watchlist page
components/
  dashboard/      Hero bento grid, ticker, item cards
  item/           Detail page: chart, parallax image, similar items
  watchlist/      Drag-to-reorder / swipe-to-delete rows
  search/         Filter panel
  alerts/         Alert creation modal
  motion/         Reusable Framer Motion wrappers (tilt, stagger, transitions)
  ui/             Design-system primitives (badges, skeletons, toasts)
lib/
  steam/          Steam client, rate-limited queue, cache/degradation layer
  store/          Zustand stores (watchlist, filters, toasts)
  mock/           Mock catalog used for the UI-only demo path
  utils/          Formatting, rarity mapping, cn()
prisma/
  schema.prisma   Item / PriceSnapshot / WatchlistEntry / PriceAlert / FetchLog
  seed.ts         Loads the mock catalog into Postgres
```

## Known gaps / next steps

- No auth — `userId` is a placeholder header/query param (`x-user-id`, defaults to `"demo-user"`). Wire up real sessions before shipping multi-user.
- Alert **triggering** (checking active alerts against new prices and firing a notification) isn't implemented yet — `PriceAlert` rows are created but nothing currently flips `triggered`. That logic belongs in the cron job, right after a snapshot is written.
- Item catalog ingestion (populating `Item` rows beyond the seed script — e.g. from Steam's full listing/tag data to get accurate `rarity`/`exterior`) isn't built. The seed script only loads the 12 mock items.
- Redis isn't wired in; `lib/steam/priceService.ts` uses an in-memory LRU cache instead, which is fine for a single instance but won't share cache across multiple server instances/regions.
