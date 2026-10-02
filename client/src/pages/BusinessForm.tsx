import { Loader2 } from "lucide-react";
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
import { cardClass, dangerBtn, inputClass, primaryBtn } from "../lib/ui";

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
      !window.confirm("Changing the URL will break any QR codes you have already printed. Continue?")
    ) {
      return;
    }
    setSaving(true);
    try {
      const payload = { businessName: name, category, description, slug, ...(mode === "edit" ? { isActive } : {}) };
      if (mode === "create") {
        const res = await api.post<{ data: { business: Business } }>("/business", payload);
        setBusiness(res.data.data.business);
        toast.show("Business created. Add your logo and links next.");
        navigate("/dashboard/business/edit", { replace: true });
      } else if (business) {
        const res = await api.put<{ data: { business: Business } }>(`/business/${business.id}`, payload);
        setBusiness(res.data.data.business);
        setSlug(res.data.data.business.slug);
        toast.show("Profile saved");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!business) return;
    if (!window.confirm("Delete this business, all its links and its QR code? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/business/${business.id}`);
      toast.show("Business deleted");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.show(getErrorMessage(err), "error");
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      {mode === "edit" && business && (
        <div className={cardClass}>
          <h2 className="mb-4 font-semibold">Logo</h2>
          <LogoUploader business={business} onChange={setBusiness} />
        </div>
      )}

      <form onSubmit={onSubmit} className={`${cardClass} space-y-4`}>
        <h1 className="text-xl font-semibold tracking-tight">
          {mode === "create" ? "Create your business profile" : "Business profile"}
        </h1>

        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">Business name</label>
          <input id="name" required maxLength={80} value={name} className={inputClass}
            onChange={(e) => onNameChange(e.target.value)} />
        </div>
        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium">Category</label>
          <input id="category" maxLength={40} value={category} placeholder="Cafe, salon, clinic..." className={inputClass}
            onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium">Description</label>
          <textarea id="description" rows={3} maxLength={300} value={description} className={inputClass}
            placeholder="A short line customers will see on your page"
            onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label htmlFor="slug" className="mb-1 block text-sm font-medium">Page address</label>
          <input id="slug" maxLength={40} value={slug} placeholder="cafe-xyz" className={inputClass}
            onChange={(e) => { setSlug(e.target.value.toLowerCase()); setSlugTouched(true); }} />
          <p className="mt-1 break-all text-xs text-slate-500">
            {publicUrl(slug || "your-business")}
            {mode === "edit" && " (changing this breaks printed QR codes)"}
          </p>
        </div>
        {mode === "edit" && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Page is active
          </label>
        )}

        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={saving} className={primaryBtn}>
          {saving && <Loader2 size={16} className="animate-spin" />}
          {mode === "create" ? "Create business" : "Save changes"}
        </button>
      </form>

      {mode === "edit" && (
        <div className={cardClass}>
          <h2 className="font-semibold">Delete business</h2>
          <p className="mt-1 text-sm text-slate-600">Removes your page, links and logo. Your QR code will stop working.</p>
          <button onClick={onDelete} disabled={deleting} className={`${dangerBtn} mt-3`}>
            {deleting && <Loader2 size={16} className="animate-spin" />}
            Delete business
          </button>
        </div>
      )}
    </div>
  );
}
