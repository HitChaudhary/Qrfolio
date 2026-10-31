import { Check, Info, Loader2, Sparkles, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { getErrorMessage } from "../lib/api";
import { LINK_TYPES, getLinkType } from "../lib/linkTypes";
import { BUSINESS_CATEGORIES } from "../lib/reviewSuggestions";
import type { BusinessLink } from "../lib/types";
import { brandBtn, inputClass, secondaryBtn } from "../lib/ui";
import { BrandLogo } from "./BrandLogos";

export interface LinkValues {
  icon: string;
  title: string;
  url: string;
  reviewCategory?: string;
  enableReviewAssistant?: boolean;
}

export default function LinkForm({
  initial,
  onSubmit,
  onCancel,
  businessCategory = "",
}: {
  initial?: BusinessLink;
  onSubmit: (values: LinkValues) => Promise<void>;
  onCancel: () => void;
  businessCategory?: string;
  businessName?: string;
}) {
  const [icon, setIcon] = useState(initial?.icon ?? "instagram");
  const [title, setTitle] = useState(initial?.title ?? getLinkType("instagram").label);
  const [url, setUrl] = useState(initial?.url ?? "");
  const [titleTouched, setTitleTouched] = useState(Boolean(initial));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Google Review specific states
  const initialCategory =
    initial?.reviewCategory ||
    (BUSINESS_CATEGORIES.includes(businessCategory as (typeof BUSINESS_CATEGORIES)[number])
      ? businessCategory
      : BUSINESS_CATEGORIES[0]);
  const [reviewCategory, setReviewCategory] = useState<string>(initialCategory);
  const [enableReviewAssistant, setEnableReviewAssistant] = useState<boolean>(
    initial?.enableReviewAssistant ?? true
  );

  const type = getLinkType(icon);

  function onTypeChange(value: string) {
    setIcon(value);
    if (!titleTouched) setTitle(value === "custom" ? "" : getLinkType(value).label);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (icon === "google-reviews" && !reviewCategory) {
      setError("Please select a business category for Google Reviews");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        icon,
        title,
        url,
        ...(icon === "google-reviews"
          ? { reviewCategory, enableReviewAssistant }
          : {}),
      });
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-xl ring-1 ring-slate-950/5 animate-fade-in"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 shadow-2xs">
            <BrandLogo name={icon} size={20} />
          </div>
          <div>
            <span className="font-display font-black text-slate-950 text-sm block">
              {initial ? "Edit Destination Link" : "Add Customer Destination"}
            </span>
            <span className="text-[11px] text-slate-500">
              Instantly reflects on your counter QR code without reprinting
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 cursor-pointer transition-colors"
        >
          <X size={17} />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="link-type" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Platform / Channel
          </label>
          <select
            id="link-type"
            value={icon}
            onChange={(e) => onTypeChange(e.target.value)}
            className={`${inputClass} font-medium`}
          >
            {LINK_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="link-title" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Button Label on Phone
          </label>
          <input
            id="link-title"
            required
            maxLength={60}
            value={title}
            placeholder="e.g. Rate Us 5★ on Google or WhatsApp Order"
            className={inputClass}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleTouched(true);
            }}
          />
        </div>
      </div>

      <div>
        <label htmlFor="link-url" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
          Destination URL / Deep Link
        </label>
        <input
          id="link-url"
          required
          type={icon === "phone" ? "tel" : "text"}
          value={url}
          placeholder={type.placeholder}
          className={inputClass}
          onChange={(e) => setUrl(e.target.value)}
        />
        <p className="mt-1.5 text-[11px] text-slate-500 leading-normal">
          e.g. {type.placeholder}
        </p>
      </div>

      {/* Google Reviews Assistant Configuration */}
      {icon === "google-reviews" && (
        <div className="space-y-3 rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-950">
                <Sparkles size={13} className="text-sky-600" />
                <span>Smart Google 5-Star Review Booster</span>
              </div>
              <p className="text-[11px] text-sky-800 leading-relaxed">
                Helps happy customers generate personalized review copy based on their dining or shopping experience before tapping straight to Google Maps.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center shrink-0">
              <input
                type="checkbox"
                checked={enableReviewAssistant}
                onChange={(e) => setEnableReviewAssistant(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-slate-950 peer-checked:after:translate-x-full" />
            </label>
          </div>

          {enableReviewAssistant && (
            <div className="pt-2 border-t border-sky-200/60">
              <label htmlFor="review-category" className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-sky-900">
                Business Category Focus
              </label>
              <select
                id="review-category"
                value={reviewCategory}
                onChange={(e) => setReviewCategory(e.target.value)}
                className={`${inputClass} bg-white text-xs`}
              >
                {BUSINESS_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
        <button type="button" onClick={onCancel} className={secondaryBtn}>
          Cancel
        </button>
        <button type="submit" disabled={saving} className={brandBtn}>
          {saving && <Loader2 size={14} className="animate-spin mr-1" />}
          {initial ? "Save Changes" : "Publish to Counter QR"}
        </button>
      </div>
    </form>
  );
}
