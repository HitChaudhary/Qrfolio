import { Activity, ArrowUpRight, BarChart3, CalendarDays, Link2, MousePointerClick, ScanLine, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { PageError, PageLoading } from "../components/PageState";
import StatCard from "../components/StatCard";
import { useAnalytics } from "../hooks/useAnalytics";
import { useBusiness } from "../hooks/useBusiness";
import { getLinkType } from "../lib/linkTypes";
import { brandBtn, cardClass, secondaryBtn } from "../lib/ui";

export default function Analytics() {
  const { business, loading, error, reload } = useBusiness();
  const { data, loading: statsLoading, error: statsError } = useAnalytics(business?.id);

  if (loading || (business && statsLoading)) return <PageLoading />;
  if (error) return <PageError message={error} onRetry={reload} />;

  if (!business) {
    return (
      <div className={`${cardClass} text-center py-12 px-6`}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e3f7e6] text-[#467359]">
          <BarChart3 size={28} />
        </div>
        <h2 className="mt-4 text-lg font-bold text-[#284737]">No business profile yet</h2>
        <p className="mt-1 text-sm text-[#70a087] max-w-sm mx-auto">
          Create your business profile first to generate a dynamic QR and track scan analytics.
        </p>
        <Link to="/dashboard/business/new" className={`${brandBtn} mt-5 inline-flex`}>
          Create business profile
        </Link>
      </div>
    );
  }

  if (statsError || !data) {
    return <PageError message={statsError || "Could not load analytics"} onRetry={reload} />;
  }

  const maxClicks = Math.max(1, ...data.links.map((l) => l.clicks));
  const ranked = [...data.links].sort((a, b) => b.clicks - a.clicks);
  const conversionRate = data.totalScans > 0 ? Math.round((data.totalClicks / data.totalScans) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#284737]">Performance Analytics</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#dff6e2] px-2.5 py-0.5 text-xs font-semibold text-[#355d48]">
              <Sparkles size={11} /> Live data
            </span>
          </div>
          <p className="text-sm text-[#70a087] mt-0.5">Real-time scan tracking and engagement breakdown for {business.businessName}.</p>
        </div>
        <Link to="/dashboard/qr" className={`${secondaryBtn} text-xs py-2 px-3 self-start sm:self-auto`}>
          View QR Code <ArrowUpRight size={14} className="ml-1" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard Icon={ScanLine} label="Total Scans" value={data.totalScans} trend="All-time scans" trendPositive={true} />
        <StatCard Icon={CalendarDays} label="Scans Today" value={data.today} trend="Last 24 hours" trendPositive={true} />
        <StatCard Icon={TrendingUp} label="This Month" value={data.thisMonth} trend="Current month" trendPositive={true} />
        <StatCard Icon={MousePointerClick} label="Link Clicks" value={data.totalClicks} trend={`${conversionRate}% rate`} trendPositive={conversionRate > 0} />
      </div>

      {/* Engagement & Breakdown Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Link Click Distribution */}
        <div className={`${cardClass} lg:col-span-2`}>
          <div className="flex items-center justify-between border-b border-[#b7dbc4]/40 pb-3.5">
            <div>
              <h2 className="font-bold text-[#284737]">Clicks per Destination Link</h2>
              <p className="text-xs text-[#70a087] mt-0.5">Track which links your customers tap the most.</p>
            </div>
            <span className="text-xs font-semibold text-[#467359] bg-[#e3f7e6] px-2.5 py-1 rounded-lg">
              {data.links.length} total {data.links.length === 1 ? "link" : "links"}
            </span>
          </div>

          {ranked.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0f3f0] text-[#70a087]">
                <Link2 size={22} />
              </div>
              <p className="mt-3 text-sm font-medium text-[#284737]">No links tracked yet</p>
              <p className="text-xs text-[#70a087] mt-1">Add links to your profile to see engagement metrics.</p>
              <Link to="/dashboard/links" className={`${secondaryBtn} mt-4 text-xs`}>
                Add links now
              </Link>
            </div>
          ) : (
            <ul className="mt-4 space-y-4">
              {ranked.map((link, index) => {
                const linkType = getLinkType(link.icon);
                const { Icon } = linkType;
                const percentOfTotal = data.totalClicks > 0 ? Math.round((link.clicks / data.totalClicks) * 100) : 0;
                const barWidth = Math.round((link.clicks / maxClicks) * 100);

                return (
                  <li key={link.id} className="group rounded-xl p-2.5 transition-colors hover:bg-[#f0f3f0]/70">
                    <div className="flex items-center justify-between gap-3 text-sm mb-1.5">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#e3f7e6] text-xs font-bold text-[#467359]">
                          #{index + 1}
                        </span>
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#b7dbc4]/40 text-[#43745b]">
                          <Icon size={15} />
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-[#284737] truncate block text-sm">{link.title}</span>
                          <span className="text-[11px] text-[#70a087] truncate block capitalize">{linkType.label}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-[#284737] tabular-nums text-sm">{link.clicks}</span>
                        <span className="text-xs text-[#70a087] ml-1">clicks</span>
                        <span className="block text-[10px] font-medium text-[#6dae8c]">{percentOfTotal}% share</span>
                      </div>
                    </div>

                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#e3f7e6]/70">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#467359] via-[#6dae8c] to-[#69bd92] transition-all duration-500 ease-out"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Quick Insights Card */}
        <div className="space-y-4">
          <div className={`${cardClass} bg-gradient-to-br from-[#dff6e2]/80 via-white to-[#f0f3f0]`}>
            <div className="flex items-center gap-2 text-[#467359] font-bold text-sm">
              <Activity size={17} />
              <span>Conversion Rate</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#284737]">{conversionRate}%</span>
              <span className="text-xs text-[#70a087]">of page visitors clicked a link</span>
            </div>
            <p className="mt-2 text-xs text-[#43745b] leading-relaxed">
              Higher rates mean your visitors quickly found the exact contact or social link they were looking for.
            </p>
          </div>

          <div className={`${cardClass}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#70a087]">Privacy-First Tracking</h3>
            <p className="mt-2 text-xs text-[#43745b] leading-relaxed">
              A scan is recorded whenever your landing page loads. Click stats are updated instantly without tracking cookies, IP addresses, or personal user data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
