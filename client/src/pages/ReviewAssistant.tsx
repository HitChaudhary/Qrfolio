import axios from "axios";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Info,
  QrCode,
  RotateCw,
  Sparkles,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_BASE, api } from "../lib/api";
import { generateReviewDraft, getCategoryAttributes } from "../lib/reviewSuggestions";
import { QrfolioIconMark } from "../components/QrfolioLogo";
import type { PublicLink, PublicProfileData } from "../lib/types";

type State =
  | { status: "loading" }
  | { status: "ok"; data: PublicProfileData; link: PublicLink }
  | { status: "notfound"; message?: string }
  | { status: "error" };

export default function ReviewAssistant() {
  const { slug, linkId } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!slug) {
      setState({ status: "notfound", message: "Page not found" });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    api
      .get<{ data: PublicProfileData }>(`/public/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (cancelled) return;
        const profile = res.data.data;
        // Find matching google-reviews link
        let link: PublicLink | undefined;
        if (linkId) {
          link = profile.links.find((l) => l.id === linkId);
        }
        if (!link) {
          link = profile.links.find((l) => l.icon === "google-reviews");
        }

        if (!link) {
          setState({
            status: "notfound",
            message: "No active Google Review link found for this business.",
          });
          return;
        }

        setState({ status: "ok", data: profile, link });
      })
      .catch((err) => {
        if (cancelled) return;
        setState(
          axios.isAxiosError(err) && err.response?.status === 404
            ? { status: "notfound" }
            : { status: "error" }
        );
      });

    return () => {
      cancelled = true;
    };
  }, [slug, linkId]);

  useEffect(() => {
    if (state.status === "ok") {
      document.title = `Review Assistant - ${state.data.businessName} | QrFolio`;
    }
    return () => {
      document.title = "QrFolio - Smart Dynamic QR Portfolios";
    };
  }, [state]);

  return (
    <main className="relative min-h-screen bg-[#fafbfc] px-4 py-6 sm:py-10 flex flex-col items-center justify-between font-sans selection:bg-[#d4f04d] selection:text-slate-950">
      {/* Ambient background soft glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-96 bg-gradient-to-b from-sky-100/50 via-slate-100/30 to-transparent pointer-events-none blur-3xl -z-10" />
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-[#d4f04d]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md mx-auto flex-1">
        {state.status === "loading" && <AssistantSkeleton />}
        {state.status === "notfound" && (
          <div className="py-16 text-center rounded-3xl bg-white p-8 border border-slate-200 shadow-xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-[#d4f04d] shadow-sm">
              <QrCode size={32} />
            </div>
            <h1 className="mt-4 text-xl font-black text-slate-950 font-display">Review Assistant Not Available</h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
              {state.message || "This review page is unavailable or has been deactivated."}
            </p>
            <button
              onClick={() => (slug ? navigate(`/p/${slug}`) : navigate("/"))}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition-colors"
            >
              Back to Business Page
            </button>
          </div>
        )}
        {state.status === "error" && (
          <div className="py-16 text-center rounded-3xl bg-white p-8 border border-slate-200 shadow-xs">
            <h1 className="text-xl font-black text-slate-950 font-display">Something went wrong</h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">Could not load the review assistant. Please refresh.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-xs font-black text-white"
            >
              Reload Page
            </button>
          </div>
        )}
        {state.status === "ok" && (
          <AssistantView data={state.data} link={state.link} slug={slug ?? ""} />
        )}
      </div>

      {/* Powered by qrfolio footer badge */}
      <footer className="mt-10 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-slate-700 border border-slate-200/90 shadow-2xs hover:bg-[#0e1424] hover:text-white transition-all duration-200 group"
        >
          <div className="flex h-4 w-4 items-center justify-center rounded-sm group-hover:scale-105 transition-transform">
            <QrfolioIconMark size={14} mode="squircle" />
          </div>
          <span>Powered by <strong className="font-extrabold tracking-tight">qrfolio</strong></span>
        </Link>
      </footer>
    </main>
  );
}

function AssistantView({
  data,
  link,
  slug,
}: {
  data: PublicProfileData;
  link: PublicLink;
  slug: string;
}) {
  const businessName = data.businessName;
  const category = link.reviewCategory || data.category || "Restaurant / Café";
  const availableAttributes = useMemo(() => getCategoryAttributes(category), [category]);

  const [selectedAttrs, setSelectedAttrs] = useState<string[]>([]);
  const [customHighlight, setCustomHighlight] = useState<string>("");
  const [draft, setDraft] = useState<string>("");
  const [prevTemplateIndex, setPrevTemplateIndex] = useState<number>(-1);
  const [copied, setCopied] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string>("");
  const [showRedirectNotice, setShowRedirectNotice] = useState<boolean>(false);

  // Helper to re-generate draft with current state
  function updateDraft(attrs: string[], highlight: string, prevIdx: number) {
    const { draft: newDraft, templateIndex } = generateReviewDraft({
      businessName,
      category,
      selectedAttributes: attrs,
      customHighlight: highlight,
      previousIndex: prevIdx,
    });
    setDraft(newDraft);
    setPrevTemplateIndex(templateIndex);
    setCopied(false);
  }

  // Generate initial draft on mount or when category/name changes
  useEffect(() => {
    updateDraft([], "", -1);
  }, [businessName, category]);

  function toggleAttribute(attr: string) {
    const updated = selectedAttrs.includes(attr)
      ? selectedAttrs.filter((a) => a !== attr)
      : [...selectedAttrs, attr];

    setSelectedAttrs(updated);
    updateDraft(updated, customHighlight, prevTemplateIndex);
  }

  function handleGenerateAnother() {
    updateDraft(selectedAttrs, customHighlight, prevTemplateIndex);
  }

  function copyFallback(text: string): boolean {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "-9999px";
      textarea.setAttribute("readonly", "");
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);
      return successful;
    } catch {
      return false;
    }
  }

  function handleWriteReview() {
    // 1. Generate / ensure review draft using existing generator & keywords
    let textToCopy = draft.trim();
    if (!textToCopy) {
      const { draft: newDraft, templateIndex } = generateReviewDraft({
        businessName,
        category,
        selectedAttributes: selectedAttrs,
        customHighlight,
        previousIndex: prevTemplateIndex,
      });
      textToCopy = newDraft;
      setDraft(newDraft);
      setPrevTemplateIndex(templateIndex);
    }

    // 2. Perform clipboard copy directly within the click gesture
    let copiedOk = false;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setCopied(true);
          setCopyFeedback("Review copied! Paste it on Google.");
        })
        .catch(() => {
          const fallbackOk = copyFallback(textToCopy);
          if (fallbackOk) {
            setCopied(true);
            setCopyFeedback("Review copied! Paste it on Google.");
          } else {
            setCopied(false);
            setCopyFeedback("Could not copy automatically. Please copy the review text below manually.");
            const textareaEl = document.querySelector<HTMLTextAreaElement>("textarea");
            if (textareaEl) {
              textareaEl.focus();
              textareaEl.select();
            }
          }
        });
      copiedOk = true;
    } else {
      copiedOk = copyFallback(textToCopy);
    }

    if (copiedOk) {
      setCopied(true);
      setCopyFeedback("Review copied! Paste it on Google.");
    } else {
      setCopied(false);
      setCopyFeedback("Could not copy automatically. Please copy the review text below manually.");
      const textareaEl = document.querySelector<HTMLTextAreaElement>("textarea");
      if (textareaEl) {
        textareaEl.focus();
        textareaEl.select();
      }
    }

    // 3. Automatically open business's Google Review link in a new tab
    setShowRedirectNotice(true);
    const targetUrl = `${API_BASE}/go/${data.profileId}/${link.id}`;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={`/p/${encodeURIComponent(slug)}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors py-1 px-3 rounded-full bg-white border border-slate-200 shadow-2xs"
        >
          <ArrowLeft size={13} /> Back to {businessName}
        </Link>
        <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-slate-900 bg-[#d4f04d] px-3 py-1 rounded-full shadow-2xs">
          <Star size={11} className="fill-slate-950" /> 5★ Review Booster
        </span>
      </div>

      {/* Business Header Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs text-center space-y-2.5">
        {data.logoUrl ? (
          <img
            src={data.logoUrl}
            alt={businessName}
            crossOrigin="anonymous"
            className="mx-auto h-16 w-16 rounded-full object-cover shadow-sm ring-2 ring-slate-100"
          />
        ) : (
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 text-2xl font-black text-[#d4f04d] shadow-sm font-display">
            {businessName.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h1 className="font-display font-black text-xl sm:text-2xl text-slate-950 tracking-tight">
            {businessName}
          </h1>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-0.5 rounded-full">
              <Sparkles size={11} className="text-[#d4f04d]" /> {category}
            </span>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-950">Help write your 5-star review</h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-xs mx-auto">
            Choose what you liked below. Your review includes natural Google local search keywords to help others find {businessName}.
          </p>
        </div>
      </div>

      {/* Experience Selection Buttons */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            What did you enjoy most?
          </p>
          {selectedAttrs.length > 0 && (
            <button
              onClick={() => {
                setSelectedAttrs([]);
                updateDraft([], customHighlight, prevTemplateIndex);
              }}
              className="text-[11px] font-bold text-rose-600 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {availableAttributes.map((attr) => {
            const isSelected = selectedAttrs.includes(attr);
            return (
              <button
                key={attr}
                type="button"
                onClick={() => toggleAttribute(attr)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-slate-950 text-white shadow-xs scale-[1.02]"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60"
                }`}
              >
                {isSelected && <Check size={12} className="stroke-[3] text-[#d4f04d]" />}
                <span>{attr}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Personal Note / Specific highlight for SEO */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <label htmlFor="custom-highlight" className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Sparkles size={12} className="text-slate-950" />
            Add a personal mention <span className="text-[10px] lowercase font-normal text-slate-400">(optional)</span>
          </label>
          {customHighlight && (
            <button
              type="button"
              onClick={() => {
                setCustomHighlight("");
                updateDraft(selectedAttrs, "", prevTemplateIndex);
              }}
              className="text-[11px] font-bold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
        <input
          id="custom-highlight"
          type="text"
          value={customHighlight}
          onChange={(e) => {
            const val = e.target.value;
            setCustomHighlight(val);
            updateDraft(selectedAttrs, val, prevTemplateIndex);
          }}
          placeholder="e.g. cold brew coffee, hair spa, Indiranagar branch, Rahul's service..."
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-950 focus:outline-hidden focus:bg-white transition-colors"
        />
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Mentioning specific items or locations boosts Google Maps ranking</span>
          <span className="font-bold text-emerald-600">Local SEO Ready</span>
        </div>
      </div>

      {/* Review Suggestion Card */}
      <div className="rounded-3xl border-2 border-slate-900 bg-white p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-950 flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#d4f04d]" /> Human Review Copy
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
            Top Search Keywords Included
          </span>
        </div>

        <div className="relative">
          <textarea
            rows={5}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setCopied(false);
            }}
            placeholder="Your review draft will appear here..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs sm:text-sm text-slate-900 leading-relaxed focus:border-slate-950 focus:outline-hidden focus:bg-white resize-y"
          />
        </div>

        {/* Suggestion Action Row */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleGenerateAnother}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition-colors cursor-pointer"
          >
            <RotateCw size={13} className="text-slate-500" /> New Suggestion
          </button>
          <span className="text-[11px] text-slate-400 font-medium">
            Personalized for {businessName}
          </span>
        </div>
      </div>

      {/* Primary Action: Combined ⭐ Write a Google Review */}
      <div className="rounded-3xl border-2 border-slate-900 bg-white p-5 shadow-sm space-y-3.5">
        <button
          type="button"
          onClick={handleWriteReview}
          className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-slate-950 px-6 py-4 text-sm sm:text-base font-black text-white shadow-lg hover:bg-slate-900 active:scale-95 transition-all cursor-pointer group"
        >
          <Star size={18} className="fill-[#b8de20] text-[#b8de20] group-hover:scale-110 transition-transform shrink-0" aria-hidden="true" />
          <span>Write a Google Review</span>
          <ExternalLink size={16} className="text-slate-400 group-hover:text-white transition-colors" />
        </button>

        {copyFeedback && (
          <p
            role="alert"
            className={`text-xs font-bold rounded-xl p-3 text-center transition-all animate-fade-in ${
              copied
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-amber-50 text-amber-800 border border-amber-200"
            }`}
          >
            {copyFeedback}
          </p>
        )}

        <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-950">
            <Info size={14} className="text-slate-500 shrink-0" />
            <span>How it works:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1 leading-relaxed text-[11px]">
            <li>Tap <strong>Write a Google Review</strong>.</li>
            <li>Your review is copied automatically & Google opens in a new tab.</li>
            <li>Select 5 stars and paste your review!</li>
          </ol>
        </div>

        {showRedirectNotice && (
          <div className="p-3 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-2xl animate-fade-in">
            Google Reviews opened in a new tab. Paste your copied review and select 5 stars!
          </div>
        )}
      </div>
    </div>
  );
}

function AssistantSkeleton() {
  return (
    <div className="animate-pulse space-y-4 py-4" aria-label="Loading review assistant">
      <div className="h-6 w-32 rounded-full bg-slate-200" />
      <div className="h-44 rounded-3xl bg-white border border-slate-200" />
      <div className="h-32 rounded-3xl bg-white border border-slate-200" />
      <div className="h-48 rounded-3xl bg-white border border-slate-200" />
    </div>
  );
}
