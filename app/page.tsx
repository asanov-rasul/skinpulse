import { HeroBento } from "@/components/dashboard/HeroBento";

// Always fetch fresh — price data changes via cron, this page shouldn't
// serve a stale build-time snapshot.
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return <HeroBento />;
}
