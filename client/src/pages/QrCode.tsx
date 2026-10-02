import { AlertTriangle, Download, ExternalLink, Loader2, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import { PageError, PageLoading } from "../components/PageState";
import { useToast } from "../components/Toast";
import { useBusiness } from "../hooks/useBusiness";
import { useQr } from "../hooks/useQr";
import { publicUrl } from "../lib/config";
import { downloadPng, downloadSvg, printQr } from "../lib/qr";
import { cardClass, primaryBtn, secondaryBtn } from "../lib/ui";

export default function QrCode() {
  const { business, loading, error, reload } = useBusiness();
  const toast = useToast();
  const url = business ? publicUrl(business.slug) : "";
  const { qr, error: genError } = useQr(url, business?.logoUrl ?? "");

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} onRetry={reload} />;

  if (!business) {
    return (
      <div className={`${cardClass} text-center`}>
        <p className="text-slate-600">Create your business profile to get a QR code.</p>
        <Link to="/dashboard/business/new" className={`${primaryBtn} mt-4`}>Create business profile</Link>
      </div>
    );
  }

  const isLocal = /\/\/(localhost|127\.0\.0\.1)/.test(url);
  const file = `${business.slug}-qr`;

  function onPrint() {
    if (!qr || !business) return;
    if (!printQr(qr.pngDataUrl, business.businessName)) toast.show("Allow pop-ups to print the QR code", "error");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">QR code</h1>

      {isLocal && (
        <div className="flex gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <p>
            This QR points to <strong>localhost</strong>, so a customer's phone can't open it. Set{" "}
            <code>VITE_PUBLIC_URL</code> to your real domain before printing.
          </p>
        </div>
      )}

      <div className={`${cardClass} flex flex-col items-center`}>
        <div className="flex h-72 w-72 max-w-full items-center justify-center rounded-xl ring-1 ring-slate-200">
          {qr ? (
            <img src={qr.pngDataUrl} alt={`QR code for ${business.businessName}`} className="h-full w-full rounded-xl" />
          ) : genError ? (
            <p className="p-4 text-center text-sm text-red-700">{genError}</p>
          ) : (
            <Loader2 className="animate-spin text-slate-500" />
          )}
        </div>
        <p className="mt-4 max-w-full break-all text-center text-sm text-slate-600">{url}</p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button disabled={!qr} onClick={() => qr && downloadPng(qr.pngDataUrl, `${file}.png`)} className={primaryBtn}>
            <Download size={16} /> Download PNG
          </button>
          <button disabled={!qr} onClick={() => qr && downloadSvg(qr.svg, `${file}.svg`)} className={secondaryBtn}>
            <Download size={16} /> Download SVG
          </button>
          <button disabled={!qr} onClick={onPrint} className={secondaryBtn}>
            <Printer size={16} /> Print
          </button>
          <a href={url} target="_blank" rel="noreferrer" className={secondaryBtn}>
            <ExternalLink size={16} /> Test QR
          </a>
        </div>
      </div>

      <div className={`${cardClass} space-y-2 text-sm text-slate-600`}>
        <p>
          This QR only contains your page address. You can change your links any time and the same QR keeps working.
        </p>
        {!business.logoUrl && (
          <p>
            Want your logo in the center? <Link to="/dashboard/business/edit" className="underline">Upload one</Link>.
          </p>
        )}
        {business.logoUrl && qr && !qr.logoIncluded && (
          <p className="text-amber-700">The logo couldn't be loaded, so the QR is shown without it.</p>
        )}
        {!business.isActive && (
          <p className="text-amber-700">Your page is switched off, so scans will show "page not available".</p>
        )}
        <p>Before printing, scan the QR with your phone to make sure it opens your page.</p>
      </div>
    </div>
  );
}
