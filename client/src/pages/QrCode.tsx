import {
  AlertTriangle,
  CheckCircle2,
  Download,
  ExternalLink,
  FileCode,
  FileImage,
  Loader2,
  Printer,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageError, PageLoading } from "../components/PageState";
import { useToast } from "../components/Toast";
import { useBusiness } from "../hooks/useBusiness";
import { useQr } from "../hooks/useQr";
import { publicUrl } from "../lib/config";
import { downloadPng, downloadSvg, printQr } from "../lib/qr";
import { brandBtn, secondaryBtn } from "../lib/ui";
import { QrfolioIconMark } from "../components/QrfolioLogo";

export default function QrCode() {
  const { business, loading, error, reload } = useBusiness();
  const toast = useToast();
  const url = business ? publicUrl(business.slug) : "";
  const { qr, error: genError } = useQr(url, business?.logoUrl || "/logo-mark.png");

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} onRetry={reload} />;

  if (!business) {
    return (
      <div className="rounded-3xl border border-slate-200/90 bg-white p-10 text-center shadow-xs">
        <p className="text-slate-600">Please create your business profile before viewing your QR code.</p>
        <Link to="/dashboard/business/new" className={`${brandBtn} mt-5`}>
          Create Business Profile
        </Link>
      </div>
    );
  }

  const isLocal = /\/\/(localhost|127\.0\.0\.1)/.test(url);
  const file = `${business.slug}-qrfolio`;

  function onPrint() {
    if (!qr || !business) return;
    if (!printQr(qr.pngDataUrl, business.businessName)) {
      toast.show("Please allow pop-ups in your browser to print the QR code", "error");
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
          QR Studio & Export
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Generate, customize, and export production-ready vector SVG and 4K PNG formats for acrylic table tents, stickers, and counter cards.
        </p>
      </div>

      {isLocal && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs sm:text-sm text-amber-900">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />
          <div className="space-y-1">
            <p className="font-bold">Development Environment Notice</p>
            <p className="text-amber-800 text-xs leading-relaxed">
              This code currently routes to <code className="font-mono bg-amber-100 px-1 py-0.5 rounded font-bold">localhost</code>.
              Smartphone cameras scan it instantly once live on your public production domain.
            </p>
          </div>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* QR Preview Column (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xs">
          <div className="relative flex h-72 w-72 max-w-full items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-inner">
            {qr ? (
              <div className="relative h-full w-full rounded-2xl bg-white p-3 shadow-md border border-slate-200/80">
                <img
                  src={qr.pngDataUrl}
                  alt={`QR code for ${business.businessName}`}
                  className="h-full w-full rounded-xl object-contain"
                />
              </div>
            ) : genError ? (
              <p className="p-4 text-center text-xs text-rose-700 font-bold">{genError}</p>
            ) : (
              <Loader2 className="animate-spin text-slate-950" size={36} />
            )}
          </div>

          <div className="mt-6 w-full text-center">
            <p className="font-mono text-xs text-slate-500 truncate max-w-xs mx-auto font-medium">
              {url}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                <CheckCircle2 size={13} className="text-emerald-600" /> Level-H Reed-Solomon (30% Redundancy)
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-800 border border-slate-200">
                <ShieldCheck size={13} className="text-slate-600" /> Chai & Spill Proof
              </span>
            </div>
          </div>
        </div>

        {/* Download & Export Formats Column (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-3">
            <h2 className="font-display font-black text-lg text-slate-950">
              Commercial Print & Digital Formats
            </h2>
            <p className="text-xs text-slate-500">
              Permanent printed code. Update your daily food specials or WhatsApp number anytime from your phone without paying ₹1 to reprint.
            </p>

            <div className="space-y-3 pt-2">
              {/* PNG Download */}
              <button
                disabled={!qr}
                onClick={() => qr && downloadPng(qr.pngDataUrl, `${file}.png`)}
                className="w-full flex items-center justify-between gap-3.5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-left transition-all hover:border-slate-950 hover:bg-white hover:shadow-md cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-[#d4f04d] group-hover:scale-105 transition-transform">
                    <FileImage size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-950">High-Resolution 4K PNG</p>
                    <p className="text-xs text-slate-500">Ideal for digital menus, social posts, counter displays (1024×1024px)</p>
                  </div>
                </div>
                <Download size={18} className="text-slate-400 group-hover:text-slate-950" />
              </button>

              {/* SVG Download */}
              <button
                disabled={!qr}
                onClick={() => qr && downloadSvg(qr.svg, `${file}.svg`)}
                className="w-full flex items-center justify-between gap-3.5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-left transition-all hover:border-slate-950 hover:bg-white hover:shadow-md cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-white group-hover:scale-105 transition-transform">
                    <FileCode size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-950">Infinite Vector SVG</p>
                    <p className="text-xs text-slate-500">Essential for vinyl sign cutters, laser engravers, billboard acrylic stands</p>
                  </div>
                </div>
                <Download size={18} className="text-slate-400 group-hover:text-slate-950" />
              </button>

              {/* Instant Print Button */}
              <button
                disabled={!qr}
                onClick={onPrint}
                className="w-full flex items-center justify-between gap-3.5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-left transition-all hover:border-slate-950 hover:bg-white hover:shadow-md cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#b8de20] text-[#0e1424] group-hover:scale-105 transition-transform">
                    <Printer size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-950">Instant Table Tent Print Sheet</p>
                    <p className="text-xs text-slate-500">Pre-formatted print layout with your shop name & scan instructions</p>
                  </div>
                </div>
                <ExternalLink size={18} className="text-slate-400 group-hover:text-slate-950" />
              </button>

              {/* Standee Template Download */}
              <a
                href="/qr-standee.jpg"
                download={`${business.slug}-acrylic-standee.jpg`}
                className="w-full flex items-center justify-between gap-3.5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-left transition-all hover:border-slate-950 hover:bg-white hover:shadow-md cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0e1424] text-[#b8de20] group-hover:scale-105 transition-transform">
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-950">Official Acrylic Counter Standee</p>
                    <p className="text-xs text-slate-500">Full 300 DPI "Scan to see everything" acrylic stand template</p>
                  </div>
                </div>
                <Download size={18} className="text-slate-400 group-hover:text-slate-950" />
              </a>
            </div>
          </div>

          {/* 10:1 Scanning Optical Rule Box */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
              <Zap size={14} className="text-[#d4f04d]" />
              <span>Optical Scanning Formula for Print</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standard smartphone cameras scan with a <strong>10:1 distance ratio</strong>. For dining tables scanned from 30 cm away, print at least 3×3 cm. For counter standees scanned from 60 cm away, print at least 6×6 cm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
