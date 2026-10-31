import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  QrCode,
  ScanLine,
  CheckCircle2,
  Store,
  Ruler,
  Printer,
  Zap,
} from "lucide-react";

export default function HowItWorksPage() {
  const [distanceCm, setDistanceCm] = useState(60);

  // Optical formula for reliable smartphone QR scanning:
  // Recommended QR size = Distance / 10
  const recommendedSizeCm = (distanceCm / 10).toFixed(1);
  const recommendedSizeInches = (distanceCm / 25.4).toFixed(1);

  return (
    <div className="py-12 sm:py-20 bg-slate-50 font-sans selection:bg-[#d4f04d] selection:text-slate-950">
      {/* Header */}
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-800 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-[#d4f04d] animate-pulse" />
          <span>Frictionless 3-Minute Setup</span>
        </div>
        <h1 className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-tight">
          From Registration to Counter Stand in 3 Minutes
        </h1>
        <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          See the simple 3-step process of how QrFolio lets you design a permanent dynamic QR standee, print it once for your counter or table, and control all customer destinations from your phone forever.
        </p>
      </div>

      {/* 3 Steps Timeline Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-16">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Step 1 */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xs hover:shadow-lg transition-all relative">
            <span className="font-display text-6xl font-black text-slate-100 absolute right-6 top-6 select-none">
              01
            </span>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-[#d4f04d] shadow-sm">
              <Store size={22} />
            </div>
            <h3 className="mt-6 font-display text-xl font-black text-slate-950">Create Your Branded Hub</h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Reserve your custom vanity slug (e.g. <code>qrfolio.io/p/nilkanth-cafe</code>). Add your shop logo, Google review link, WhatsApp counter chat, and digital food menu.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#d4f04d] fill-slate-950" />
                <span>Instant live mobile preview</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#d4f04d] fill-slate-950" />
                <span>Drag-and-drop link reordering</span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xs hover:shadow-lg transition-all relative">
            <span className="font-display text-6xl font-black text-slate-100 absolute right-6 top-6 select-none">
              02
            </span>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-sm">
              <QrCode size={22} />
            </div>
            <h3 className="mt-6 font-display text-xl font-black text-slate-950">Generate Vector QR with Badge</h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our generator embeds your center logo with an automated contrast shield and Level-H Reed-Solomon correction that scans even when dirty or wet.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-sky-500" />
                <span>Level-H (30% scratch tolerance)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-sky-500" />
                <span>Infinite resolution SVG & 4K PNG</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xs hover:shadow-lg transition-all relative">
            <span className="font-display text-6xl font-black text-slate-100 absolute right-6 top-6 select-none">
              03
            </span>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d4f04d] text-slate-950 shadow-sm">
              <ScanLine size={22} />
            </div>
            <h3 className="mt-6 font-display text-xl font-black text-slate-950">Print Once, Update Forever</h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Print your QR once on acrylic stands, table tents, or billing counters. Update destinations anytime from your phone without spending a single rupee on reprints.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-slate-950" />
                <span>0s instant update propagation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-slate-950" />
                <span>Real-time counter scan tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Optical Scan Distance & Print Size Calculator */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 mt-24">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-[#d4f04d]">
              <Ruler size={22} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                • OPTICAL PRINT GUIDELINE
              </span>
              <h3 className="font-display text-2xl font-black text-slate-950">
                QR Print Sizing Calculator for Counters & Tables
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
            Smartphone camera lenses follow the optical <strong>10:1 scanning ratio rule</strong>: To scan reliably at a distance of 100 cm, the QR code matrix should be at least 10 cm wide. Use our interactive slider below:
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Customer Distance from QR Code:</span>
                <span className="text-slate-950 font-mono text-sm font-black">{distanceCm} cm (~{recommendedSizeInches} in)</span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={distanceCm}
                onChange={(e) => setDistanceCm(Number(e.target.value))}
                className="w-full accent-slate-950"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>Table (20-40 cm)</span>
                <span>Counter (50-80 cm)</span>
                <span>Window (150-250 cm)</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 flex flex-col justify-between text-white shadow-xl">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#d4f04d]">
                  Recommended Minimum Print Size
                </span>
                <p className="font-display text-4xl sm:text-5xl font-black text-white mt-1">
                  {recommendedSizeCm} × {recommendedSizeCm} cm
                </p>
                <span className="text-xs text-slate-300 mt-2 block">
                  Ensures 100% instant 240ms camera autofocus on both iPhones and budget Android devices.
                </span>
              </div>

              <Link
                to="/register"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#d4f04d] hover:bg-[#c4e436] px-5 py-3 text-xs font-black text-slate-950 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Generate Your Print-Ready Code ↗</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
