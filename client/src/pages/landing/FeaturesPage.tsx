import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Lock,
  Zap,
} from "lucide-react";
import FolderFloat from "../../components/reactbits/FolderFloat";

const ARCHITECTURE_SPECS = [
  {
    feature: "QR Code Format",
    standard: "Static URL (Hardcoded pixels)",
    qrfolio: "Smart Dynamic Proxy Routing (Permanent Print)",
    highlight: true,
  },
  {
    feature: "Link Updating",
    standard: "Requires Complete Reprinting ($$$)",
    qrfolio: "Instant 0ms Mobile Dashboard Update (₹0 cost)",
    highlight: true,
  },
  {
    feature: "Error Correction",
    standard: "Level-L (7% max damage)",
    qrfolio: "Level-H Reed-Solomon (30% scratch & chai tolerance)",
    highlight: true,
  },
  {
    feature: "Center Logo Embedding",
    standard: "Obstructs QR scan data",
    qrfolio: "Auto-Contrast Halo Shield with Level-H guarantee",
    highlight: false,
  },
  {
    feature: "Export Resolutions",
    standard: "Low-res 72 DPI raster PNG",
    qrfolio: "Infinite Vector SVG & 4K Ultra-Sharp Print PNG",
    highlight: false,
  },
  {
    feature: "Analytics & Cookies",
    standard: "Invasive tracking cookies & IP logs",
    qrfolio: "100% Zero-PII GDPR/CCPA Cookie-Free",
    highlight: true,
  },
  {
    feature: "Mobile Bio Load Time",
    standard: "1.8s - 3.5s heavy web page",
    qrfolio: "< 240ms ultra-optimized camera scan render",
    highlight: false,
  },
];

export default function FeaturesPage() {
  return (
    <div className="py-12 sm:py-20 bg-slate-50 font-sans selection:bg-[#d4f04d] selection:text-slate-950">
      {/* Page Header */}
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-800 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-[#d4f04d] animate-pulse" />
          <span>Complete Architectural Deep-Dive</span>
        </div>
        <h1 className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-tight">
          Engineered for Scannability & ₹0 Reprinting Cost
        </h1>
        <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Explore the interactive Folder Float engine below to see how our dynamic proxy router and Level-H error correction revolutionize physical QR counter stands across India.
        </p>
      </div>

      {/* Centerpiece: React Bits Folder Float Micro-Interaction */}
      <div className="mt-10">
        <FolderFloat />
      </div>

      {/* Feature Deep Dive Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-20">
        <div className="mx-auto max-w-3xl text-center mb-14">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            • PERFORMANCE CORE
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Why Free Static QR Codes Fail (And How QrFolio Solves It)
          </h2>
          <p className="mt-3 text-slate-600 text-xs sm:text-base leading-relaxed">
            Standard online QR generators embed frozen URLs that break permanently the moment you change your menu, phone number, or Instagram handle.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-lg transition-all space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-[#d4f04d] shadow-sm">
              <RefreshCw size={22} />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-950">Dynamic Smart Proxy Routing</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              When someone scans your physical counter stand, our high-speed edge proxy determines the latest destination in under 5 milliseconds. Swap your daytime lunch menu for evening specials with one tap.
            </p>
            <div className="pt-2 text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-[#d4f04d]" />
              <span>₹0 reprint costs forever</span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-lg transition-all space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-sm">
              <ShieldCheck size={22} />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-950">Level-H Reed-Solomon Shield</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Standard QR codes only use Level-L (7% error correction). QrFolio generates codes with Level-H (High, 30% redundancy), allowing physical stands to resist spilled chai, grease, or surface scratches without failing to scan.
            </p>
            <div className="pt-2 text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-sky-500" />
              <span>Tested across 50+ camera models</span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-lg transition-all space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d4f04d] text-slate-950 shadow-sm">
              <Lock size={22} />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-950">Zero-PII Privacy Protection</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We never drop tracking cookies, fingerprint hardware, or log customer IP addresses. You get aggregate scan volume and link click velocity while remaining 100% compliant with privacy standards out of the box.
            </p>
            <div className="pt-2 text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-slate-950" />
              <span>No annoying cookie consent popups</span>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications Table */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 mt-24">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-3">
            <div>
              <h3 className="font-display text-2xl font-black text-slate-950">
                Technical Benchmark & Architecture
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Comparing standard static QR generators vs QrFolio Industrial Dynamic Engine
              </p>
            </div>
            <span className="self-start sm:self-auto rounded-full bg-slate-950 px-3.5 py-1 text-xs font-black uppercase text-[#d4f04d]">
              BENCHMARK 2026
            </span>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Capability</th>
                  <th className="py-3 px-4">Static QR Generators</th>
                  <th className="py-3 px-4 text-slate-950 font-black">QrFolio Hub</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {ARCHITECTURE_SPECS.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.feature}</td>
                    <td className="py-3.5 px-4 text-slate-400 line-through decoration-rose-500/60 font-medium">
                      {row.standard}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-950 flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                      <span>{row.qrfolio}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-20 text-center">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-14 shadow-xl">
          <h3 className="font-display text-2xl sm:text-4xl font-black text-slate-950">
            Ready to Build Your Permanent Smart QR?
          </h3>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto text-xs sm:text-base leading-relaxed">
            Create your branded hub in 3 minutes. Print once on your counter stands, table tents, and cards — update anytime with ₹0 reprint cost.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full bg-[#d4f04d] hover:bg-[#c4e436] px-7 py-3 text-xs font-black text-slate-950 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>Claim Free Dynamic QR ↗</span>
            </Link>
            <Link
              to="/solutions"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <span>View Industry Solutions</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
