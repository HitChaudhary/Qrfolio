import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { api, getErrorMessage } from "../lib/api";
import type { Business } from "../lib/types";
import { dangerBtn, secondaryBtn } from "../lib/ui";
import { useToast } from "./Toast";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 2 * 1024 * 1024;

export default function LogoUploader({
  business,
  onChange,
}: {
  business: Business;
  onChange: (b: Business) => void;
}) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!ALLOWED.includes(file.type)) return setError("Use a JPG, PNG or WEBP image");
    if (file.size > MAX_BYTES) return setError("Image must be 2 MB or smaller");

    setError("");
    setBusy(true);
    try {
      const form = new FormData();
      form.append("logo", file);
      const res = await api.post<{ data: { business: Business } }>(`/business/${business.id}/logo`, form, {
        timeout: 30000,
      });
      onChange(res.data.data.business);
      toast.show("Logo updated");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function onRemove() {
    if (!window.confirm("Remove the logo?")) return;
    setError("");
    setBusy(true);
    try {
      const res = await api.delete<{ data: { business: Business } }>(`/business/${business.id}/logo`);
      onChange(res.data.data.business);
      toast.show("Logo removed");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
          {business.logoUrl ? (
            <img src={business.logoUrl} alt="Business logo" crossOrigin="anonymous" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="text-slate-400" />
          )}
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="animate-spin text-slate-600" />
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className={secondaryBtn}>
            {business.logoUrl ? "Replace logo" : "Upload logo"}
          </button>
          {business.logoUrl && (
            <button type="button" disabled={busy} onClick={onRemove} className={dangerBtn}>
              <Trash2 size={16} /> Remove
            </button>
          )}
        </div>
        <input ref={inputRef} type="file" accept={ALLOWED.join(",")} onChange={onFile} className="hidden" />
      </div>
      <p className="mt-2 text-xs text-slate-500">JPG, PNG or WEBP, up to 2 MB. A square image works best.</p>
      {error && <p role="alert" className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
