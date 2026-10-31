import {
  ArrowLeft, CalendarDays, Copy, Download, ExternalLink, ImagePlus, Loader2, MousePointerClick,
  Power, ScanLine, Store, Trash2, TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ConfirmDialog, EmptyRow, StatusBadge, TableCard, td, th } from "../../components/admin/AdminUI";
import { PageError, PageLoading } from "../../components/PageState";
import StatCard from "../../components/StatCard";
import { useToast } from "../../components/Toast";
import { useAdminQuery } from "../../hooks/useAdmin";
import { useQr } from "../../hooks/useQr";
import { api, getErrorMessage } from "../../lib/api";
import { publicUrl } from "../../lib/config";
import { formatDate, formatDateTime, formatNumber } from "../../lib/format";
import { getLinkType } from "../../lib/linkTypes";
import { downloadPng } from "../../lib/qr";
import type { AdminBusinessDetailData } from "../../lib/types";
import { cardClass, dangerBtn, secondaryBtn } from "../../lib/ui";
import { BrandLogo } from "../../components/BrandLogos";

type Action = "toggle" | "delete" | null;

export default function AdminBusinessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, loading, error, reload } = useAdminQuery<AdminBusinessDetailData>(`/businesses/${id ?? ""}`);
  const [action, setAction] = useState<Action>(null);
  const [busy, setBusy] = useState(false);

  const biz = data?.business;
  const url = biz ? publicUrl(biz.slug) : "";
  const { qr, error: qrError } = useQr(url, biz?.logoUrl ?? "");

  if (error) return <PageError message={error} onRetry={reload} />;
  if (loading && !data) return <PageLoading />;
  if (!data || !biz) return null;

  async function run() {
    if (!biz) return;
    setBusy(true);
    try {
      if (action === "delete") {
        await api.delete(`/admin/businesses/${biz.id}`);
        toast.show("Business deleted");
        navigate("/admin/businesses", { replace: true });
        return;
      }
      await api.patch(`/admin/businesses/${biz.id}`, { isActive: !biz.isActive });
      toast.show(biz.isActive ? "Business deactivated" : "Business activated");
      setAction(null);
      reload();
    } catch (err) {
      toast.show(getErrorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(url);
      toast.show("Link copied to clipboard");
    } catch {
      toast.show("Could not copy the link", "error");
    }
  }

  const a = data.analytics;
  const facts: [string, string][] = [
    ["Category", biz.category || "—"],
    ["Slug", biz.slug],
    ["Created", formatDateTime(biz.createdAt)],
    ["Last updated", formatDateTime(biz.updatedAt)],
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Link to="/admin/businesses" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors">
        <ArrowLeft size={14} /> Back to Business Registry
      </Link>

      {/* Business information */}
      <section className={cardClass}>
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-slate-100 border border-slate-200">
            {biz.logoUrl ? (
              <img src={biz.logoUrl} alt={`${biz.businessName} logo`} className="h-full w-full object-cover" />
            ) : (
              <Store size={32} className="text-slate-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-950">{biz.businessName}</h1>
              <StatusBadge active={biz.isActive} />
            </div>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-medium">
              {biz.description || <span className="text-slate-400 italic">No storefront announcement set</span>}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Registered Owner:{" "}
              {biz.owner ? (
                <Link to={`/admin/users/${biz.owner.id}`} className="font-bold text-slate-950 hover:underline">
                  {biz.owner.name} ({biz.owner.email})
                </Link>
              ) : (
                "Unknown"
              )}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-xs lg:grid-cols-4">
              {facts.map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
                  <dd className="mt-0.5 break-words font-mono font-bold text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5 border-t border-slate-100 pt-4">
          <a href={url} target="_blank" rel="noreferrer" className={secondaryBtn}>
            <ExternalLink size={14} /> View Public Page
          </a>
          <button onClick={copyUrl} className={secondaryBtn}>
            <Copy size={14} /> Copy Public URL
          </button>
          <button onClick={() => setAction("toggle")} className={secondaryBtn}>
            <Power size={14} /> {biz.isActive ? "Deactivate" : "Activate"}
          </button>
          <button onClick={() => setAction("delete")} className={`${dangerBtn} sm:ml-auto`}>
            <Trash2 size={14} /> Delete Business
          </button>
        </div>
      </section>

      {/* Analytics */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <StatCard Icon={ScanLine} label="Total Scans" value={formatNumber(a.totalScans)} />
        <StatCard Icon={CalendarDays} label="Scans Today" value={formatNumber(a.today)} />
        <StatCard Icon={TrendingUp} label="This Month" value={formatNumber(a.thisMonth)} />
        <StatCard Icon={MousePointerClick} label="Link Taps" value={formatNumber(a.totalClicks)} />
      </div>

      {/* Destinations list */}
      <section className="space-y-3">
        <h2 className="font-display font-black text-slate-950 text-base">Active Destinations ({data.links.length})</h2>
        <TableCard>
          <table className="w-full min-w-[620px]">
            <thead>
              <tr>
                <th className={th}>#</th>
                <th className={th}>Platform</th>
                <th className={th}>Title</th>
                <th className={th}>Destination URL</th>
                <th className={`${th} text-right`}>Taps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.links.length === 0 && <EmptyRow colSpan={5} text="No destination links configured." />}
              {data.links.map((l, i) => (
                <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className={`${td} font-bold text-slate-400 tabular-nums`}>{i + 1}</td>
                  <td className={td}>
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 border border-slate-200">
                        <BrandLogo name={l.icon} size={15} />
                      </span>
                      <span className="capitalize font-bold text-slate-800 text-xs">{l.icon}</span>
                    </div>
                  </td>
                  <td className={`${td} font-bold text-slate-950`}>{l.title}</td>
                  <td className={`${td} font-mono text-xs text-slate-400 truncate max-w-xs`}>{l.url}</td>
                  <td className={`${td} text-right font-black text-slate-950 tabular-nums`}>{formatNumber(l.clicks)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      </section>

      <ConfirmDialog
        open={Boolean(action)}
        title={action === "delete" ? "Delete Business?" : biz.isActive ? "Deactivate Business?" : "Activate Business?"}
        message={
          action === "delete"
            ? `Permanently destroy ${biz.businessName}? All its dynamic links and QR destinations will become inactive immediately.`
            : biz.isActive
            ? `Deactivating ${biz.businessName} will immediately prevent scanning customers from viewing their links.`
            : `Reactivate ${biz.businessName}?`
        }
        confirmLabel={action === "delete" ? "Delete" : biz.isActive ? "Deactivate" : "Activate"}
        danger={action === "delete" || biz.isActive}
        busy={busy}
        onConfirm={run}
        onCancel={() => setAction(null)}
      />
    </div>
  );
}
