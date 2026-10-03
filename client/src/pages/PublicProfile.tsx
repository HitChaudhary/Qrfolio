import axios from "axios";
import { Check, ChevronRight, QrCode, Share2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE, api } from "../lib/api";
import { getLinkType } from "../lib/linkTypes";
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
    <main className="relative min-h-screen bg-[#f4f4f4] px-4 py-8 sm:py-12 flex flex-col items-center justify-between selection:bg-[#69bd92]/30 selection:text-[#284737]">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-96 bg-gradient-to-b from-[#dff6e2]/60 via-[#e3f7e6]/30 to-transparent pointer-events-none blur-3xl -z-10" />
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-[#b7dbc4]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md mx-auto flex-1">
        {state.status === "loading" && <Skeleton />}
        {state.status === "notfound" && (
          <Message title="Page Not Available" text="This page does not exist or has been temporarily deactivated by the owner." />
        )}
        {state.status === "error" && (
          <Message title="Something went wrong" text="Could not load this profile. Please refresh or try again in a few moments." />
        )}
        {state.status === "ok" && <Profile data={state.data} />}
      </div>

      {/* Powered by QrFolio footer badge */}
      <footer className="mt-12 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-[#467359] ring-1 ring-[#b7dbc4] shadow-xs hover:bg-[#e3f7e6] hover:text-[#284737] transition-all"
        >
          <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-[#467359] text-white">
            <QrCode size={10} />
          </div>
          <span>Create your own with <strong>QrFolio</strong></span>
        </Link>
      </footer>
    </main>
  );
}

function Profile({ data }: { data: PublicProfileData }) {
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
    <div className="flex flex-col items-center animate-fadeIn">
      {/* Share Button Floating Top Right */}
      <div className="w-full flex justify-end mb-2">
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-xs px-3 py-1.5 text-xs font-medium text-[#467359] ring-1 ring-[#b7dbc4] hover:bg-[#e3f7e6] transition-colors shadow-xs"
          aria-label="Share profile"
        >
          {copied ? (
            <>
              <Check size={13} className="text-[#467359]" />
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
        <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#467359] to-[#69bd92] opacity-30 blur-sm group-hover:opacity-60 transition duration-300" />
        {data.logoUrl ? (
          <img
            src={data.logoUrl}
            alt={`${data.businessName} logo`}
            crossOrigin="anonymous"
            className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover shadow-md ring-4 ring-white bg-white"
          />
        ) : (
          <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#467359] via-[#6dae8c] to-[#69bd92] text-3xl sm:text-4xl font-black text-white shadow-md ring-4 ring-white font-['Outfit']">
            {data.businessName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Profile Info */}
      <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#284737] text-center font-['Outfit']">
        {data.businessName}
      </h1>

      {data.category && (
        <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#dff6e2] px-3 py-0.5 text-xs font-semibold text-[#355d48] ring-1 ring-[#b7dbc4]">
          <Sparkles size={11} /> {data.category}
        </span>
      )}

      {data.description && (
        <p className="mt-3 max-w-sm text-center text-sm text-[#43745b] leading-relaxed">
          {data.description}
        </p>
      )}

      {/* Action Links */}
      {links.length === 0 ? (
        <div className="mt-8 w-full rounded-2xl bg-white/60 p-6 text-center text-sm text-[#70a087] ring-1 ring-[#b7dbc4]">
          No links added yet.
        </div>
      ) : (
        <ul className="mt-6 w-full space-y-3">
          {links.map((link) => {
            const { Icon } = getLinkType(link.icon);
            const external = /^https?:/i.test(link.url);
            return (
              <li key={link.id}>
                <a
                  href={external ? `${API_BASE}/go/${data.profileId}/${link.id}` : link.url}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex min-h-[58px] items-center gap-3.5 rounded-2xl bg-white/95 px-4 py-3 shadow-xs ring-1 ring-[#b7dbc4] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-[#69bd92] active:translate-y-0 active:bg-[#f0f3f0]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e3f7e6] text-[#467359] group-hover:bg-[#69bd92] group-hover:text-white transition-colors duration-200">
                    <Icon size={20} />
                  </span>
                  <span className="flex-1 font-semibold text-[#284737] group-hover:text-[#467359] transition-colors truncate text-sm sm:text-base">
                    {link.title}
                  </span>
                  <ChevronRight size={18} className="text-[#a5afa9] group-hover:text-[#467359] group-hover:translate-x-0.5 transition-transform" />
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
    <div className="py-20 text-center rounded-3xl bg-white p-8 ring-1 ring-[#b7dbc4] shadow-xs">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e3f7e6] text-[#467359]">
        <QrCode size={32} />
      </div>
      <h1 className="mt-4 text-xl font-bold text-[#284737]">{title}</h1>
      <p className="mt-2 text-sm text-[#70a087] max-w-xs mx-auto leading-relaxed">{text}</p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#467359] px-4 py-2 text-xs font-semibold text-white hover:bg-[#355d48] transition-colors"
      >
        Visit QrFolio Home
      </Link>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse flex flex-col items-center py-6" aria-label="Loading profile">
      <div className="h-24 w-24 rounded-full bg-[#b7dbc4]/40" />
      <div className="mt-4 h-6 w-44 rounded-lg bg-[#b7dbc4]/40" />
      <div className="mt-2 h-4 w-28 rounded-full bg-[#b7dbc4]/30" />
      <div className="mt-3 h-4 w-60 rounded-lg bg-[#b7dbc4]/20" />
      <div className="mt-8 w-full space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-2xl bg-white ring-1 ring-[#b7dbc4]/40" />
        ))}
      </div>
    </div>
  );
}
