import { AlertTriangle, CheckCircle2, ExternalLink, Globe, Loader2, Sparkles, Store, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import LogoUploader from "../components/LogoUploader";
import { PageError, PageLoading } from "../components/PageState";
import { useToast } from "../components/Toast";
import { useBusiness } from "../hooks/useBusiness";
import { api, getErrorMessage } from "../lib/api";
import { publicUrl } from "../lib/config";
import { slugify } from "../lib/slug";
import type { Business } from "../lib/types";
import { brandBtn, cardClass, dangerBtn, inputClass, secondaryBtn } from "../lib/ui";

type Mode = "create" | "edit";

export default function BusinessForm({ mode }: { mode: Mode }) {
  const { business, setBusiness, loading, error, reload } = useBusiness();

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} onRetry={reload} />;
  if (mode === "create" && business) return <Navigate to="/dashboard/business/edit" replace />;
  if (mode === "edit" && !business) return <Navigate to="/dashboard/business/new" replace />;

  return <Form key={business?.id ?? "new"} mode={mode} business={business} setBusiness={setBusiness} />;
}

function Form({
  mode,
  business,
  setBusiness,
}: {
  mode: Mode;
  business: Business | null;
  setBusiness: (b: Business) => void;
}) {
  const navigate = useNavigate();
  const toast = useToast();
  const [name, setName] = useState(business?.businessName ?? "");
  const [category, setCategory] = useState(business?.category ?? "");
  const [description, setDescription] = useState(business?.description ?? "");
  const [slug, setSlug] = useState(business?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [isActive, setIsActive] = useState(business?.isActive ?? true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function onNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (
      mode === "edit" &&
      business &&
      slug !== business.slug &&
      !window.confirm("⚠️ Changing your URL slug will invalidate any QR codes you have already printed. Are you sure you want to proceed?")
    ) {
      return;
    }
    setSaving(true);
    try {
      const payload = { businessName: name, category, description, slug, ...(mode === "edit" ? { isActive } : {}) };
      if (mode === "create") {
        const res = await api.post<{ data: { business: Business } }>("/business", payload);
        setBusiness(res.data.data.business);
        toast.show("Store hub created! Now upload your logo and publish your links.");
        navigate("/dashboard/business/edit", { replace: true });
      } else if (business) {
        const res = await api.put<{ data: { business: Business } }>(`/business/${business.id}`, payload);
        setBusiness(res.data.data.business);
        setSlug(res.data.data.business.slug);
        toast.show("Store profile updated successfully");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!business) return;
    if (!window.confirm("Delete this store hub, all links, and its QR code? This action cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/business/${business.id}`);
      toast.show("Business profile deleted");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.show(getErrorMessage(err), "error");
      setDeleting(false);
    }
  }

  const livePublicUrl = publicUrl(slug || "your-brand");

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
          {mode === "create" ? "Create Store Profile" : "Storefront Profile & Branding"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {mode === "create"
            ? "Configure your business identity and reserve your permanent QR counter URL."
            : "Update your business name, daily announcement, logo, and active counter availability."}
        </p>
      </div>

      {/* Logo uploader in edit mode */}
      {mode === "edit" && business && (
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Sparkles size={17} className="text-[#d4f04d]" />
            <h2 className="font-display font-black text-slate-950 text-base">Store Brand Logo</h2>
          </div>
          <LogoUploader business={business} onChange={setBusiness} />
        </div>
      )}

      {/* Main Details Form */}
      <form onSubmit={onSubmit} className={`${cardClass} space-y-5`}>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <h2 className="font-display font-black text-slate-950 text-base">General Information</h2>
          {mode === "edit" && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-bold ${
                isActive ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-slate-100 text-slate-600"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
              {isActive ? "Page Published" : "Page Inactive"}
            </span>
          )}
        </div>

        {/* Business Name */}
        <div>
          <label htmlFor="biz-name" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Business or Shop Name *
          </label>
          <input
            id="biz-name"
            required
            maxLength={60}
            placeholder="e.g. Nilkanth Cafe or Shreeji Restaurant"
            className={inputClass}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="biz-cat" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Category / Cuisine / Industry
          </label>
          <input
            id="biz-cat"
            maxLength={50}
            placeholder="e.g. Specialty Tea, Snacks & Bakery or Pure Veg Gujarati Dining"
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {/* Description / Announcement */}
        <div>
          <label htmlFor="biz-desc" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Store Bio / Today's Announcement
          </label>
          <textarea
            id="biz-desc"
            rows={3}
            maxLength={300}
            placeholder="e.g. Famous Kadak Masala Chai, Handcrafted Maska Bun & Cold Cocoa. Open 7 AM - 11 PM."
            className={inputClass}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Appears at the top of your mobile bio page right below your store name.
          </p>
        </div>

        {/* URL Slug */}
        <div>
          <label htmlFor="biz-slug" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Vanity URL Slug *
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400">
              /p/
            </span>
            <input
              id="biz-slug"
              required
              maxLength={40}
              placeholder="nilkanth-cafe"
              className={`${inputClass} !pl-10 font-mono text-xs`}
              value={slug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setSlugTouched(true);
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span className="truncate">Live counter URL: <strong className="text-slate-800">{livePublicUrl}</strong></span>
            {mode === "edit" && (
              <a href={livePublicUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-bold text-slate-900 hover:underline">
                <ExternalLink size={12} /> Test Page
              </a>
            )}
          </div>
        </div>

        {/* Active Toggle in Edit Mode */}
        {mode === "edit" && (
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-200/80">
            <div>
              <p className="text-xs font-bold text-slate-900">Publish Profile to Public</p>
              <p className="text-[11px] text-slate-500">When disabled, customers scanning will see a friendly unavailable notice.</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-slate-950 peer-checked:after:translate-x-full" />
            </label>
          </div>
        )}

        {error && (
          <p role="alert" className="rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button type="submit" disabled={saving} className={`${brandBtn} !py-3 !px-6`}>
            {saving && <Loader2 size={15} className="animate-spin mr-1" />}
            {mode === "create" ? "Create Store Hub ↗" : "Save Profile"}
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      {mode === "edit" && business && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/40 p-6 space-y-3">
          <h3 className="font-display font-black text-rose-950 text-base">Danger Zone</h3>
          <p className="text-xs text-rose-800 leading-relaxed">
            Permanently delete your store hub, all customer destination links, and reset your dynamic QR code. This cannot be reversed.
          </p>
          <div className="pt-2">
            <button
              onClick={onDelete}
              disabled={deleting}
              className={`${dangerBtn} !text-xs !py-2.5 !px-4`}
            >
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Delete Store Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
