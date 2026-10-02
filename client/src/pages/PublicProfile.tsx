import axios from "axios";
import { ChevronRight } from "lucide-react";
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

// Defensive: only render links with safe protocols
const isSafeHref = (url: string) => /^(https?:|tel:|mailto:)/i.test(url);

// Share one request per slug for a moment, so React StrictMode's double effect
// in development doesn't count a single visit as two scans.
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
    if (state.status === "ok") document.title = state.data.businessName;
    return () => {
      document.title = "LinkQR";
    };
  }, [state]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        {state.status === "loading" && <Skeleton />}

        {state.status === "notfound" && (
          <Message title="Page not available" text="This page doesn't exist or has been switched off." />
        )}
        {state.status === "error" && (
          <Message title="Something went wrong" text="We couldn't load this page. Please try again in a moment." />
        )}

        {state.status === "ok" && <Profile data={state.data} />}

        <p className="mt-10 text-center text-xs text-slate-400">
          Made with <Link to="/" className="underline">LinkQR</Link>
        </p>
      </div>
    </main>
  );
}

function Profile({ data }: { data: PublicProfileData }) {
  const links = data.links.filter((l) => isSafeHref(l.url));
  return (
    <>
      <div className="flex flex-col items-center text-center">
        {data.logoUrl ? (
          <img src={data.logoUrl} alt={`${data.businessName} logo`} crossOrigin="anonymous"
            className="h-24 w-24 rounded-full object-cover shadow-sm ring-4 ring-white" />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 text-3xl font-semibold text-white ring-4 ring-white">
            {data.businessName.charAt(0).toUpperCase()}
          </div>
        )}
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">{data.businessName}</h1>
        {data.category && <p className="mt-1 text-sm text-slate-500">{data.category}</p>}
        {data.description && <p className="mt-3 text-slate-600">{data.description}</p>}
      </div>

      {links.length === 0 ? (
        <p className="mt-8 text-center text-sm text-slate-500">No links yet.</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {links.map((link) => {
            const { Icon } = getLinkType(link.icon);
            const external = /^https?:/i.test(link.url);
            return (
              <li key={link.id}>
                <a
                  href={external ? `${API_BASE}/go/${data.profileId}/${link.id}` : link.url}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex min-h-14 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200 hover:ring-slate-300 active:bg-slate-50"
                >
                  <span className="rounded-lg bg-slate-100 p-2 text-slate-700"><Icon size={20} /></span>
                  <span className="flex-1 font-medium">{link.title}</span>
                  <ChevronRight size={18} className="text-slate-400" />
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function Message({ title, text }: { title: string; text: string }) {
  return (
    <div className="py-16 text-center">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="mt-2 text-slate-600">{text}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse" aria-label="Loading">
      <div className="mx-auto h-24 w-24 rounded-full bg-slate-200" />
      <div className="mx-auto mt-4 h-6 w-48 rounded bg-slate-200" />
      <div className="mx-auto mt-3 h-4 w-64 rounded bg-slate-200" />
      <div className="mt-8 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-14 rounded-2xl bg-slate-200" />
        ))}
      </div>
    </div>
  );
}
