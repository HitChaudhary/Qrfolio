import axios from "axios";
import {
  ArrowLeft,
  Check,
  Copy,
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
    <main className="relative min-h-screen bg-[#f4f4f4] px-4 py-6 sm:py-10 flex flex-col items-center justify-between selection:bg-[#69bd92]/30 selection:text-[#284737]">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-96 bg-gradient-to-b from-[#dff6e2]/60 via-[#e3f7e6]/30 to-transparent pointer-events-none blur-3xl -z-10" />
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-[#b7dbc4]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md mx-auto flex-1">
        {state.status === "loading" && <AssistantSkeleton />}
        {state.status === "notfound" && (
          <div className="py-20 text-center rounded-3xl bg-white p-8 ring-1 ring-[#b7dbc4] shadow-xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e3f7e6] text-[#467359]">
              <QrCode size={32} />
            </div>
            <h1 className="mt-4 text-xl font-bold text-[#284737]">Review Assistant Not Available</h1>
            <p className="mt-2 text-sm text-[#70a087] max-w-xs mx-auto leading-relaxed">
              {state.message || "This review page is unavailable or has been deactivated."}
            </p>
            <button
              onClick={() => (slug ? navigate(`/p/${slug}`) : navigate("/"))}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#467359] px-4 py-2 text-xs font-semibold text-white hover:bg-[#355d48] transition-colors"
            >
              Back to Business Page
            </button>
          </div>
        )}
        {state.status === "error" && (
          <div className="py-20 text-center rounded-3xl bg-white p-8 ring-1 ring-[#b7dbc4] shadow-xs">
            <h1 className="text-xl font-bold text-[#284737]">Something went wrong</h1>
            <p className="mt-2 text-sm text-[#70a087]">Could not load the review assistant. Please refresh.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#467359] px-4 py-2 text-xs font-semibold text-white"
            >
              Reload Page
            </button>
          </div>
        )}
        {state.status === "ok" && (
          <AssistantView data={state.data} link={state.link} slug={slug ?? ""} />
        )}
      </div>

      {/* Powered by QrFolio footer badge */}
      <footer className="mt-10 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-[#467359] ring-1 ring-[#b7dbc4] shadow-xs hover:bg-[#e3f7e6] hover:text-[#284737] transition-all"
        >
          <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-[#467359] text-white">
            <QrCode size={10} />
          </div>
          <span>Powered by <strong>QrFolio</strong></span>
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
  const [draft, setDraft] = useState<string>("");
  const [prevTemplateIndex, setPrevTemplateIndex] = useState<number>(-1);
  const [copied, setCopied] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string>("");
  const [showRedirectNotice, setShowRedirectNotice] = useState<boolean>(false);

  // Generate initial draft on mount or when category/name changes
  useEffect(() => {
    const { draft: initialDraft, templateIndex } = generateReviewDraft({
      businessName,
      category,
      selectedAttributes: [],
      previousIndex: -1,
    });
    setDraft(initialDraft);
    setPrevTemplateIndex(templateIndex);
  }, [businessName, category]);

  // Handle toggling experience attributes
  function toggleAttribute(attr: string) {
    const updated = selectedAttrs.includes(attr)
      ? selectedAttrs.filter((a) => a !== attr)
      : [...selectedAttrs, attr];

    setSelectedAttrs(updated);

    const { draft: newDraft, templateIndex } = generateReviewDraft({
      businessName,
      category,
      selectedAttributes: updated,
      previousIndex: prevTemplateIndex,
    });
    setDraft(newDraft);
    setPrevTemplateIndex(templateIndex);
    setCopied(false);
  }

  // "Generate Another" button
  function handleGenerateAnother() {
    const { draft: newDraft, templateIndex } = generateReviewDraft({
      businessName,
      category,
      selectedAttributes: selectedAttrs,
      previousIndex: prevTemplateIndex,
    });
    setDraft(newDraft);
    setPrevTemplateIndex(templateIndex);
    setCopied(false);
  }

  // "Copy Review" button
  async function handleCopy() {
    if (!draft.trim()) return;

    let successful = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(draft);
        successful = true;
      } catch {
        successful = false;
      }
    }

    // Fallback if clipboard API failed or insecure context
    if (!successful) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = draft;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        successful = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        successful = false;
      }
    }

    if (successful) {
      setCopied(true);
      setCopyFeedback("Review copied to clipboard!");
      setTimeout(() => {
        setCopied(false);
        setCopyFeedback("");
      }, 3000);
    } else {
      setCopyFeedback("Please select and copy the text manually.");
      setTimeout(() => setCopyFeedback(""), 4000);
    }
  }

  // "Continue to Google Reviews" button
  function handleContinueToGoogle() {
    setShowRedirectNotice(true);
    // Use the tracking redirect URL which records analytics click
    const targetUrl = `${API_BASE}/go/${data.profileId}/${link.id}`;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={`/p/${encodeURIComponent(slug)}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#467359] hover:text-[#284737] transition-colors py-1 px-2.5 rounded-lg hover:bg-white/60"
        >
          <ArrowLeft size={14} /> Back to {businessName}
        </Link>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#467359] bg-[#dff6e2] px-2.5 py-0.5 rounded-full border border-[#b7dbc4]">
          <Star size={11} className="fill-[#467359]" /> Review Assistant
        </span>
      </div>

      {/* Business Header Card */}
      <div className="rounded-2xl border border-[#b7dbc4] bg-white p-5 shadow-xs text-center space-y-2">
        {data.logoUrl ? (
          <img
            src={data.logoUrl}
            alt={businessName}
            crossOrigin="anonymous"
            className="mx-auto h-16 w-16 rounded-full object-cover shadow-sm ring-2 ring-[#e3f7e6]"
          />
        ) : (
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#467359] to-[#69bd92] text-2xl font-black text-white shadow-sm font-['Outfit']">
            {businessName.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h1 className="font-extrabold text-xl sm:text-2xl text-[#284737] tracking-tight font-['Outfit']">
            {businessName}
          </h1>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#467359] bg-[#e3f7e6] px-2.5 py-0.5 rounded-md">
              <Sparkles size={11} /> {category}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#e3f7e6]">
          <h2 className="text-base font-bold text-[#284737]">Help write your review</h2>
          <p className="text-xs text-[#70a087] mt-0.5 max-w-xs mx-auto">
            Choose the options below that genuinely reflect your experience to customize your draft.
          </p>
        </div>
      </div>

      {/* Experience Selection Buttons */}
      <div className="rounded-2xl border border-[#b7dbc4] bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-[#43745b]">
            What best describes your experience?
          </p>
          {selectedAttrs.length > 0 && (
            <button
              onClick={() => {
                setSelectedAttrs([]);
                const { draft: d, templateIndex } = generateReviewDraft({
                  businessName,
                  category,
                  selectedAttributes: [],
                  previousIndex: prevTemplateIndex,
                });
                setDraft(d);
                setPrevTemplateIndex(templateIndex);
              }}
              className="text-[11px] font-medium text-[#70a087] hover:text-red-600 transition-colors"
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
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-[#467359] text-white shadow-xs scale-[1.02]"
                    : "bg-[#f0f3f0] text-[#355d48] hover:bg-[#e3f7e6] border border-[#b7dbc4]/50"
                }`}
              >
                {isSelected && <Check size={12} className="stroke-[3]" />}
                <span>{attr}</span>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-[#70a087] italic">
          {selectedAttrs.length === 0
            ? "Optional: Tap tags above to tailor the suggestion to your visit."
            : `${selectedAttrs.length} selected. Suggestions adapt automatically.`}
        </p>
      </div>

      {/* Review Suggestion Card */}
      <div className="rounded-2xl border-2 border-[#b7dbc4] bg-white p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#284737] flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#467359]" /> Review Suggestion
          </span>
          <span className="text-[11px] text-[#70a087]">You can edit this draft directly</span>
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
            className="w-full rounded-xl border border-[#b7dbc4] bg-[#fbfdfb] p-3 text-sm text-[#284737] leading-relaxed focus:border-[#467359] focus:outline-none focus:ring-2 focus:ring-[#69bd92]/20 resize-y"
          />
        </div>

        {copyFeedback && (
          <p
            role="alert"
            className={`text-xs font-medium rounded-lg p-2.5 text-center transition-all ${
              copied
                ? "bg-[#dff6e2] text-[#284737] border border-[#b7dbc4]"
                : "bg-amber-50 text-amber-800 border border-amber-200"
            }`}
          >
            {copyFeedback}
          </p>
        )}

        {/* Suggestion Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            type="button"
            onClick={handleGenerateAnother}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#b7dbc4] bg-[#f0f3f0] px-4 py-2.5 text-xs font-semibold text-[#284737] hover:bg-[#e3f7e6] transition-colors cursor-pointer"
          >
            <RotateCw size={14} className="text-[#467359]" /> Generate Another
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer shadow-xs ${
              copied
                ? "bg-[#284737] text-white"
                : "bg-[#e3f7e6] text-[#284737] hover:bg-[#dff6e2] border border-[#b7dbc4]"
            }`}
          >
            {copied ? (
              <>
                <Check size={14} className="text-[#69bd92]" /> Copied!
              </>
            ) : (
              <>
                <Copy size={14} className="text-[#467359]" /> Copy Review
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Action: Continue to Google Reviews */}
      <div className="rounded-2xl border border-[#b7dbc4] bg-white p-5 shadow-xs space-y-3">
        <button
          type="button"
          onClick={handleContinueToGoogle}
          className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#467359] px-5 py-3.5 text-sm sm:text-base font-bold text-white shadow-md hover:bg-[#355d48] active:translate-y-0.5 transition-all cursor-pointer"
        >
          <Star size={18} className="fill-white" />
          <span>Continue to Google Reviews</span>
          <ExternalLink size={16} />
        </button>

        {/* Step-by-step guidance reminder */}
        <div className="rounded-xl bg-[#e3f7e6]/50 p-3.5 border border-[#b7dbc4]/50 text-xs text-[#355d48] space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-[#284737]">
            <Info size={14} className="text-[#467359] shrink-0" />
            <span>How it works:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-[#43745b] pl-1 leading-relaxed">
            <li>
              Click <strong>Copy Review</strong> above to copy your draft.
            </li>
            <li>
              Click <strong>Continue to Google Reviews</strong> to open Google.
            </li>
            <li>
              Paste into Google&apos;s review box, adjust as needed, and submit!
            </li>
          </ol>
          <p className="pt-1 text-[11px] text-[#70a087] border-t border-[#b7dbc4]/30">
            Reminder: QRFolio does not automatically submit reviews or collect personal feedback. You remain in complete control.
          </p>
        </div>

        {showRedirectNotice && (
          <div className="p-3 rounded-xl bg-[#dff6e2] text-xs text-[#284737] border border-[#b7dbc4] animate-fadeIn text-center space-y-1">
            <p className="font-semibold">Opening Google Reviews in a new tab...</p>
            <p className="text-[11px] text-[#43745b]">
              If the page did not open,{" "}
              <a
                href={`${API_BASE}/go/${data.profileId}/${link.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold text-[#284737]"
              >
                click here to proceed to Google Reviews
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function AssistantSkeleton() {
  return (
    <div className="animate-pulse space-y-5 py-4">
      <div className="h-4 w-32 bg-[#b7dbc4]/40 rounded-lg" />
      <div className="rounded-2xl bg-white p-6 border border-[#b7dbc4]/40 space-y-3 flex flex-col items-center">
        <div className="h-16 w-16 rounded-full bg-[#b7dbc4]/40" />
        <div className="h-6 w-44 rounded-lg bg-[#b7dbc4]/40" />
        <div className="h-4 w-28 rounded-md bg-[#b7dbc4]/30" />
      </div>
      <div className="rounded-2xl bg-white p-5 border border-[#b7dbc4]/40 space-y-3">
        <div className="h-4 w-48 rounded bg-[#b7dbc4]/30" />
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-24 rounded-xl bg-[#b7dbc4]/30" />
          ))}
        </div>
      </div>
      <div className="rounded-2xl bg-white p-5 border border-[#b7dbc4]/40 space-y-3">
        <div className="h-28 rounded-xl bg-[#b7dbc4]/20" />
        <div className="h-10 rounded-xl bg-[#b7dbc4]/30" />
      </div>
    </div>
  );
}
