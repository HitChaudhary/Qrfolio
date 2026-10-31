import { CalendarDays, MousePointerClick, ScanLine, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyRow, PageHeader, StatusBadge, TableCard, td, th } from "../../components/admin/AdminUI";
import { PageError, PageLoading } from "../../components/PageState";
import StatCard from "../../components/StatCard";
import { useAdminQuery } from "../../hooks/useAdmin";
import { formatNumber } from "../../lib/format";
import type { AdminAnalyticsData } from "../../lib/types";
import { cardClass } from "../../lib/ui";

const shortDate = (key: string) =>
  new Date(`${key}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" });

export default function AdminAnalytics() {
  const { data, loading, error, reload } = useAdminQuery<AdminAnalyticsData>("/analytics");

  if (error) return <PageError message={error} onRetry={reload} />;
  if (loading || !data) return <PageLoading />;

  const maxScans = Math.max(1, ...data.daily.map((d) => d.scans));
  const last14 = data.daily.reduce((sum, d) => sum + d.scans, 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <PageHeader
        title="Global Platform Telemetry"
        subtitle="Aggregate scan traffic, conversion clicks, and peak load across all tenant businesses in India."
      />

      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <StatCard Icon={ScanLine} label="Global Platform Scans" value={formatNumber(data.totalScans)} />
        <StatCard Icon={CalendarDays} label="Scans Today" value={formatNumber(data.today)} />
        <StatCard Icon={TrendingUp} label="Scans This Month" value={formatNumber(data.thisMonth)} />
        <StatCard
          Icon={MousePointerClick}
          label="Total Destination Taps"
          value={formatNumber(data.totalClicks)}
          trend={`${formatNumber(data.clicksThisMonth)} this month`}
          trendPositive={true}
        />
      </div>

      {/* 14-day Activity Histogram Card */}
      <section className={cardClass}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-display font-black text-slate-950 text-base">Daily Traffic Velocity</h2>
            <p className="text-xs text-slate-500 mt-0.5">Aggregate customer camera scans recorded by edge proxies</p>
          </div>
          <span className="text-xs font-black text-slate-950 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            {formatNumber(last14)} scans in 14 days
          </span>
        </div>

        <div className="mt-6 flex h-48 items-end gap-1.5 sm:gap-3" role="img" aria-label="Scans per day for the last 14 days">
          {data.daily.map((d) => (
            <div key={d.date} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
              <span className="text-[10px] font-mono font-bold tabular-nums text-slate-600">
                {d.scans > 0 ? d.scans : ""}
              </span>
              <div
                title={`${shortDate(d.date)}: ${d.scans} scans, ${d.clicks} clicks`}
                className="w-full rounded-t-xl bg-slate-950 group-hover:bg-[#d4f04d] transition-colors"
                style={{
                  height: `${Math.max(d.scans > 0 ? 8 : 3, (d.scans / maxScans) * 100)}%`,
                  opacity: d.scans > 0 ? 1 : 0.2,
                }}
              />
              <span className="hidden text-[10px] font-mono text-slate-400 sm:block">
                {shortDate(d.date).replace(" ", "\u00a0")}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Top Scanned Businesses */}
      <section className="space-y-3">
        <h2 className="font-display font-black text-slate-950 text-base">Top Performing Businesses by Scan Volume</h2>
        <TableCard>
          <table className="w-full min-w-[520px]">
            <thead>
              <tr>
                <th className={th}>Rank</th>
                <th className={th}>Business Hub</th>
                <th className={`${th} hidden sm:table-cell`}>Owner</th>
                <th className={th}>Status</th>
                <th className={th}>Scans</th>
                <th className={th}>Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.topBusinesses.length === 0 && <EmptyRow colSpan={6} text="No scan events recorded across the platform yet." />}
              {data.topBusinesses.map((b, i) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className={`${td} font-bold text-slate-400 tabular-nums`}>#{i + 1}</td>
                  <td className={td}>
                    <Link to={`/admin/businesses/${b.id}`} className="font-bold text-slate-950 hover:underline">{b.businessName}</Link>
                    <p className="text-xs font-mono text-slate-400">/p/{b.slug}</p>
                  </td>
                  <td className={`${td} hidden font-medium text-slate-600 sm:table-cell`}>{b.owner ?? "—"}</td>
                  <td className={td}><StatusBadge active={b.isActive} /></td>
                  <td className={`${td} font-black text-slate-950 tabular-nums`}>{formatNumber(b.scans)}</td>
                  <td className={`${td} font-bold text-slate-700 tabular-nums`}>{formatNumber(b.clicks)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      </section>
    </div>
  );
}
