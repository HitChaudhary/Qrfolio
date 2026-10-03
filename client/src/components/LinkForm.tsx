import { Check, Loader2, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { getErrorMessage } from "../lib/api";
import { LINK_TYPES, getLinkType } from "../lib/linkTypes";
import type { BusinessLink } from "../lib/types";
import { brandBtn, inputClass, secondaryBtn } from "../lib/ui";

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
  const { Icon } = type;

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
    <form
      onSubmit={submit}
      className="space-y-4 rounded-2xl border-2 border-[#b7dbc4] bg-white p-5 shadow-lg shadow-[#467359]/5 ring-1 ring-[#284737]/5 animate-fade-in"
    >
      <div className="flex items-center justify-between border-b border-[#e3f7e6] pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e3f7e6] text-[#467359]">
            <Icon size={18} />
          </div>
          <span className="font-semibold text-[#284737] text-sm">
            {initial ? "Edit Link" : "Add New Link"}
          </span>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-1 text-[#70a087] hover:bg-[#e3f7e6] hover:text-[#284737] cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="link-type" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#43745b]">
            Platform / Type
          </label>
          <select
            id="link-type"
            value={icon}
            onChange={(e) => onTypeChange(e.target.value)}
            className={`${inputClass} bg-[#f0f3f0]/50`}
          >
            {LINK_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="link-title" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#43745b]">
            Button Label
          </label>
          <input
            id="link-title"
            required
            maxLength={60}
            value={title}
            placeholder="e.g. Follow on Instagram"
            className={inputClass}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleTouched(true);
            }}
          />
        </div>
      </div>

      <div>
        <label htmlFor="link-url" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#43745b]">
          {icon === "phone" ? "Phone Number" : icon === "email" ? "Email Address" : "Destination URL"}
        </label>
        <input
          id="link-url"
          required
          value={url}
          placeholder={type.placeholder}
          className={inputClass}
          autoComplete="off"
          inputMode={icon === "phone" ? "tel" : icon === "email" ? "email" : "url"}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
          {error}
        </p>
      )}

      <div className="flex items-center gap-2.5 pt-1">
        <button type="submit" disabled={saving} className={brandBtn}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
          {initial ? "Save Link" : "Add Link"}
        </button>
        <button type="button" onClick={onCancel} disabled={saving} className={secondaryBtn}>
          Cancel
        </button>
      </div>
    </form>
  );
}
