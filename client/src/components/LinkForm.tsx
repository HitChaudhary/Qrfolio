import { Check, Info, Loader2, Sparkles, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { getErrorMessage } from "../lib/api";
import { LINK_TYPES, getLinkType } from "../lib/linkTypes";
import { BUSINESS_CATEGORIES } from "../lib/reviewSuggestions";
import type { BusinessLink } from "../lib/types";
import { brandBtn, inputClass, secondaryBtn } from "../lib/ui";

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
  businessName = "",
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
  const { Icon } = type;

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
          {icon === "phone"
            ? "Phone Number"
            : icon === "email"
            ? "Email Address"
            : icon === "google-reviews"
            ? "Google Review URL"
            : "Destination URL"}
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          id="link-url"
          required
          value={url}
          placeholder={
            icon === "google-reviews"
              ? "https://g.page/r/.../review or https://search.google.com/local/writereview?placeid=..."
              : type.placeholder
          }
          className={inputClass}
          autoComplete="off"
          inputMode={icon === "phone" ? "tel" : icon === "email" ? "email" : "url"}
          onChange={(e) => setUrl(e.target.value)}
        />
        {icon === "google-reviews" && (
          <p className="mt-1 text-[11px] text-[#70a087]">
            Paste your direct Google Business review link. Customers will be directed here to post their review.
          </p>
        )}
      </div>

      {/* Special Google Review Configuration */}
      {icon === "google-reviews" && (
        <div className="rounded-xl border border-[#b7dbc4] bg-[#f0f3f0]/40 p-4 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#284737]">
            <Sparkles size={14} className="text-[#467359]" />
            <span>Google Review Assistant Settings</span>
          </div>

          <div>
            <label
              htmlFor="review-category"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#43745b]"
            >
              Business Category <span className="text-red-500">*</span>
            </label>
            <select
              id="review-category"
              value={reviewCategory}
              onChange={(e) => setReviewCategory(e.target.value)}
              className={`${inputClass} bg-white`}
              required
            >
              {BUSINESS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-[#70a087]">
              Used to suggest relevant customer experience topics (e.g. food quality, service, ambiance).
            </p>
          </div>

          {/* Toggle for Review Assistant */}
          <div className="flex items-start justify-between gap-3 rounded-lg bg-white p-3 border border-[#b7dbc4]/60">
            <div className="space-y-0.5">
              <label htmlFor="review-assistant-toggle" className="text-sm font-semibold text-[#284737] block cursor-pointer">
                Review Assistant
              </label>
              <p className="text-xs text-[#70a087] leading-relaxed">
                {enableReviewAssistant
                  ? "Customers tap Google Reviews → Review Assistant helps them draft & copy their genuine review → proceeds to Google."
                  : "Review Assistant disabled. Customers will open your Google Review URL directly."}
              </p>
            </div>
            <button
              id="review-assistant-toggle"
              type="button"
              role="switch"
              aria-checked={enableReviewAssistant}
              onClick={() => setEnableReviewAssistant(!enableReviewAssistant)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors cursor-pointer ${
                enableReviewAssistant ? "bg-[#467359]" : "bg-[#a5afa9]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  enableReviewAssistant ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {businessName && (
            <div className="flex items-center gap-2 text-xs text-[#43745b] bg-[#e3f7e6]/50 p-2.5 rounded-lg border border-[#b7dbc4]/40">
              <Info size={14} className="shrink-0 text-[#467359]" />
              <span>
                Personalized review suggestions will feature your business name: <strong>{businessName}</strong>.
              </span>
            </div>
          )}
        </div>
      )}

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
