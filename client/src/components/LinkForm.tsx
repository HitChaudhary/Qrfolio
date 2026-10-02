import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { getErrorMessage } from "../lib/api";
import { LINK_TYPES, getLinkType } from "../lib/linkTypes";
import type { BusinessLink } from "../lib/types";
import { inputClass, primaryBtn, secondaryBtn } from "../lib/ui";

export interface LinkValues {
  icon: string;
  title: string;
  url: string;
}

export default function LinkForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: BusinessLink;
  onSubmit: (values: LinkValues) => Promise<void>;
  onCancel: () => void;
}) {
  const [icon, setIcon] = useState(initial?.icon ?? "instagram");
  const [title, setTitle] = useState(initial?.title ?? getLinkType("instagram").label);
  const [url, setUrl] = useState(initial?.url ?? "");
  const [titleTouched, setTitleTouched] = useState(Boolean(initial));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const type = getLinkType(icon);

  function onTypeChange(value: string) {
    setIcon(value);
    if (!titleTouched) setTitle(value === "custom" ? "" : getLinkType(value).label);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit({ icon, title, url });
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-300">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="link-type" className="mb-1 block text-sm font-medium">Type</label>
          <select id="link-type" value={icon} onChange={(e) => onTypeChange(e.target.value)} className={inputClass}>
            {LINK_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="link-title" className="mb-1 block text-sm font-medium">Button text</label>
          <input id="link-title" required maxLength={60} value={title} className={inputClass}
            onChange={(e) => { setTitle(e.target.value); setTitleTouched(true); }} />
        </div>
      </div>
      <div>
        <label htmlFor="link-url" className="mb-1 block text-sm font-medium">
          {icon === "phone" ? "Phone number" : icon === "email" ? "Email address" : "URL"}
        </label>
        <input id="link-url" required value={url} placeholder={type.placeholder} className={inputClass}
          autoComplete="off" inputMode={icon === "phone" ? "tel" : icon === "email" ? "email" : "url"}
          onChange={(e) => setUrl(e.target.value)} />
      </div>
      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className={primaryBtn}>
          {saving && <Loader2 size={16} className="animate-spin" />}
          {initial ? "Save changes" : "Add link"}
        </button>
        <button type="button" onClick={onCancel} disabled={saving} className={secondaryBtn}>Cancel</button>
      </div>
    </form>
  );
}
