import { ChevronDown, ChevronUp, Link2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import LinkForm, { type LinkValues } from "../components/LinkForm";
import { PageError, PageLoading } from "../components/PageState";
import { useToast } from "../components/Toast";
import { useBusiness } from "../hooks/useBusiness";
import { api, getErrorMessage } from "../lib/api";
import { getLinkType } from "../lib/linkTypes";
import type { Business } from "../lib/types";
import { cardClass, primaryBtn } from "../lib/ui";

type Res = { data: { business: Business } };

export default function Links() {
  const { business, setBusiness, loading, error, reload } = useBusiness();
  const toast = useToast();
  const [params] = useSearchParams();
  const [editing, setEditing] = useState<string | null>(params.get("add") === "1" ? "new" : null); // link id, "new" or null
  const [busy, setBusy] = useState(false);

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} onRetry={reload} />;

  if (!business) {
    return (
      <div className={`${cardClass} text-center`}>
        <p className="text-slate-600">Create your business profile before adding links.</p>
        <Link to="/dashboard/business/new" className={`${primaryBtn} mt-4`}>Create business profile</Link>
      </div>
    );
  }

  const base = `/business/${business.id}/links`;
  const links = business.links;

  // Runs an API call, updates the business from the response, and reports errors via toast.
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
    toast.show("Link added");
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
    if (!window.confirm(`Delete "${title}"?`)) return;
    run(() => api.delete<Res>(`${base}/${linkId}`), "Link deleted");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Links</h1>
        {editing !== "new" && (
          <button onClick={() => setEditing("new")} className={primaryBtn}>
            <Plus size={16} /> Add link
          </button>
        )}
      </div>

      {editing === "new" && <LinkForm onSubmit={submitNew} onCancel={() => setEditing(null)} />}

      {links.length === 0 && editing !== "new" && (
        <div className={`${cardClass} text-center`}>
          <Link2 className="mx-auto text-slate-400" />
          <p className="mt-2 font-medium">No links yet</p>
          <p className="text-sm text-slate-500">Add your Instagram, Google Maps, menu or any other link.</p>
        </div>
      )}

      <ul className="space-y-2">
        {links.map((link, i) => {
          if (editing === link.id) {
            return (
              <li key={link.id}>
                <LinkForm initial={link} onSubmit={(v) => submitEdit(link.id, v)} onCancel={() => setEditing(null)} />
              </li>
            );
          }
          const { Icon } = getLinkType(link.icon);
          return (
            <li key={link.id}
              className={`flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200 ${
                link.isActive ? "" : "opacity-60"
              }`}>
              <div className="flex flex-col">
                <button disabled={busy || i === 0} onClick={() => move(i, -1)} aria-label="Move up"
                  className="rounded p-0.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30">
                  <ChevronUp size={16} />
                </button>
                <button disabled={busy || i === links.length - 1} onClick={() => move(i, 1)} aria-label="Move down"
                  className="rounded p-0.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30">
                  <ChevronDown size={16} />
                </button>
              </div>
              <div className="rounded-lg bg-slate-100 p-2 text-slate-700"><Icon size={18} /></div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{link.title}</p>
                <p className="truncate text-xs text-slate-500">{link.url}</p>
              </div>
              <button role="switch" aria-checked={link.isActive} disabled={busy}
                aria-label={link.isActive ? "Disable link" : "Enable link"}
                onClick={() => run(() => api.put<Res>(`${base}/${link.id}`, { isActive: !link.isActive }))}
                className={`relative h-6 w-10 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
                  link.isActive ? "bg-emerald-500" : "bg-slate-300"
                }`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  link.isActive ? "left-[18px]" : "left-0.5"
                }`} />
              </button>
              <button onClick={() => setEditing(link.id)} aria-label="Edit link"
                className="rounded p-1.5 text-slate-600 hover:bg-slate-100"><Pencil size={16} /></button>
              <button onClick={() => remove(link.id, link.title)} disabled={busy} aria-label="Delete link"
                className="rounded p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-60"><Trash2 size={16} /></button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
