import { AlertTriangle, CheckCircle2, ExternalLink, Globe, Loader2, Sparkles, Trash2 } from "lucide-react";
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
import { brandBtn, cardClass, dangerBtn, inputClass } from "../lib/ui";

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
      !window.confirm("⚠️ Changing the URL slug will invalidate any QR codes you have already printed. Are you sure you want to proceed?")
    ) {
      return;
    }
    setSaving(true);
    try {
      const payload = { businessName: name, category, description, slug, ...(mode === "edit" ? { isActive } : {}) };
      if (mode === "create") {
        const res = await api.post<{ data: { business: Business } }>("/business", payload);
        setBusiness(res.data.data.business);
        toast.show("Business profile created! Next, upload your logo and add your links.");
        navigate("/dashboard/business/edit", { replace: true });
      } else if (business) {
        const res = await api.put<{ data: { business: Business } }>(`/business/${business.id}`, payload);
        setBusiness(res.data.data.business);
        setSlug(res.data.data.business.slug);
        toast.show("Profile updated successfully");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!business) return;
    if (!window.confirm("Delete this business, all its links, and its QR code? This action cannot be undone.")) return;
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
    <div className="space-y-6 animate-fadeIn max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#284737]">
          {mode === "create" ? "Create Business Profile" : "Business Profile & Settings"}
        </h1>
        <p className="text-sm text-[#70a087] mt-0.5">
          {mode === "create"
            ? "Configure your business identity and reserve your unique QR landing page URL."
            : "Update your business details, branding logo, and page availability."}
        </p>
      </div>

      {/* Logo uploader in edit mode */}
      {mode === "edit" && business && (
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#b7dbc4]/40">
            <Sparkles size={17} className="text-[#467359]" />
            <h2 className="font-bold text-[#284737]">Brand Logo</h2>
          </div>
          <LogoUploader business={business} onChange={setBusiness} />
        </div>
      )}

      {/* Main Details Form */}
      <form onSubmit={onSubmit} className={`${cardClass} space-y-5`}>
        <div className="flex items-center justify-between pb-3 border-b border-[#b7dbc4]/40">
          <h2 className="font-bold text-[#284737]">General Information</h2>
          {mode === "edit" && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold ${
                isActive ? "bg-[#dff6e2] text-[#355d48]" : "bg-slate-200 text-slate-700"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${isActive ? "bg-[#69bd92] animate-pulse" : "bg-slate-400"}`} />
              {isActive ? "Page Published" : "Page Inactive"}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#467359]">
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            required
            maxLength={80}
            value={name}
            placeholder="e.g. Artisan Coffee & Roastery"
            className={inputClass}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="category" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#467359]">
            Category / Industry
          </label>
          <input
            id="category"
            maxLength={40}
            value={category}
            placeholder="e.g. Specialty Cafe, Boutique Salon, Studio..."
            className={inputClass}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#467359]">
            Bio / Description
          </label>
          <textarea
            id="description"
            rows={3}
            maxLength={300}
            value={description}
            className={inputClass}
            placeholder="Brief bio or message customers see when scanning your QR code"
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="mt-1 flex justify-between text-[11px] text-[#70a087]">
            <span>Shown right below your business name on the public page</span>
            <span>{description.length}/300</span>
          </div>
        </div>

        {/* Custom Slug / URL */}
        <div className="rounded-2xl bg-[#f0f3f0] p-4 ring-1 ring-[#b7dbc4]">
          <label htmlFor="slug" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#467359]">
            Public Page Address (Slug) <span className="text-red-500">*</span>
          </label>
          <div className="flex rounded-xl bg-white shadow-xs ring-1 ring-[#b7dbc4] focus-within:ring-2 focus-within:ring-[#69bd92]">
            <span className="flex items-center pl-3.5 pr-1 text-xs text-[#70a087] font-mono select-none">
              <Globe size={14} className="mr-1.5 text-[#467359]" />
              /p/
            </span>
            <input
              id="slug"
              required
              maxLength={40}
              value={slug}
              placeholder="my-business"
              className="w-full bg-transparent py-2.5 pr-3 text-sm font-medium text-[#284737] focus:outline-none"
              onChange={(e) => {
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                setSlugTouched(true);
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[#43745b] font-mono truncate max-w-md">{livePublicUrl}</span>
            {slug && (
              <a
                href={livePublicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[#467359] hover:underline"
              >
                Preview <ExternalLink size={12} />
              </a>
            )}
          </div>
          {mode === "edit" && (
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 rounded-lg p-2">
              <AlertTriangle size={13} className="shrink-0" />
              <span>Warning: Changing your page address will break any physical QR codes you have already printed.</span>
            </div>
          )}
        </div>

        {/* Page status toggle */}
        {mode === "edit" && (
          <div className="flex items-center justify-between rounded-xl bg-[#f0f3f0]/60 p-3.5 border border-[#b7dbc4]/40">
            <div>
              <p className="text-sm font-bold text-[#284737]">Page Status</p>
              <p className="text-xs text-[#70a087]">When turned off, visitors will see an inactive message.</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-[#a5afa9] peer-checked:bg-[#69bd92] peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
          </div>
        )}

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs text-red-700 font-medium">
            {error}
          </p>
        )}

        <div className="pt-2">
          <button type="submit" disabled={saving} className={`${brandBtn} w-full justify-center text-sm py-3`}>
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving changes...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                {mode === "create" ? "Create Business Profile" : "Save Changes"}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      {mode === "edit" && (
        <div className={`${cardClass} border-red-200/80 bg-red-50/20`}>
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
            <Trash2 size={16} />
            <span>Danger Zone</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
            Permanently delete this business, its connected links, logo, and scan analytics. Your printed QR code will stop functioning immediately.
          </p>
          <div className="mt-4">
            <button onClick={onDelete} disabled={deleting} className={`${dangerBtn} text-xs py-2 px-3.5`}>
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Delete Business Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
