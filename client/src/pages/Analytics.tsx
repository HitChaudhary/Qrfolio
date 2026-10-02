import { CalendarDays, Link2, MousePointerClick, ScanLine, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { PageError, PageLoading } from "../components/PageState";
import StatCard from "../components/StatCard";
import { useAnalytics } from "../hooks/useAnalytics";
import { useBusiness } from "../hooks/useBusiness";
import { getLinkType } from "../lib/linkTypes";
import { cardClass, primaryBtn } from "../lib/ui";

export default function Analytics() {
  const { business, loading, error, reload } = useBusiness();
  const { data, loading: statsLoading, error: statsError } = useAnalytics(business?.id);

  if (loading || (business && statsLoading)) return <PageLoading />;
  if (error) return <PageError message={error} onRetry={reload} />;

  if (!business) {
    return (
      <div className={`${cardClass} text-center`}>
        <p className="text-slate-600">Create your business profile to see analytics.</p>
        <Link to="/dashboard/business/new" className={`${primaryBtn} mt-4`}>Create business profile</Link>
      </div>
    );
  }
  if (statsError || !data) return <PageError message={statsError || "Could not load analytics"} onRetry={reload} />;

  const maxClicks = Math.max(1, ...data.links.map((l) => l.clicks));
  const ranked = [...data.links].sort((a, b) => b.clicks - a.clicks);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Analytics</h1>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard Icon={ScanLine} label="Total scans" value={data.totalScans} />
        <StatCard Icon={CalendarDays} label="Today" value={data.today} />
        <StatCard Icon={TrendingUp} label="This month" value={data.thisMonth} />
        <StatCard Icon={MousePointerClick} label="Link clicks" value={data.totalClicks} />
      </div>

      <div className={cardClass}>
        <h2 className="font-semibold">Clicks per link</h2>
        {ranked.length === 0 ? (
          <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <Link2 size={16} /> Add links to start seeing clicks.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {ranked.map((l) => {
              const { Icon } = getLinkType(l.icon);
              return (
                <li key={l.id}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <Icon size={16} className="shrink-0 text-slate-500" />
                      <span className="truncate">{l.title}</span>
                    </span>
                    <span className="font-medium tabular-nums">{l.clicks}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                    <div className="h-1.5 rounded-full bg-slate-900" style={{ width: `${(l.clicks / maxClicks) * 100}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="text-xs text-slate-500">
        A scan is counted each time your public page loads. Clicks are counted for website-style links;
        phone and email links open directly and aren't tracked. No personal information is stored.
      </p>
    </div>
  );
}
