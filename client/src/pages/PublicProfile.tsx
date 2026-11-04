import axios from "axios";
import { Check, ChevronRight, QrCode, Share2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE, api } from "../lib/api";
import { getLinkType } from "../lib/linkTypes";
import { BrandLogo } from "../components/BrandLogos";
import { QrfolioIconMark } from "../components/QrfolioLogo";
import type { PublicProfileData } from "../lib/types";

type State =
  | { status: "loading" }
  | { status: "ok"; data: PublicProfileData }
  | { status: "notfound" }
  | { status: "error" };

const isSafeHref = (url: string) => /^(https?:|tel:|mailto:)/i.test(url);

const inflight = new Map<string, Promise<PublicProfileData>>();
function fetchProfile(slug: string): Promise<PublicProfileData> {
  let p = inflight.get(slug);
  if (!p) {
    p = api
      .get<{ data: PublicProfileData }>(`/public/${encodeURIComponent(slug)}`)
      .then((res) => res.data.data)
      .finally(() => setTimeout(() => inflight.delete(slug), 1500));
    inflight.set(slug, p);
  }
  return p;
}

export default function PublicProfile() {
  const { slug } = useParams();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!slug) {
      setState({ status: "notfound" });
      return;
    }
    let cancelled = false;
    setState({ status: "loading" });
    fetchProfile(slug)
      .then((data) => !cancelled && setState({ status: "ok", data }))
      .catch((err) => {
        if (cancelled) return;
        setState(axios.isAxiosError(err) && err.response?.status === 404 ? { status: "notfound" } : { status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (state.status === "ok") {
      document.title = `${state.data.businessName} | QrFolio`;
    }
    return () => {
      document.title = "QrFolio - Smart Dynamic QR Portfolios";
    };
  }, [state]);

  return (
    <main className="relative min-h-screen bg-[#fafbfc] px-4 py-8 sm:py-12 flex flex-col items-center justify-between font-sans selection:bg-[#d4f04d] selection:text-slate-950">
      {/* Ambient background soft light glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-96 bg-gradient-to-b from-sky-100/50 via-slate-100/30 to-transparent pointer-events-none blur-3xl -z-10" />
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-[#d4f04d]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md mx-auto flex-1">
        {state.status === "loading" && <Skeleton />}
        {state.status === "notfound" && (
          <Message title="Page Not Available" text="This business page does not exist or has been temporarily deactivated by the owner." />
        )}
        {state.status === "error" && (
          <Message title="Something went wrong" text="Could not load this profile. Please refresh or try again in a few moments." />
        )}
        {state.status === "ok" && <Profile data={state.data} slug={slug ?? ""} />}
      </div>

      {/* Powered by qrfolio footer badge */}
      <footer className="mt-12 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-slate-700 border border-slate-200/90 shadow-2xs hover:bg-[#0e1424] hover:text-white transition-all duration-200 group"
        >
          <div className="flex h-4 w-4 items-center justify-center rounded-sm group-hover:scale-105 transition-transform">
            <QrfolioIconMark size={14} mode="squircle" />
          </div>
          <span>Create your counter stand with <strong className="font-extrabold tracking-tight">qrfolio</strong></span>
        </Link>
      </footer>
    </main>
  );
}

function Profile({ data, slug }: { data: PublicProfileData; slug: string }) {
  const [copied, setCopied] = useState(false);
  const links = data.links.filter((l) => isSafeHref(l.url));

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.businessName,
          text: data.description || `Check out ${data.businessName}`,
          url: window.location.href,
        });
      } catch {
        // Share dismissed
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center animate-fade-in">
      {/* Share Button Floating Top Right */}
      <div className="w-full flex justify-end mb-3">
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          aria-label="Share profile"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-600" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Share2 size={13} />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Brand Logo / Avatar */}
      <div className="relative group">
        <div className="absolute -inset-1.5 rounded-full bg-slate-900/10 blur-sm group-hover:opacity-60 transition duration-300" />
        {data.logoUrl ? (
          <img
            src={data.logoUrl}
            alt={`${data.businessName} logo`}
            crossOrigin="anonymous"
            className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover shadow-lg ring-4 ring-white bg-white"
          />
        ) : (
          <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-slate-950 text-3xl sm:text-4xl font-black text-[#d4f04d] shadow-lg ring-4 ring-white font-display">
            {data.businessName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Profile Info */}
      <h1 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-slate-950 text-center font-display">
        {data.businessName}
      </h1>

      {data.category && (
        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold text-slate-700 border border-slate-200">
          <span className="h-1.5 w-1.5 rounded-full bg-[#d4f04d] animate-pulse" />
          {data.category}
        </span>
      )}

      {data.description && (
        <p className="mt-3.5 max-w-sm text-center text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          {data.description}
        </p>
      )}

      {/* Action Links */}
      {links.length === 0 ? (
        <div className="mt-8 w-full rounded-3xl bg-white p-7 text-center text-xs sm:text-sm text-slate-500 border border-slate-200 shadow-2xs">
          No active links currently published.
        </div>
      ) : (
        <ul className="mt-6 w-full space-y-3">
          {links.map((link) => {
            const external = /^https?:/i.test(link.url);
            const isReviewAssistant = link.icon === "google-reviews" && link.enableReviewAssistant;

            if (isReviewAssistant) {
              return (
                <li key={link.id}>
                  <Link
                    to={`/p/${encodeURIComponent(slug)}/review/${link.id}`}
                    className="group flex min-h-[58px] items-center gap-3.5 rounded-2xl sm:rounded-3xl bg-white px-4 py-3.5 shadow-xs border border-slate-200/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-400 active:translate-y-0 active:bg-slate-50"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 shadow-2xs border border-slate-200 group-hover:scale-105 transition-transform">
                      <BrandLogo name={link.icon} size={22} />
                    </span>
                    <span className="flex-1 font-bold text-slate-950 group-hover:text-slate-900 transition-colors truncate text-sm sm:text-base">
                      {link.title}
                    </span>
                    <span className="rounded-full bg-[#d4f04d]/40 px-2 py-0.5 text-[10px] font-black text-slate-950 shrink-0">
                      5★
                    </span>
                    <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-950 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </li>
              );
            }

            return (
              <li key={link.id}>
                <a
                  href={external ? `${API_BASE}/go/${data.profileId}/${link.id}` : link.url}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex min-h-[58px] items-center gap-3.5 rounded-2xl sm:rounded-3xl bg-white px-4 py-3.5 shadow-xs border border-slate-200/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-400 active:translate-y-0 active:bg-slate-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 shadow-2xs border border-slate-200 group-hover:scale-105 transition-transform">
                    <BrandLogo name={link.icon} size={22} />
                  </span>
                  <span className="flex-1 font-bold text-slate-950 group-hover:text-slate-900 transition-colors truncate text-sm sm:text-base">
                    {link.title}
                  </span>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-950 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Message({ title, text }: { title: string; text: string }) {
  return (
    <div className="py-16 text-center rounded-3xl bg-white p-8 border border-slate-200 shadow-xs">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-[#d4f04d] shadow-sm">
        <QrCode size={32} />
      </div>
      <h1 className="mt-4 text-xl font-black text-slate-950 font-display">{title}</h1>
      <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">{text}</p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition-colors"
      >
        Visit QrFolio Home ↗
      </Link>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse flex flex-col items-center py-6" aria-label="Loading profile">
      <div className="h-24 w-24 rounded-full bg-slate-200" />
      <div className="mt-4 h-6 w-44 rounded-xl bg-slate-200" />
      <div className="mt-2 h-4 w-28 rounded-full bg-slate-200" />
      <div className="mt-3 h-4 w-60 rounded-xl bg-slate-200" />
      <div className="mt-8 w-full space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-2xl bg-white border border-slate-200" />
        ))}
      </div>
    </div>
  );
}
