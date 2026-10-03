import { CheckCircle2, ScanLine, Sparkles, Store, UserPlus, Users, XCircle } from "lucide-react";
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
    <div className="space-y-6">
      <PageHeader title="Admin dashboard" subtitle="Platform-wide overview, calculated live from your database." />

      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <StatCard Icon={Users} label="Total users" value={formatNumber(data.totalUsers)} />
        <StatCard Icon={Store} label="Total businesses" value={formatNumber(data.totalBusinesses)} />
        <StatCard Icon={CheckCircle2} label="Active businesses" value={formatNumber(data.activeBusinesses)} />
        <StatCard Icon={XCircle} label="Inactive businesses" value={formatNumber(data.inactiveBusinesses)} />
        <StatCard Icon={ScanLine} label="Total QR scans" value={formatNumber(data.totalScans)} />
        <StatCard Icon={UserPlus} label="New users" value={formatNumber(data.newUsers)} trend="Last 7 days" />
        <StatCard Icon={Sparkles} label="New businesses" value={formatNumber(data.newBusinesses)} trend="Last 7 days" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className={cardClass}>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#284737]">Newest users</h2>
            <Link to="/admin/users" className="text-xs font-semibold text-[#467359] hover:underline">View all</Link>
          </div>
          <ul className="mt-3 divide-y divide-[#e3f7e6]">
            {data.recentUsers.length === 0 && <li className="py-6 text-center text-sm text-[#70a087]">No users yet.</li>}
            {data.recentUsers.map((u) => (
              <li key={u.id} className="flex items-center justify-between gap-3 py-2.5">
                <Link to={`/admin/users/${u.id}`} className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#284737]">{u.name}</p>
                  <p className="truncate text-xs text-[#91b49e]">{u.email} · {formatDate(u.createdAt)}</p>
                </Link>
                <RoleBadge role={u.role} />
              </li>
            ))}
          </ul>
        </section>

        <section className={cardClass}>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#284737]">Newest businesses</h2>
            <Link to="/admin/businesses" className="text-xs font-semibold text-[#467359] hover:underline">View all</Link>
          </div>
          <ul className="mt-3 divide-y divide-[#e3f7e6]">
            {data.recentBusinesses.length === 0 && <li className="py-6 text-center text-sm text-[#70a087]">No businesses yet.</li>}
            {data.recentBusinesses.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 py-2.5">
                <Link to={`/admin/businesses/${b.id}`} className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#284737]">{b.businessName}</p>
                  <p className="truncate text-xs text-[#91b49e]">{b.owner?.name ?? "Unknown owner"} · {formatDate(b.createdAt)}</p>
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
