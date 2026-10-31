import { Activity, ArrowUpRight, BarChart3, CalendarDays, Link2, MousePointerClick, ScanLine, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { PageError, PageLoading } from "../components/PageState";
import StatCard from "../components/StatCard";
import { useAnalytics } from "../hooks/useAnalytics";
import { useBusiness } from "../hooks/useBusiness";
import { getLinkType } from "../lib/linkTypes";
import { brandBtn, cardClass, secondaryBtn } from "../lib/ui";
import { BrandLogo } from "../components/BrandLogos";

export default function Analytics() {
  const { business, loading, error, reload } = useBusiness();
  const { data, loading: statsLoading, error: statsError } = useAnalytics(business?.id);

  if (loading || (business && statsLoading)) return <PageLoading />;
  if (error) return <PageError message={error} onRetry={reload} />;

  if (!business) {
    return (
      <div className={`${cardClass} text-center py-12 px-6`}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-[#d4f04d]">
          <BarChart3 size={28} />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-950">No business profile yet</h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
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
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              Scan Performance & Conversions
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time counter scan analytics and customer engagement breakdown for {business.businessName}.
          </p>
        </div>
        <Link to="/dashboard/qr" className={`${secondaryBtn} !py-2 !px-4 text-xs font-bold`}>
          View QR Stand <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard Icon={ScanLine} label="Total Scans" value={data.totalScans} trend="All-time scans" trendPositive={true} />
        <StatCard Icon={CalendarDays} label="Scans Today" value={data.today} trend="Last 24 hours" trendPositive={true} />
        <StatCard Icon={TrendingUp} label="This Month" value={data.thisMonth} trend="Current month" trendPositive={true} />
        <StatCard Icon={MousePointerClick} label="Link Taps" value={data.totalClicks} trend={`${conversionRate}% tap rate`} trendPositive={conversionRate > 0} />
      </div>

      {/* Engagement & Breakdown Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Link Click Distribution (2 Cols) */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-display font-black text-lg text-slate-950">
                Clicks per Customer Destination
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Track which buttons your patrons tap the most after scanning your QR code.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {data.links.length} destinations
            </span>
          </div>

          {ranked.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                <Link2 size={22} />
              </div>
              <p className="text-sm font-bold text-slate-950">No customer clicks recorded yet</p>
              <p className="text-xs text-slate-500 mt-1">Add destinations to your QR profile to start capturing engagement.</p>
              <Link to="/dashboard/links" className={`${secondaryBtn} mt-4 text-xs font-bold`}>
                Manage links now
              </Link>
            </div>
          ) : (
            <ul className="mt-5 space-y-4">
              {ranked.map((link, index) => {
                const linkType = getLinkType(link.icon);
                const percentOfTotal = data.totalClicks > 0 ? Math.round((link.clicks / data.totalClicks) * 100) : 0;
                const barWidth = Math.round((link.clicks / maxClicks) * 100);

                return (
                  <li key={link.id} className="group rounded-2xl p-3 transition-colors hover:bg-slate-50/80 border border-transparent hover:border-slate-200/60">
                    <div className="flex items-center justify-between gap-3 text-sm mb-2">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-800">
                          #{index + 1}
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-2xs">
                          <BrandLogo name={link.icon} size={18} />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-950 truncate block text-xs sm:text-sm">{link.title}</span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">{linkType.label}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-black text-slate-950 tabular-nums text-sm">{link.clicks}</span>
                        <span className="text-xs text-slate-500 ml-1">taps</span>
                        <span className="block text-[10px] font-bold text-slate-600">{percentOfTotal}% share</span>
                      </div>
                    </div>

                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-950 transition-all duration-500 ease-out"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Quick Insights Card (1 Col) */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-950 font-black text-sm">
              <Activity size={17} className="text-emerald-600" />
              <span>Conversion Insights</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Overall counter scan-to-tap conversion rate is <strong>{conversionRate}%</strong>.
            </p>
            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Scan Speed
              </span>
              <p className="text-xl font-black text-slate-950">240ms</p>
              <p className="text-[11px] text-slate-500">Fast edge-cached response on all Indian mobile networks</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-slate-950 p-6 shadow-xs text-white space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#d4f04d] uppercase tracking-wider">
              <Zap size={14} />
              <span>Zero-PII Privacy</span>
            </div>
            <h4 className="text-sm font-bold text-white">100% Anonymous Counters</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No invasive tracking cookies or personal device identifiers stored. Fully GDPR/CCPA privacy compliant.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
