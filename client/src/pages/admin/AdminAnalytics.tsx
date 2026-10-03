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
    <div className="space-y-6">
      <PageHeader title="Platform analytics" subtitle="Scans and clicks across every business." />

      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <StatCard Icon={ScanLine} label="Total scans" value={formatNumber(data.totalScans)} />
        <StatCard Icon={CalendarDays} label="Scans today" value={formatNumber(data.today)} />
        <StatCard Icon={TrendingUp} label="Scans this month" value={formatNumber(data.thisMonth)} />
        <StatCard Icon={MousePointerClick} label="Link clicks" value={formatNumber(data.totalClicks)}
          trend={`${formatNumber(data.clicksThisMonth)} this month`} />
      </div>

      <section className={cardClass}>
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[#284737]">Recent activity</h2>
          <span className="text-xs font-semibold text-[#467359]">{formatNumber(last14)} scans in 14 days</span>
        </div>
        <div className="mt-5 flex h-44 items-end gap-1.5 sm:gap-2" role="img" aria-label="Scans per day for the last 14 days">
          {data.daily.map((d) => (
            <div key={d.date} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
              <span className="text-[10px] font-semibold tabular-nums text-[#70a087]">{d.scans > 0 ? d.scans : ""}</span>
              <div
                title={`${shortDate(d.date)}: ${d.scans} scans, ${d.clicks} clicks`}
                className="w-full rounded-t-md bg-gradient-to-t from-[#467359] to-[#69bd92] transition-opacity group-hover:opacity-80"
                style={{ height: `${Math.max(d.scans > 0 ? 6 : 2, (d.scans / maxScans) * 100)}%`, opacity: d.scans > 0 ? 1 : 0.25 }}
              />
              <span className="hidden text-[10px] text-[#91b49e] sm:block">{shortDate(d.date).replace(" ", "\u00a0")}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold text-[#284737]">Most scanned businesses</h2>
        <TableCard>
          <table className="w-full min-w-[520px]">
            <thead className="border-b border-[#e3f7e6] bg-[#f7faf7]">
              <tr>
                <th className={th}>#</th>
                <th className={th}>Business</th>
                <th className={`${th} hidden sm:table-cell`}>Owner</th>
                <th className={th}>Status</th>
                <th className={th}>Scans</th>
                <th className={th}>Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3f7e6]">
              {data.topBusinesses.length === 0 && <EmptyRow colSpan={6} text="No scans recorded yet." />}
              {data.topBusinesses.map((b, i) => (
                <tr key={b.id} className="hover:bg-[#f7faf7]">
                  <td className={`${td} tabular-nums`}>{i + 1}</td>
                  <td className={td}>
                    <Link to={`/admin/businesses/${b.id}`} className="font-semibold text-[#284737] hover:underline">{b.businessName}</Link>
                    <p className="text-xs text-[#91b49e]">/p/{b.slug}</p>
                  </td>
                  <td className={`${td} hidden sm:table-cell`}>{b.owner ?? "—"}</td>
                  <td className={td}><StatusBadge active={b.isActive} /></td>
                  <td className={`${td} font-semibold tabular-nums text-[#284737]`}>{formatNumber(b.scans)}</td>
                  <td className={`${td} tabular-nums`}>{formatNumber(b.clicks)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      </section>
    </div>
  );
}
