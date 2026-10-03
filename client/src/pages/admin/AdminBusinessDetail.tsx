import {
  ArrowLeft, CalendarDays, Copy, Download, ExternalLink, ImagePlus, Loader2, MousePointerClick,
  Power, ScanLine, Trash2, TrendingUp,
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
      toast.show("Link copied");
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
    <div className="space-y-5">
      <Link to="/admin/businesses" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#467359] hover:underline">
        <ArrowLeft size={15} /> All businesses
      </Link>

      {/* Business information */}
      <section className={cardClass}>
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#e3f7e6] text-[#467359] ring-1 ring-[#b7dbc4]">
            {biz.logoUrl ? <img src={biz.logoUrl} alt={`${biz.businessName} logo`} className="h-full w-full object-cover" /> : <ImagePlus size={28} />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-[#284737]">{biz.businessName}</h1>
              <StatusBadge active={biz.isActive} />
            </div>
            <p className="mt-1.5 text-sm text-[#43745b]">{biz.description || <span className="text-[#91b49e]">No description</span>}</p>
            <p className="mt-2 text-sm text-[#70a087]">
              Owner:{" "}
              {biz.owner ? (
                <Link to={`/admin/users/${biz.owner.id}`} className="font-semibold text-[#284737] hover:underline">
                  {biz.owner.name} ({biz.owner.email})
                </Link>
              ) : (
                "Unknown"
              )}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm lg:grid-cols-4">
              {facts.map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-[#91b49e]">{label}</dt>
                  <dd className="mt-0.5 break-words font-semibold text-[#284737]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2 border-t border-[#e3f7e6] pt-4">
          <a href={url} target="_blank" rel="noreferrer" className={secondaryBtn}><ExternalLink size={16} /> View public profile</a>
          <button onClick={() => setAction("toggle")} className={secondaryBtn}>
            <Power size={16} /> {biz.isActive ? "Deactivate" : "Activate"}
          </button>
          <button onClick={() => setAction("delete")} className={`${dangerBtn} sm:ml-auto`}><Trash2 size={16} /> Delete business</button>
        </div>
      </section>

      {/* Analytics */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <StatCard Icon={ScanLine} label="Total scans" value={formatNumber(a.totalScans)} />
        <StatCard Icon={CalendarDays} label="Scans today" value={formatNumber(a.today)} />
        <StatCard Icon={TrendingUp} label="This month" value={formatNumber(a.thisMonth)} />
        <StatCard Icon={MousePointerClick} label="Link clicks" value={formatNumber(a.totalClicks)} />
      </div>

      {/* Links */}
      <section className="space-y-3">
        <h2 className="font-bold text-[#284737]">Links ({data.links.length})</h2>
        <TableCard>
          <table className="w-full min-w-[620px]">
            <thead className="border-b border-[#e3f7e6] bg-[#f7faf7]">
              <tr>
                <th className={th}>#</th>
                <th className={th}>Title</th>
                <th className={th}>Type</th>
                <th className={th}>URL</th>
                <th className={th}>Status</th>
                <th className={th}>Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3f7e6]">
              {data.links.length === 0 && <EmptyRow colSpan={6} text="No links added yet." />}
              {data.links.map((l) => {
                const { Icon, label } = getLinkType(l.icon);
                return (
                  <tr key={l.id} className="hover:bg-[#f7faf7]">
                    <td className={`${td} tabular-nums`}>{l.position + 1}</td>
                    <td className={`${td} font-semibold text-[#284737]`}>{l.title}</td>
                    <td className={td}><span className="inline-flex items-center gap-1.5"><Icon size={15} /> {label}</span></td>
                    <td className={`${td} max-w-[16rem]`}><p className="truncate" title={l.url}>{l.url}</p></td>
                    <td className={td}><StatusBadge active={l.isActive} /></td>
                    <td className={`${td} tabular-nums`}>{l.clicks}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableCard>
      </section>

      {/* QR information */}
      <section className={cardClass}>
        <h2 className="font-bold text-[#284737]">QR code</h2>
        <div className="mt-4 flex flex-col gap-5 sm:flex-row">
          <div className="flex h-44 w-44 shrink-0 items-center justify-center self-center rounded-xl ring-1 ring-[#b7dbc4] sm:self-start">
            {qr ? (
              <img src={qr.pngDataUrl} alt="QR code for this business" className="h-full w-full rounded-xl" />
            ) : qrError ? (
              <p className="p-3 text-center text-xs text-red-700">{qrError}</p>
            ) : (
              <Loader2 className="animate-spin text-[#91b49e]" />
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-3 text-sm text-[#43745b]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#91b49e]">Encodes</p>
              <p className="mt-0.5 break-all font-semibold text-[#284737]">{url}</p>
            </div>
            <p>
              The QR contains only this public address, so it keeps working when links change. Error correction level H
              {qr ? (qr.logoIncluded ? ", with the business logo in the center." : ", without a center logo.") : "."}
            </p>
            <div className="flex flex-wrap gap-2">
              <button disabled={!qr} onClick={() => qr && downloadPng(qr.pngDataUrl, `${biz.slug}-qr.png`)} className={secondaryBtn}>
                <Download size={16} /> Download PNG
              </button>
              <button onClick={copyUrl} className={secondaryBtn}><Copy size={16} /> Copy link</button>
            </div>
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={action !== null}
        busy={busy}
        danger={action === "delete" || biz.isActive}
        title={action === "delete" ? "Delete this business?" : biz.isActive ? "Deactivate this business?" : "Activate this business?"}
        message={
          action === "delete" ? (
            <>{biz.businessName}, its links, logo and analytics will be permanently deleted, and its QR code will stop working. This cannot be undone.</>
          ) : biz.isActive ? (
            <>The public page will show "page not available" and scans of the QR code will stop working until it is activated again.</>
          ) : (
            <>The public page will go live again.</>
          )
        }
        confirmLabel={action === "delete" ? "Delete business" : biz.isActive ? "Deactivate" : "Activate"}
        onConfirm={run}
        onCancel={() => setAction(null)}
      />
      <p className="text-xs text-[#91b49e]">Created {formatDate(biz.createdAt)}</p>
    </div>
  );
}
