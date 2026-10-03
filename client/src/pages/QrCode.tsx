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
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageError, PageLoading } from "../components/PageState";
import { useToast } from "../components/Toast";
import { useBusiness } from "../hooks/useBusiness";
import { useQr } from "../hooks/useQr";
import { publicUrl } from "../lib/config";
import { downloadPng, downloadSvg, printQr } from "../lib/qr";
import { brandBtn, secondaryBtn } from "../lib/ui";

export default function QrCode() {
  const { business, loading, error, reload } = useBusiness();
  const toast = useToast();
  const url = business ? publicUrl(business.slug) : "";
  const { qr, error: genError } = useQr(url, business?.logoUrl ?? "");

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} onRetry={reload} />;

  if (!business) {
    return (
      <div className="rounded-3xl border border-[#b7dbc4] bg-white p-10 text-center shadow-xs">
        <p className="text-[#43745b]">Please create your business profile before viewing your QR code.</p>
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
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#284737] sm:text-3xl">
          QR Studio & Export
        </h1>
        <p className="text-xs sm:text-sm text-[#70a087] mt-0.5">
          Generate, test, and download production-ready QR codes for digital displays and print media.
        </p>
      </div>

      {isLocal && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs sm:text-sm text-amber-900">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />
          <div className="space-y-1">
            <p className="font-semibold">Development URL Notice</p>
            <p className="text-amber-800">
              This QR code currently points to <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">localhost</code>.
              Smartphones on other networks will only open it once deployed to a public domain or ngrok tunnel.
            </p>
          </div>
        </div>
      )}

      {/* Main Studio Card */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* QR Preview Column */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center rounded-3xl border border-[#b7dbc4]/80 bg-white p-8 shadow-[0_4px_24px_rgba(70,115,89,0.06)]">
          <div className="relative flex h-72 w-72 max-w-full items-center justify-center rounded-2xl border border-[#b7dbc4] bg-white p-4 shadow-md transition-all duration-300 hover:shadow-xl">
            {qr ? (
              <img
                src={qr.pngDataUrl}
                alt={`QR code for ${business.businessName}`}
                className="h-full w-full rounded-xl object-contain"
              />
            ) : genError ? (
              <p className="p-4 text-center text-xs text-red-700 font-medium">{genError}</p>
            ) : (
              <Loader2 className="animate-spin text-[#467359]" size={36} />
            )}
          </div>

          <div className="mt-5 w-full text-center">
            <p className="font-mono text-xs text-[#70a087] truncate max-w-xs mx-auto">{url}</p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e3f7e6] px-2.5 py-0.5 text-[11px] font-semibold text-[#355d48] ring-1 ring-[#b7dbc4]">
                <CheckCircle2 size={12} className="text-[#69bd92]" /> Level-H Error Correction
              </span>
              {qr?.logoIncluded && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#dff6e2] px-2.5 py-0.5 text-[11px] font-semibold text-[#284737] ring-1 ring-[#b7dbc4]">
                  <Sparkles size={12} className="text-[#467359]" /> Brand Badge Embedded
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Download & Actions Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl border border-[#b7dbc4]/80 bg-white p-6 shadow-xs space-y-3">
            <h2 className="font-display font-bold text-base text-[#284737]">
              Export Formats
            </h2>
            <p className="text-xs text-[#70a087]">
              Choose the best format for your print or digital display requirements.
            </p>

            <div className="space-y-2.5 pt-2">
              {/* PNG Download */}
              <button
                disabled={!qr}
                onClick={() => qr && downloadPng(qr.pngDataUrl, `${file}.png`)}
                className="w-full flex items-center justify-between gap-3 rounded-2xl border border-[#b7dbc4] bg-[#f0f3f0]/70 p-3.5 text-left transition-all hover:border-[#69bd92] hover:bg-white hover:shadow-xs cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e3f7e6] text-[#467359] group-hover:bg-[#467359] group-hover:text-white transition-colors">
                    <FileImage size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#284737]">High-Resolution PNG</p>
                    <p className="text-xs text-[#70a087]">Best for digital menus, social posts & flyers (1024×1024px)</p>
                  </div>
                </div>
                <Download size={16} className="text-[#70a087] group-hover:text-[#467359]" />
              </button>

              {/* SVG Download */}
              <button
                disabled={!qr}
                onClick={() => qr && downloadSvg(qr.svg, `${file}.svg`)}
                className="w-full flex items-center justify-between gap-3 rounded-2xl border border-[#b7dbc4] bg-[#f0f3f0]/70 p-3.5 text-left transition-all hover:border-[#69bd92] hover:bg-white hover:shadow-xs cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dff6e2] text-[#355d48] group-hover:bg-[#355d48] group-hover:text-white transition-colors">
                    <FileCode size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#284737]">Vector SVG (Lossless)</p>
                    <p className="text-xs text-[#70a087]">Infinite scaling for window vinyls, billboards & signage</p>
                  </div>
                </div>
                <Download size={16} className="text-[#70a087] group-hover:text-[#355d48]" />
              </button>

              {/* Print action */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  disabled={!qr}
                  onClick={onPrint}
                  className={`${secondaryBtn} !w-full`}
                >
                  <Printer size={15} /> Print Sheet
                </button>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className={`${secondaryBtn} !w-full`}
                >
                  <ExternalLink size={15} /> Test Live Link
                </a>
              </div>
            </div>
          </div>

          {/* Verification & Best Practices */}
          <div className="rounded-3xl border border-[#b7dbc4]/80 bg-white p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#467359] flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#69bd92]" /> Printing Guidelines
            </h3>
            <ul className="space-y-2 text-xs text-[#43745b] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#284737]">•</span>
                <span>Minimum recommended physical size for table tents: <strong>3 × 3 cm (1.2 × 1.2 in)</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#284737]">•</span>
                <span>Ensure high contrast against the surface material (avoid printing on dark glossy glass).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#284737]">•</span>
                <span>You can edit links in the dashboard anytime; this QR will never expire or require reprinting.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
