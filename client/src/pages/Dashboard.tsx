import {
  CalendarDays,
  Check,
  Copy,
  Download,
  ExternalLink,
  ImagePlus,
  Link2,
  Loader2,
  Pencil,
  Plus,
  Printer,
  QrCode,
  ScanLine,
  Share2,
  Sparkles,
  Store,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PageError, PageLoading } from "../components/PageState";
import StatCard from "../components/StatCard";
import { useToast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { useAnalytics } from "../hooks/useAnalytics";
import { useBusiness } from "../hooks/useBusiness";
import { useQr } from "../hooks/useQr";
import { publicUrl } from "../lib/config";
import { downloadPng, printQr } from "../lib/qr";
import { brandBtn, secondaryBtn } from "../lib/ui";
import { BrandLogo } from "../components/BrandLogos";

export default function Dashboard() {
  const { user } = useAuth();
  const { business, loading, error, reload } = useBusiness();
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const url = business ? publicUrl(business.slug) : "";
  const { qr } = useQr(url, business?.logoUrl ?? "");
  const { data: stats } = useAnalytics(business?.id);

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} onRetry={reload} />;

  if (!business) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-14 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-[#d4f04d] mb-6 shadow-md">
          <QrCode size={34} />
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Welcome to your Merchant Studio, {user?.name}!
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-slate-600 text-sm sm:text-base leading-relaxed">
          Create your business profile to generate your permanent dynamic QR standee and launch your fast mobile food menu, WhatsApp ordering, and Google reviews page.
        </p>
        <div className="mt-8 flex justify-center">
          <Link to="/dashboard/business/new" className={`${brandBtn} !px-7 !py-3.5 !text-sm`}>
            <Plus size={18} /> Create Your Shop Hub ↗
          </Link>
        </div>
      </div>
    );
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.show("Customer link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.show("Could not copy the link", "error");
    }
  }

  function handlePrint() {
    if (!qr || !business) return;
    printQr(qr.pngDataUrl, business.businessName);
  }

  const activeLinksCount = business.links.length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Welcome & Store Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              {business.businessName}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-bold ${
                business.isActive
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${business.isActive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              {business.isActive ? "Live on Counter" : "Draft Mode"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Permanent Smart Dynamic QR Code • Print once, update links anytime with ₹0 reprint cost.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className={`${secondaryBtn} !py-2 !px-4 text-xs font-bold`}
          >
            <ExternalLink size={14} /> Preview Customer Bio
          </a>
          <Link to="/dashboard/links?add=1" className={`${brandBtn} !py-2 !px-4 text-xs font-black`}>
            <Plus size={14} /> Add New Link
          </Link>
        </div>
      </div>

      {/* Main Merchant Station Card (Hero Card for Local Shop Owner) */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        {/* Soft background ambient glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#d4f04d]/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center self-center rounded-2xl border border-slate-200/90 bg-slate-50 p-4 shadow-2xs lg:self-stretch">
            <div className="relative flex h-48 w-48 items-center justify-center rounded-xl bg-white p-2.5 shadow-sm border border-slate-200">
              {qr ? (
                <img
                  src={qr.pngDataUrl}
                  alt="Your Dynamic QR code"
                  className="h-full w-full rounded-lg transition-transform duration-200 hover:scale-105"
                />
              ) : (
                <Loader2 className="animate-spin text-slate-900" size={32} />
              )}
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4f04d]" />
              <span>Level-H • Spill & Chai Proof</span>
            </div>
          </div>

          {/* Business Details & Action Suite */}
          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                {business.logoUrl ? (
                  <img
                    src={business.logoUrl}
                    alt=""
                    crossOrigin="anonymous"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Store size={24} className="text-slate-400" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate font-display text-xl sm:text-2xl font-black tracking-tight text-slate-950">
                    {business.businessName}
                  </h2>
                  <Link
                    to="/dashboard/business/edit"
                    title="Edit profile"
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    <Pencil size={15} />
                  </Link>
                </div>
                {business.category && (
                  <span className="inline-block truncate rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold text-slate-700 mt-1">
                    {business.category}
                  </span>
                )}
              </div>
            </div>

            {/* Public Link Box */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-3.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Permanent Counter URL
              </span>
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="truncate font-mono text-xs sm:text-sm font-semibold text-slate-900">
                  {url}
                </p>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={copy}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Copy public link"
                  >
                    {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Open in new tab"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons for Counter Materials */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                disabled={!qr}
                onClick={() => qr && downloadPng(qr.pngDataUrl, `${business.slug}-qrfolio.png`)}
                className={`${brandBtn} !py-2.5 !px-4 text-xs font-black`}
              >
                <Download size={14} /> Download 4K QR Standee
              </button>
              <button
                disabled={!qr}
                onClick={handlePrint}
                className={`${secondaryBtn} !py-2.5 !px-4 text-xs font-bold`}
              >
                <Printer size={14} /> Print Table Insert
              </button>
              <Link to="/dashboard/qr" className={`${secondaryBtn} !py-2.5 !px-4 text-xs font-bold`}>
                <Sparkles size={14} /> Vector SVG Studio ↗
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards: Scans & Conversions */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          Icon={ScanLine}
          label="Total Scans"
          value={stats?.totalScans ?? 0}
          trend="Permanent Counter QR"
          trendPositive={true}
        />
        <StatCard
          Icon={CalendarDays}
          label="Scans Today"
          value={stats?.today ?? 0}
          trend="Live Scan Counter"
          trendPositive={true}
        />
        <StatCard
          Icon={TrendingUp}
          label="Taps & Conversions"
          value={stats?.totalClicks ?? 0}
          trend={`${stats && stats.totalScans > 0 ? Math.round((stats.totalClicks / stats.totalScans) * 100) : 0}% tap rate`}
          trendPositive={true}
        />
        <StatCard
          Icon={Link2}
          label="Active Destinations"
          value={activeLinksCount}
          trend="0s Instant Mobile Update"
          trendPositive={true}
        />
      </div>

      {/* Store Quick Management Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active Customer Destinations (2 Cols) */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-display font-black text-lg text-slate-950">
                Customer Scan Destinations
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                These buttons appear on your customers' phones when they point their camera at your counter stand.
              </p>
            </div>
            <Link to="/dashboard/links" className="text-xs font-black text-slate-950 hover:underline">
              Manage All ({business.links.length}) ↗
            </Link>
          </div>

          {business.links.length === 0 ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                <Link2 size={22} />
              </div>
              <p className="text-sm font-bold text-slate-900">No links added yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Add your Google Review modal, WhatsApp ordering number, Instagram, or daily food menu.
              </p>
              <Link to="/dashboard/links?add=1" className={`${brandBtn} mt-4`}>
                <Plus size={14} /> Add First Link
              </Link>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {business.links.slice(0, 5).map((l) => (
                <li
                  key={l.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <BrandLogo name={l.icon} size={20} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs sm:text-sm font-bold text-slate-950">{l.title}</p>
                      <p className="truncate text-[11px] text-slate-500 font-mono">{l.url}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {l.icon === "google-reviews" && l.enableReviewAssistant && (
                      <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#d4f04d]/40 px-2.5 py-0.5 text-[10px] font-black text-slate-950">
                        <Sparkles size={11} /> 5★ Booster
                      </span>
                    )}
                    <span className="rounded-xl bg-white px-2.5 py-1 text-xs font-bold text-slate-800 border border-slate-200 shadow-2xs tabular-nums">
                      {stats?.links.find((s) => s.id === l.id)?.clicks ?? 0} taps
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Counter QR Stand Tips & Guide */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-950">
            <Zap size={18} className="text-amber-500" />
            <h3 className="font-display font-black text-base">Counter Placement Tips</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Local shop owners in Gujarat & India report up to <strong>+42% more Google reviews</strong> by placing an acrylic standee next to the UPI payment QR.
          </p>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="rounded-2xl bg-slate-50 p-3 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase text-slate-500">Billing Counter Stand</span>
              <p className="text-xs text-slate-800 font-semibold mt-0.5">
                Customers scan while waiting for their bill or order parcel.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase text-slate-500">Dining Table Tent</span>
              <p className="text-xs text-slate-800 font-semibold mt-0.5">
                Fast digital menu & guest WiFi connection with zero paper reprint cost.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/dashboard/qr"
              className="flex items-center justify-between rounded-2xl bg-slate-950 p-3.5 text-white hover:bg-slate-900 transition-colors shadow-sm"
            >
              <div>
                <span className="text-xs font-bold block">Open QR Studio</span>
                <span className="text-[10px] text-slate-400">Download SVG, print templates</span>
              </div>
              <span className="text-xs font-black text-[#d4f04d]">Export ↗</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
