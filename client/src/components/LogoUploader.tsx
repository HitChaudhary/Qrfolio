import { ImagePlus, Loader2, Sparkles, Trash2, UploadCloud } from "lucide-react";
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
    if (!ALLOWED.includes(file.type)) return setError("Please upload a JPG, PNG, or WEBP image.");
    if (file.size > MAX_BYTES) return setError("Image must be 2 MB or smaller.");

    setError("");
    setBusy(true);
    try {
      const form = new FormData();
      form.append("logo", file);
      const res = await api.post<{ data: { business: Business } }>(`/business/${business.id}/logo`, form, {
        timeout: 30000,
      });
      onChange(res.data.data.business);
      toast.show("Logo uploaded successfully");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function onRemove() {
    if (!window.confirm("Are you sure you want to remove your brand logo?")) return;
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
    <div className="space-y-3">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Logo preview box */}
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#b7dbc4] bg-[#f0f3f0] transition-all group hover:border-[#69bd92]">
          {business.logoUrl ? (
            <img
              src={business.logoUrl}
              alt="Business logo"
              crossOrigin="anonymous"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-[#70a087]">
              <ImagePlus size={24} />
              <span className="mt-1 text-[10px] font-medium text-[#70a087]">No logo</span>
            </div>
          )}
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#284737]/60 backdrop-blur-xs">
              <Loader2 className="animate-spin text-white" size={24} />
            </div>
          )}
        </div>

        {/* Upload & manage actions */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className={secondaryBtn}
            >
              <UploadCloud size={16} />
              {business.logoUrl ? "Replace Logo" : "Upload Brand Logo"}
            </button>
            {business.logoUrl && (
              <button type="button" disabled={busy} onClick={onRemove} className={dangerBtn}>
                <Trash2 size={16} /> Remove
              </button>
            )}
          </div>
          <p className="flex items-center gap-1.5 text-xs text-[#70a087]">
            <Sparkles size={12} className="text-[#467359] shrink-0" />
            Recommended: Square PNG/JPG up to 2MB. Logo appears in your QR center & bio header.
          </p>
        </div>
        <input ref={inputRef} type="file" accept={ALLOWED.join(",")} onChange={onFile} className="hidden" />
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
          {error}
        </p>
      )}
    </div>
  );
}
