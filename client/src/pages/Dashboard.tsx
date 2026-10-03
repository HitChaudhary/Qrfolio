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
  QrCode,
  ScanLine,
  Sparkles,
  TrendingUp,
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
import { downloadPng } from "../lib/qr";
import { brandBtn, secondaryBtn } from "../lib/ui";

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
      <div className="relative overflow-hidden rounded-3xl border border-[#b7dbc4] bg-white p-8 sm:p-12 text-center shadow-lg shadow-[#467359]/5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e3f7e6] text-[#467359] mb-6">
          <QrCode size={32} />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#284737]">
          Welcome to QrFolio, {user?.name}!
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[#43745b] text-sm sm:text-base leading-relaxed">
          Create your business profile to generate your branded dynamic QR code and launch your mobile bio page.
        </p>
        <div className="mt-8 flex justify-center">
          <Link to="/dashboard/business/new" className={`${brandBtn} !px-6 !py-3.5 !text-base`}>
            <Plus size={18} /> Create Your Business Hub
          </Link>
        </div>
      </div>
    );
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.show("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.show("Could not copy the link", "error");
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Welcome & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#284737] sm:text-3xl">
            Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#70a087] mt-0.5">
            Manage your dynamic QR code and monitor real-time scan performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              business.isActive
                ? "bg-[#e3f7e6] text-[#355d48] ring-1 ring-[#b7dbc4]"
                : "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${business.isActive ? "bg-[#69bd92] animate-pulse" : "bg-amber-500"}`} />
            {business.isActive ? "Live & Active" : "Draft Mode"}
          </span>
        </div>
      </div>

      {/* Main QR Code & Profile Card */}
      <div className="relative overflow-hidden rounded-3xl border border-[#b7dbc4]/80 bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(70,115,89,0.06)] ring-1 ring-[#467359]/5">
        {/* Subtle background ambient blur */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#dff6e2]/60 blur-2xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center self-center rounded-2xl border border-[#b7dbc4] bg-[#f0f3f0]/60 p-4 shadow-xs lg:self-stretch">
            <div className="relative flex h-48 w-48 items-center justify-center rounded-xl bg-white p-2 shadow-xs ring-1 ring-[#b7dbc4]">
              {qr ? (
                <img
                  src={qr.pngDataUrl}
                  alt="Your QR code"
                  className="h-full w-full rounded-lg transition-transform duration-200 hover:scale-105"
                />
              ) : (
                <Loader2 className="animate-spin text-[#467359]" size={32} />
              )}
            </div>
            <p className="mt-2.5 font-mono text-[11px] text-[#70a087]">Scan Level H • Dynamic</p>
          </div>

          {/* Business Details & Actions */}
          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-[#f0f3f0] to-[#e3f7e6] ring-1 ring-[#b7dbc4]">
                {business.logoUrl ? (
                  <img
                    src={business.logoUrl}
                    alt=""
                    crossOrigin="anonymous"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus size={22} className="text-[#70a087]" />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="truncate font-display text-xl font-bold tracking-tight text-[#284737] sm:text-2xl">
                  {business.businessName}
                </h2>
                {business.category && (
                  <span className="inline-block truncate rounded-md bg-[#e3f7e6] px-2 py-0.5 text-xs font-semibold text-[#355d48] mt-0.5">
                    {business.category}
                  </span>
                )}
              </div>
            </div>

            {/* Public Link Box */}
            <div className="flex items-center gap-2 rounded-xl border border-[#b7dbc4] bg-[#f0f3f0]/80 p-2 text-xs sm:text-sm">
              <span className="min-w-0 flex-1 truncate font-mono text-[#284737] px-2 select-all">
                {url}
              </span>
              <button
                onClick={copy}
                aria-label="Copy public link"
                className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 font-medium text-[#43745b] shadow-2xs ring-1 ring-[#b7dbc4] hover:bg-[#e3f7e6] hover:text-[#284737] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-[#69bd92]" />
                    <span className="text-[#355d48] font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <Link to="/dashboard/links?add=1" className={brandBtn}>
                <Plus size={16} /> Add New Link
              </Link>
              <Link to="/dashboard/business/edit" className={secondaryBtn}>
                <Pencil size={15} /> Edit Profile
              </Link>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className={secondaryBtn}
              >
                <ExternalLink size={15} /> View Live Page
              </a>
              <button
                disabled={!qr}
                onClick={() => qr && downloadPng(qr.pngDataUrl, `${business.slug}-qr.png`)}
                className={secondaryBtn}
              >
                <Download size={15} /> Download PNG
              </button>
            </div>

            {!business.isActive && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-800">
                ⚠️ Your public page is currently inactive. Visitors who scan your QR will see a "page not available" notice.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-4">
        <StatCard
          Icon={ScanLine}
          label="Total Scans"
          value={stats?.totalScans ?? business.scanCount}
          trend="+100% dynamic"
          trendPositive
        />
        <StatCard Icon={CalendarDays} label="Scans Today" value={stats?.today ?? "0"} />
        <StatCard Icon={TrendingUp} label="Scans This Month" value={stats?.thisMonth ?? "0"} />
        <StatCard Icon={Link2} label="Active Links" value={business.links.length} />
      </div>

      {/* Quick Setup Checklist */}
      <div className="rounded-2xl border border-[#b7dbc4]/80 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-[#467359]" />
          <h3 className="font-bold text-sm text-[#284737] uppercase tracking-wider">
            QrFolio Quick Checklist
          </h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-xl bg-[#f0f3f0] p-3.5">
            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${business.logoUrl ? "bg-[#e3f7e6] text-[#355d48]" : "bg-[#b7dbc4] text-[#284737]"}`}>
              {business.logoUrl ? <Check size={12} /> : "1"}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#284737]">Add Brand Logo</p>
              <p className="text-[11px] text-[#70a087] mt-0.5">
                {business.logoUrl ? "Completed" : "Upload your logo to embed in QR center"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-[#f0f3f0] p-3.5">
            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${business.links.length > 0 ? "bg-[#e3f7e6] text-[#355d48]" : "bg-[#b7dbc4] text-[#284737]"}`}>
              {business.links.length > 0 ? <Check size={12} /> : "2"}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#284737]">Add Social & Menu Links</p>
              <p className="text-[11px] text-[#70a087] mt-0.5">
                {business.links.length > 0 ? `${business.links.length} links added` : "Add Instagram, Maps, Menu, or WhatsApp"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-[#f0f3f0] p-3.5">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#b7dbc4] text-[#284737] text-xs font-bold">
              3
            </div>
            <div>
              <p className="text-xs font-semibold text-[#284737]">Print & Display</p>
              <p className="text-[11px] text-[#70a087] mt-0.5">
                Download SVG or PNG and place on tables & receipts
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
