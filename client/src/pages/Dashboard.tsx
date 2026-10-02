import { CalendarDays, Copy, Download, ExternalLink, ImagePlus, Link2, Loader2, Pencil, Plus, ScanLine, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { PageError, PageLoading } from "../components/PageState";
import StatCard from "../components/StatCard";
import { useToast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { useAnalytics } from "../hooks/useAnalytics";
import { useBusiness } from "../hooks/useBusiness";
import { useQr } from "../hooks/useQr";
import { publicUrl } from "../lib/config";
import { downloadPng } from "../lib/qr";
import { cardClass, primaryBtn, secondaryBtn } from "../lib/ui";

export default function Dashboard() {
  const { user } = useAuth();
  const { business, loading, error, reload } = useBusiness();
  const toast = useToast();
  const url = business ? publicUrl(business.slug) : "";
  const { qr } = useQr(url, business?.logoUrl ?? "");
  const { data: stats } = useAnalytics(business?.id);

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} onRetry={reload} />;

  if (!business) {
    return (
      <div className={`${cardClass} text-center`}>
        <h1 className="text-xl font-semibold">Hi, {user?.name}</h1>
        <p className="mx-auto mt-2 max-w-sm text-slate-600">
          Create your business profile to get a public page and a QR code that never changes.
        </p>
        <Link to="/dashboard/business/new" className={`${primaryBtn} mt-5`}>
          <Plus size={16} /> Create business profile
        </Link>
      </div>
    );
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      toast.show("Link copied");
    } catch {
      toast.show("Could not copy the link", "error");
    }
  }

  return (
    <div className="space-y-4">
      <div className={`${cardClass} flex flex-col gap-5 sm:flex-row`}>
        <div className="flex h-40 w-40 shrink-0 items-center justify-center self-center rounded-xl ring-1 ring-slate-200 sm:self-start">
          {qr ? (
            <img src={qr.pngDataUrl} alt="Your QR code" className="h-full w-full rounded-xl" />
          ) : (
            <Loader2 className="animate-spin text-slate-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
              {business.logoUrl ? (
                <img src={business.logoUrl} alt="" crossOrigin="anonymous" className="h-full w-full object-cover" />
              ) : (
                <ImagePlus size={18} className="text-slate-400" />
              )}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold tracking-tight">{business.businessName}</h1>
              {business.category && <p className="truncate text-sm text-slate-500">{business.category}</p>}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm">
            <span className="min-w-0 flex-1 truncate">{url}</span>
            <button onClick={copy} aria-label="Copy public link" className="rounded p-1 hover:bg-slate-200">
              <Copy size={16} />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/dashboard/links?add=1" className={primaryBtn}><Plus size={16} /> Add link</Link>
            <Link to="/dashboard/business/edit" className={secondaryBtn}><Pencil size={16} /> Edit profile</Link>
            <a href={url} target="_blank" rel="noreferrer" className={secondaryBtn}>
              <ExternalLink size={16} /> View profile
            </a>
            <button disabled={!qr} onClick={() => qr && downloadPng(qr.pngDataUrl, `${business.slug}-qr.png`)}
              className={secondaryBtn}>
              <Download size={16} /> Download QR
            </button>
          </div>
          {!business.isActive && (
            <p className="mt-3 text-sm text-amber-700">Your page is switched off. Visitors will see "page not available".</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard Icon={ScanLine} label="Total scans" value={stats?.totalScans ?? business.scanCount} />
        <StatCard Icon={CalendarDays} label="Today" value={stats?.today ?? "–"} />
        <StatCard Icon={TrendingUp} label="This month" value={stats?.thisMonth ?? "–"} />
        <StatCard Icon={Link2} label="Links" value={business.links.length} />
      </div>
    </div>
  );
}
