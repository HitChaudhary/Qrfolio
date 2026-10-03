import {
  ChevronDown,
  ChevronUp,
  Link2,
  Pencil,
  Plus,
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
import { brandBtn } from "../lib/ui";

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
      <div className="rounded-3xl border border-[#b7dbc4] bg-white p-10 text-center shadow-xs">
        <p className="text-[#43745b]">Please create your business profile before managing links.</p>
        <Link to="/dashboard/business/new" className={`${brandBtn} mt-5`}>
          Create Business Profile
        </Link>
      </div>
    );
  }

  const base = `/business/${business.id}/links`;
  const links = business.links;

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
    toast.show("New link added to your page");
  }

  async function submitEdit(linkId: string, values: LinkValues) {
    const res = await api.put<Res>(`${base}/${linkId}`, values);
    setBusiness(res.data.data.business);
    setEditing(null);
    toast.show("Link updated");
  }

  function move(index: number, dir: -1 | 1) {
    const ids = links.map((l) => l.id);
    const target = index + dir;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    run(() => api.put<Res>(`${base}/reorder`, { order: ids }));
  }

  function remove(linkId: string, title: string) {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    run(() => api.delete<Res>(`${base}/${linkId}`), "Link deleted");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#284737] sm:text-3xl">
            Links & Destinations
          </h1>
          <p className="text-xs sm:text-sm text-[#70a087] mt-0.5">
            Add and arrange all the links that appear when customers scan your QR code.
          </p>
        </div>
        {editing !== "new" && (
          <button onClick={() => setEditing("new")} className={brandBtn}>
            <Plus size={16} /> Add New Link
          </button>
        )}
      </div>

      {/* New Link Form */}
      {editing === "new" && (
        <LinkForm onSubmit={submitNew} onCancel={() => setEditing(null)} />
      )}

      {/* Empty State */}
      {links.length === 0 && editing !== "new" && (
        <div className="rounded-3xl border border-dashed border-[#b7dbc4] bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e3f7e6] text-[#467359] mb-4">
            <Link2 size={28} />
          </div>
          <h3 className="font-bold text-lg text-[#284737]">No links added yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-xs sm:text-sm text-[#70a087]">
            Add your social media channels, Google review link, WhatsApp, digital menu, or custom website.
          </p>
          <button onClick={() => setEditing("new")} className={`${brandBtn} mt-6`}>
            <Plus size={16} /> Add Your First Link
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
                  onSubmit={(v) => submitEdit(link.id, v)}
                  onCancel={() => setEditing(null)}
                />
              </li>
            );
          }

          const { Icon } = getLinkType(link.icon);

          return (
            <li
              key={link.id}
              className={`group flex items-center gap-3.5 rounded-2xl border border-[#b7dbc4]/70 bg-white p-3.5 sm:p-4 shadow-xs transition-all duration-200 hover:border-[#69bd92] hover:shadow-md ${
                link.isActive ? "" : "opacity-60 bg-[#f0f3f0]/70"
              }`}
            >
              {/* Reorder Buttons */}
              <div className="flex flex-col gap-0.5">
                <button
                  disabled={busy || i === 0}
                  onClick={() => move(i, -1)}
                  aria-label="Move up"
                  title="Move up"
                  className="flex h-6 w-6 items-center justify-center rounded-md text-[#70a087] hover:bg-[#e3f7e6] hover:text-[#284737] disabled:opacity-20 cursor-pointer disabled:pointer-events-none"
                >
                  <ChevronUp size={15} />
                </button>
                <button
                  disabled={busy || i === links.length - 1}
                  onClick={() => move(i, 1)}
                  aria-label="Move down"
                  title="Move down"
                  className="flex h-6 w-6 items-center justify-center rounded-md text-[#70a087] hover:bg-[#e3f7e6] hover:text-[#284737] disabled:opacity-20 cursor-pointer disabled:pointer-events-none"
                >
                  <ChevronDown size={15} />
                </button>
              </div>

              {/* Platform Icon Badge */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e3f7e6] text-[#467359] group-hover:bg-[#467359] group-hover:text-white transition-colors">
                <Icon size={20} />
              </div>

              {/* Link Details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-[#284737]">{link.title}</p>
                  {!link.isActive && (
                    <span className="rounded-md bg-[#f0f3f0] px-1.5 py-0.2 text-[10px] font-medium text-[#70a087]">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-[#70a087] font-mono mt-0.5">{link.url}</p>
              </div>

              {/* Active Toggle Switch */}
              <button
                role="switch"
                aria-checked={link.isActive}
                disabled={busy}
                aria-label={link.isActive ? "Hide link" : "Show link"}
                title={link.isActive ? "Link is active (click to hide)" : "Link is hidden (click to activate)"}
                onClick={() =>
                  run(() => api.put<Res>(`${base}/${link.id}`, { isActive: !link.isActive }))
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors cursor-pointer disabled:opacity-50 ${
                  link.isActive ? "bg-[#69bd92]" : "bg-[#a5afa9]"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    link.isActive ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditing(link.id)}
                  aria-label="Edit link"
                  title="Edit link"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#70a087] hover:bg-[#e3f7e6] hover:text-[#284737] cursor-pointer"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => remove(link.id, link.title)}
                  disabled={busy}
                  aria-label="Delete link"
                  title="Delete link"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#a5afa9] hover:bg-red-50 hover:text-red-600 disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
