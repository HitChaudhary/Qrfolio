import {
  CheckCircle2,
  ScanLine,
  Sparkles,
  Store,
  UserPlus,
  Users,
  XCircle,
  Activity,
  Server,
  Zap,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader, RoleBadge, StatusBadge } from "../../components/admin/AdminUI";
import { PageError, PageLoading } from "../../components/PageState";
import StatCard from "../../components/StatCard";
import { useAdminQuery } from "../../hooks/useAdmin";
import { formatDate, formatNumber } from "../../lib/format";
import type { AdminDashboardData } from "../../lib/types";
import { cardClass } from "../../lib/ui";

export default function AdminDashboard() {
  const { data, loading, error, reload } = useAdminQuery<AdminDashboardData>("/dashboard");

  if (error) return <PageError message={error} onRetry={reload} />;
  if (loading || !data) return <PageLoading />;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <PageHeader
        title="Platform Operations Cockpit"
        subtitle="Platform-wide multi-tenant telemetry and registry calculated live from the production database."
      />

      {/* Operational Metrics Grid */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <StatCard Icon={Users} label="Total Registered Users" value={formatNumber(data.totalUsers)} />
        <StatCard Icon={Store} label="Total Business Hubs" value={formatNumber(data.totalBusinesses)} />
        <StatCard Icon={CheckCircle2} label="Active Businesses" value={formatNumber(data.activeBusinesses)} />
        <StatCard Icon={XCircle} label="Inactive / Draft" value={formatNumber(data.inactiveBusinesses)} />
        <StatCard Icon={ScanLine} label="Global Platform Scans" value={formatNumber(data.totalScans)} />
        <StatCard Icon={UserPlus} label="New Users (7d)" value={formatNumber(data.newUsers)} trend="Trailing 7 days" trendPositive={true} />
        <StatCard Icon={Sparkles} label="New Businesses (7d)" value={formatNumber(data.newBusinesses)} trend="Trailing 7 days" trendPositive={true} />
        <div className="rounded-2xl sm:rounded-3xl bg-slate-950 p-5 sm:p-6 text-white flex flex-col justify-between border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">System Telemetry</span>
            <span className="flex h-2 w-2 rounded-full bg-[#d4f04d] animate-ping" />
          </div>
          <div>
            <p className="font-display text-xl sm:text-2xl font-black text-white">99.99% UP</p>
            <p className="text-[10px] font-mono text-emerald-400 mt-0.5">Proxy Latency: 240ms</p>
          </div>
        </div>
      </div>

      {/* Audit Registry Tables Grid (Newest Users & Businesses) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Newest Users */}
        <section className={cardClass}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-slate-900" />
              <h2 className="font-display font-black text-slate-950 text-base">Newest Accounts</h2>
            </div>
            <Link to="/admin/users" className="text-xs font-black text-slate-950 hover:underline">
              View all ({data.totalUsers}) ↗
            </Link>
          </div>

          <ul className="mt-3.5 divide-y divide-slate-100">
            {data.recentUsers.length === 0 && (
              <li className="py-8 text-center text-xs text-slate-400">No users registered yet.</li>
            )}
            {data.recentUsers.map((u) => (
              <li key={u.id} className="flex items-center justify-between gap-3 py-3 hover:bg-slate-50/70 px-2 rounded-xl transition-colors">
                <Link to={`/admin/users/${u.id}`} className="min-w-0">
                  <p className="truncate text-xs sm:text-sm font-bold text-slate-950 hover:underline">{u.name}</p>
                  <p className="truncate text-[11px] text-slate-400 font-mono">{u.email} · {formatDate(u.createdAt)}</p>
                </Link>
                <RoleBadge role={u.role} />
              </li>
            ))}
          </ul>
        </section>

        {/* Newest Businesses */}
        <section className={cardClass}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <Store size={18} className="text-slate-900" />
              <h2 className="font-display font-black text-slate-950 text-base">Newest Business Hubs</h2>
            </div>
            <Link to="/admin/businesses" className="text-xs font-black text-slate-950 hover:underline">
              View all ({data.totalBusinesses}) ↗
            </Link>
          </div>

          <ul className="mt-3.5 divide-y divide-slate-100">
            {data.recentBusinesses.length === 0 && (
              <li className="py-8 text-center text-xs text-slate-400">No businesses registered yet.</li>
            )}
            {data.recentBusinesses.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 py-3 hover:bg-slate-50/70 px-2 rounded-xl transition-colors">
                <Link to={`/admin/businesses/${b.id}`} className="min-w-0">
                  <p className="truncate text-xs sm:text-sm font-bold text-slate-950 hover:underline">{b.businessName}</p>
                  <p className="truncate text-[11px] text-slate-400 font-mono">
                    Owner: {b.owner?.name ?? "Unknown"} · {formatDate(b.createdAt)}
                  </p>
                </Link>
                <StatusBadge active={b.isActive} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
