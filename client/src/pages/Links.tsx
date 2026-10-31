import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Link2,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import LinkForm, { type LinkValues } from "../components/LinkForm";
import { PageError, PageLoading } from "../components/PageState";
import { useToast } from "../components/Toast";
import { useBusiness } from "../hooks/useBusiness";
import { api, getErrorMessage } from "../lib/api";
import { getLinkType } from "../lib/linkTypes";
import type { Business } from "../lib/types";
import { brandBtn, secondaryBtn } from "../lib/ui";
import { BrandLogo } from "../components/BrandLogos";
import { publicUrl } from "../lib/config";

type Res = { data: { business: Business } };

export default function Links() {
  const { business, setBusiness, loading, error, reload } = useBusiness();
  const toast = useToast();
  const [params] = useSearchParams();
  const [editing, setEditing] = useState<string | null>(params.get("add") === "1" ? "new" : null);
  const [busy, setBusy] = useState(false);

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} onRetry={reload} />;

  if (!business) {
    return (
      <div className="rounded-3xl border border-slate-200/90 bg-white p-10 text-center shadow-xs">
        <p className="text-slate-600">Please create your business profile before managing links.</p>
        <Link to="/dashboard/business/new" className={`${brandBtn} mt-5`}>
          Create Business Profile
        </Link>
      </div>
    );
  }

  const base = `/business/${business.id}/links`;
  const links = business.links;
  const liveUrl = publicUrl(business.slug);

  async function run(call: () => Promise<{ data: Res }>, success?: string) {
    setBusy(true);
    try {
      const res = await call();
      setBusiness(res.data.data.business);
      if (success) toast.show(success);
    } catch (err) {
      toast.show(getErrorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  async function submitNew(values: LinkValues) {
    const res = await api.post<Res>(base, values);
    setBusiness(res.data.data.business);
    setEditing(null);
    toast.show("New destination published to your live QR code!");
  }

  async function submitEdit(linkId: string, values: LinkValues) {
    const res = await api.put<Res>(`${base}/${linkId}`, values);
    setBusiness(res.data.data.business);
    setEditing(null);
    toast.show("Destination link updated");
  }

  function move(index: number, dir: -1 | 1) {
    const ids = links.map((l) => l.id);
    const target = index + dir;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    run(() => api.put<Res>(`${base}/reorder`, { order: ids }));
  }

  function remove(linkId: string, title: string) {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    run(() => api.delete<Res>(`${base}/${linkId}`), "Destination deleted");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
            Links & Destinations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Add and arrange buttons that appear on your customers' smartphones. Update in 10s with ₹0 reprint cost.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            className={`${secondaryBtn} !py-2 !px-4 text-xs font-bold`}
          >
            <ExternalLink size={14} /> Preview Customer Bio
          </a>
          {editing !== "new" && (
            <button onClick={() => setEditing("new")} className={`${brandBtn} !py-2 !px-4 text-xs font-black`}>
              <Plus size={15} /> Add New Link
            </button>
          )}
        </div>
      </div>

      {/* New Link Form */}
      {editing === "new" && (
        <LinkForm
          businessCategory={business.category}
          businessName={business.businessName}
          onSubmit={submitNew}
          onCancel={() => setEditing(null)}
        />
      )}

      {/* Empty State */}
      {links.length === 0 && editing !== "new" && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-[#d4f04d] mb-4 shadow-sm">
            <Link2 size={28} />
          </div>
          <h3 className="font-display font-black text-lg text-slate-950">No customer links yet</h3>
          <p className="mx-auto mt-1.5 max-w-sm text-xs sm:text-sm text-slate-500">
            Add your Rate 5★ on Google button, WhatsApp ordering chat, Instagram specials, or digital food menu.
          </p>
          <button onClick={() => setEditing("new")} className={`${brandBtn} mt-6`}>
            <Plus size={15} /> Add Your First Link
          </button>
        </div>
      )}

      {/* Links List */}
      <ul className="space-y-3">
        {links.map((link, i) => {
          if (editing === link.id) {
            return (
              <li key={link.id}>
                <LinkForm
                  initial={link}
                  businessCategory={business.category}
                  businessName={business.businessName}
                  onSubmit={(values) => submitEdit(link.id, values)}
                  onCancel={() => setEditing(null)}
                />
              </li>
            );
          }

          const { label } = getLinkType(link.icon);

          return (
            <li
              key={link.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md"
            >
              {/* Left Details */}
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    disabled={i === 0 || busy}
                    onClick={() => move(i, -1)}
                    title="Move up"
                    aria-label="Move up"
                    className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-25 cursor-pointer transition-colors"
                  >
                    <ChevronUp size={15} />
                  </button>
                  <button
                    disabled={i === links.length - 1 || busy}
                    onClick={() => move(i, 1)}
                    title="Move down"
                    aria-label="Move down"
                    className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-25 cursor-pointer transition-colors"
                  >
                    <ChevronDown size={15} />
                  </button>
                </div>

                {/* Brand Icon Box */}
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform">
                  <BrandLogo name={link.icon} size={22} />
                </span>

                {/* Title & URL */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="truncate text-sm sm:text-base font-bold text-slate-950">
                      {link.title}
                    </p>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      {label}
                    </span>
                    {link.icon === "google-reviews" && link.enableReviewAssistant && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#d4f04d]/40 px-2 py-0.5 text-[10px] font-black text-slate-950">
                        <Sparkles size={10} /> 5★ Review Booster
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs font-mono text-slate-400 mt-0.5">{link.url}</p>
                </div>
              </div>

              {/* Right Stats & Action Buttons */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditing(link.id)}
                    title="Edit destination"
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => remove(link.id, link.title)}
                    title="Delete destination"
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
