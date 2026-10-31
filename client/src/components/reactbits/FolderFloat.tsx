import { useState } from "react";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Smartphone,
  BarChart3,
  RefreshCw,
  QrCode,
  Layers,
  ArrowUpRight,
  Printer,
  Star,
  FolderOpen,
  Folder as FolderClosed,
  MousePointerClick,
  X,
} from "lucide-react";

export interface FloatingNote {
  id: string;
  badge: string;
  title: string;
  summary: string;
  detail: string;
  metric: string;
  metricLabel: string;
  icon: typeof Zap;
  color: string;
  desktopOffset: { x: number; y: number; rotate: number };
  animationClass: string;
}

const FEATURE_NOTES: FloatingNote[] = [
  {
    id: "dynamic-routing",
    badge: "Dynamic Core",
    title: "Instant Smart Routing",
    summary: "Update your target links in seconds without ever reprinting.",
    detail: "Never waste money on reprint runs. Change your menu, website, or campaign URL anytime from your mobile dashboard. Your printed QR code stays 100% active forever.",
    metric: "$0",
    metricLabel: "Reprint Costs",
    icon: RefreshCw,
    color: "from-emerald-500 to-teal-500",
    desktopOffset: { x: -280, y: -160, rotate: -8 },
    animationClass: "animate-note-float-1",
  },
  {
    id: "level-h-qr",
    badge: "Industrial Scan",
    title: "Level-H Correction",
    summary: "Scans reliably even with up to 30% surface scratches or water spills.",
    detail: "Industrial-grade Reed-Solomon Level-H correction ensures instant camera recognition even when printed on wet tabletop stickers, weathered signage, or textured cards.",
    metric: "30%",
    metricLabel: "Damage Tolerance",
    icon: ShieldCheck,
    color: "from-cyan-500 to-blue-500",
    desktopOffset: { x: 0, y: -225, rotate: 1 },
    animationClass: "animate-note-float-2",
  },
  {
    id: "brand-badging",
    badge: "Visual Identity",
    title: "Center Logo Badging",
    summary: "Embed your custom business lettermark or uploaded logo right in center.",
    detail: "An automated halo shield maintains scan contrast so your brand emblem looks custom-designed by a design studio while scanning effortlessly on any smartphone.",
    metric: "Auto",
    metricLabel: "Halo Contrast",
    icon: QrCode,
    color: "from-teal-500 to-emerald-500",
    desktopOffset: { x: 280, y: -160, rotate: 8 },
    animationClass: "animate-note-float-3",
  },
  {
    id: "mobile-bio",
    badge: "Fast Performance",
    title: "Sub-300ms Mobile Bio",
    summary: "Lightning-fast, thumb-friendly link tree designed for phone cameras.",
    detail: "Optimized mobile web architecture renders instantly over cellular networks. Clean action cards, one-tap directions, and zero heavy bloat.",
    metric: "240ms",
    metricLabel: "Render Speed",
    icon: Smartphone,
    color: "from-emerald-500 to-cyan-500",
    desktopOffset: { x: -330, y: 15, rotate: -5 },
    animationClass: "animate-note-float-4",
  },
  {
    id: "zero-pii",
    badge: "100% Private",
    title: "Zero-PII Analytics",
    summary: "Track total scans and link clicks without storing invasive cookies.",
    detail: "GDPR, CCPA, and ePrivacy safe out of the box. Gain accurate traffic intelligence without cookie popups, IP logging, or third-party tracking scripts.",
    metric: "0",
    metricLabel: "Cookies Stored",
    icon: BarChart3,
    color: "from-blue-500 to-indigo-500",
    desktopOffset: { x: 330, y: 20, rotate: 6 },
    animationClass: "animate-note-float-5",
  },
  {
    id: "vector-svg",
    badge: "Print Ready",
    title: "Vector SVG & 4K PNG",
    summary: "Export crystal-sharp vectors for small cards to outdoor billboards.",
    detail: "Commercial-grade vector files format-ready for commercial vinyl cutters, foil stamping, laser engraving, and high-DPI acrylic printing.",
    metric: "∞ res",
    metricLabel: "Sharpness",
    icon: Printer,
    color: "from-teal-500 to-cyan-600",
    desktopOffset: { x: -220, y: 180, rotate: -4 },
    animationClass: "animate-note-float-2",
  },
  {
    id: "review-booster",
    badge: "Reputation",
    title: "5-Star Review Booster",
    summary: "Smart assistant that guides happy customers straight to Google reviews.",
    detail: "Collect genuine 5-star Google & Yelp ratings by routing satisfied patrons directly to your review modal with ratings pre-selected.",
    metric: "+42%",
    metricLabel: "Review Growth",
    icon: Star,
    color: "from-amber-400 to-emerald-500",
    desktopOffset: { x: 220, y: 180, rotate: 5 },
    animationClass: "animate-note-float-1",
  },
];

export type FolderColorTheme = "porcelain" | "emerald" | "obsidian" | "slate";

export default function FolderFloat({
  className = "",
}: {
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [spreadMode, setSpreadMode] = useState<"wide" | "compact">("wide");
  const [folderTheme, setFolderTheme] = useState<FolderColorTheme>("porcelain");
  const [inspectedNote, setInspectedNote] = useState<FloatingNote | null>(null);
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);

  const getThemeStyles = (t: FolderColorTheme) => {
    switch (t) {
      case "porcelain":
        return {
          back: "bg-white border-slate-200/90 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.08)]",
          tab: "bg-slate-100 text-emerald-800 border-slate-200",
          flap: "from-white/95 via-slate-50/90 to-slate-100/95 border-slate-200/90 text-slate-800",
          accentRing: "ring-emerald-500/25",
        };
      case "emerald":
        return {
          back: "bg-emerald-950 border-emerald-700/80 shadow-[0_25px_60px_-15px_rgba(6,78,59,0.4)]",
          tab: "bg-emerald-900 text-teal-300 border-emerald-700",
          flap: "from-emerald-900/95 via-emerald-950/90 to-black/95 border-emerald-600 text-emerald-100",
          accentRing: "ring-teal-400/30",
        };
      case "obsidian":
        return {
          back: "bg-slate-900 border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]",
          tab: "bg-slate-800 text-emerald-400 border-slate-700",
          flap: "from-slate-800/95 via-slate-900/90 to-slate-950/95 border-slate-700 text-slate-200",
          accentRing: "ring-emerald-500/30",
        };
      case "slate":
        return {
          back: "bg-slate-100 border-slate-300 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.06)]",
          tab: "bg-slate-200 text-slate-800 border-slate-300",
          flap: "from-slate-200/95 via-slate-100/90 to-slate-50/95 border-slate-300 text-slate-800",
          accentRing: "ring-slate-400/30",
        };
    }
  };

  const theme = getThemeStyles(folderTheme);
  const spreadMultiplier = spreadMode === "wide" ? 1 : 0.72;

  return (
    <section className={`relative overflow-hidden py-16 sm:py-24 ${className}`}>
      {/* Background ambient lighting in light mode */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[900px] rounded-full bg-emerald-500/06 blur-[140px]" />
      <div className="pointer-events-none absolute right-1/4 top-1/4 h-[350px] w-[350px] rounded-full bg-cyan-500/05 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800 shadow-2xs backdrop-blur-md">
            <Layers size={13} className="text-emerald-600 animate-pulse" />
            <span>React Bits Micro Interaction • Folder Float</span>
          </div>

          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Folder Float Micro Interaction
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Hover or tap the folder to trigger the spring cloud physics. Notes spring out into a weightless floating array showcasing Qrfolio's core architecture.
          </p>

          {/* Interactive Playground Toolbar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs">
            {/* Open / Close Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 font-semibold text-emerald-800 shadow-2xs transition-all hover:bg-emerald-100 active:scale-95 cursor-pointer"
            >
              {isOpen ? <FolderOpen size={15} /> : <FolderClosed size={15} />}
              <span>{isOpen ? "Folder Open (Spring Cloud)" : "Folder Closed (Click to Float)"}</span>
            </button>

            {/* Spread Density Toggle */}
            <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
              <span className="px-2.5 text-[11px] text-slate-500 font-medium">Cloud Spread:</span>
              <button
                onClick={() => setSpreadMode("wide")}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                  spreadMode === "wide"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Wide
              </button>
              <button
                onClick={() => setSpreadMode("compact")}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                  spreadMode === "compact"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Compact
              </button>
            </div>

            {/* Color Palette Switcher */}
            <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
              <span className="px-2 text-[11px] text-slate-500 font-medium">Theme:</span>
              {(["porcelain", "emerald", "obsidian", "slate"] as FolderColorTheme[]).map((themeKey) => (
                <button
                  key={themeKey}
                  onClick={() => setFolderTheme(themeKey)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold capitalize transition-all cursor-pointer ${
                    folderTheme === themeKey
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {themeKey}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            STAGE: Main Interactive Folder & Floating Cloud
           ========================================================================= */}
        <div
          className="relative mx-auto mt-12 min-h-[580px] sm:min-h-[640px] max-w-5xl flex items-center justify-center select-none"
        >
          {/* Subtle Stage Grid Floor in Light Mode */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl border border-slate-200/60 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,white_40%,transparent_75%)] opacity-70"
          />

          {/* THE FOLDER CONTAINER */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={() => setIsOpen(true)}
            className="group relative z-20 cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
            style={{ width: "260px", height: "175px" }}
          >
            {/* Top Folder Tab Notch */}
            <div
              className={`absolute -top-6 left-5 flex h-7 items-center gap-1.5 rounded-t-xl border-t border-x px-4 text-[11px] font-bold tracking-wider uppercase transition-colors duration-300 ${theme.tab}`}
            >
              <Sparkles size={11} className="text-emerald-600" />
              <span>QRFOLIO // CORE</span>
            </div>

            {/* Folder Back Plate */}
            <div
              className={`relative h-full w-full rounded-2xl rounded-tl-none border p-5 transition-all duration-300 ${theme.back}`}
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>CONFIDENTIAL DOSSIER</span>
                  <span className="font-mono text-emerald-700 font-bold">7 MODULES</span>
                </div>

                <div className="text-center py-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                    <MousePointerClick size={13} />
                    {isOpen ? "Click to store notes inside" : "Hover / Click to float notes"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/80 pt-2 text-[10px] text-slate-500">
                  <span>SYSTEM SPEC v2.0</span>
                  <span className="font-mono text-emerald-700 font-bold">ONLINE</span>
                </div>
              </div>

              {!isOpen && (
                <div className="absolute inset-x-6 top-3 -translate-y-2.5 space-y-1 transition-all duration-300">
                  <div className="h-2 w-full rounded-full bg-emerald-500/40" />
                  <div className="h-2 w-4/5 rounded-full bg-cyan-500/40" />
                  <div className="h-2 w-3/5 rounded-full bg-teal-500/40" />
                </div>
              )}
            </div>

            {/* Folder Front Flap */}
            <div
              className={`absolute inset-x-0 bottom-0 h-[125px] rounded-b-2xl border-t border-b border-x bg-gradient-to-b p-4 shadow-xl transition-all duration-500 ease-out ${theme.flap}`}
              style={{
                transformOrigin: "bottom center",
                transform: isOpen
                  ? "perspective(1000px) rotateX(-55deg) translateY(12px)"
                  : "perspective(1000px) rotateX(0deg) translateY(0px)",
                boxShadow: isOpen
                  ? "0 25px 50px -12px rgba(15, 23, 42, 0.18)"
                  : "0 10px 25px -5px rgba(15, 23, 42, 0.08)",
              }}
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Architecture Hub
                    </span>
                  </div>
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-mono text-emerald-800 border border-emerald-200">
                    {isOpen ? "SPRING CLOUD" : "STORED"}
                  </span>
                </div>

                <div className="flex items-end justify-between">
                  <p className="text-[11px] text-slate-600">
                    {isOpen ? "7 notes floating freely in cloud" : "Click to deploy floating cloud"}
                  </p>
                  <ArrowUpRight size={14} className="text-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          {/* FLOATING NOTES CLOUD */}
          {FEATURE_NOTES.map((note, idx) => {
            const Icon = note.icon;
            const isHovered = hoveredNoteId === note.id;

            const targetX = note.desktopOffset.x * spreadMultiplier;
            const targetY = note.desktopOffset.y * spreadMultiplier;
            const targetRotate = isHovered ? 0 : note.desktopOffset.rotate;
            const targetScale = isHovered ? 1.12 : 1;

            return (
              <div
                key={note.id}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  marginLeft: "-110px",
                  marginTop: "-65px",
                  transform: isOpen
                    ? `translate3d(${targetX}px, ${targetY}px, 0px) rotate(${targetRotate}deg) scale(${targetScale})`
                    : "translate3d(0px, 0px, 0px) rotate(0deg) scale(0.2)",
                  opacity: isOpen ? 1 : 0,
                  zIndex: isHovered ? 50 : 20 + idx,
                  transition: "transform 0.6s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.4s ease",
                  transitionDelay: `${isOpen ? idx * 45 : 0}ms`,
                  pointerEvents: isOpen ? "auto" : "none",
                }}
                onMouseEnter={() => {
                  setHoveredNoteId(note.id);
                  setIsOpen(true);
                }}
                onMouseLeave={() => setHoveredNoteId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setInspectedNote(note);
                }}
              >
                {/* Inner Card Styled for Premium Light UI */}
                <div
                  className={`w-[220px] rounded-2xl border p-3.5 backdrop-blur-xl select-none cursor-pointer transition-all duration-300 ${
                    isOpen ? note.animationClass : ""
                  } ${
                    isHovered
                      ? "border-emerald-500 bg-white shadow-[0_20px_50px_rgba(16,185,129,0.18)] ring-2 ring-emerald-400/40"
                      : "border-slate-200/90 bg-white/95 shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:border-emerald-400"
                  }`}
                >
                  {/* Note Top Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr ${note.color} text-white shadow-xs`}
                      >
                        <Icon size={14} />
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200">
                        {note.badge}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="block font-display text-xs font-black text-emerald-700">
                        {note.metric}
                      </span>
                      <span className="text-[8px] font-medium text-slate-500">
                        {note.metricLabel}
                      </span>
                    </div>
                  </div>

                  {/* Note Title & Summary */}
                  <h4 className="mt-2 text-xs font-bold text-slate-900 leading-tight">
                    {note.title}
                  </h4>
                  <p className="mt-1 text-[10px] text-slate-600 leading-snug line-clamp-2">
                    {note.summary}
                  </p>

                  {/* Micro Inspect Cue */}
                  <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1 text-[9px] font-semibold text-emerald-700">
                    <span>Inspect spec</span>
                    <ArrowUpRight size={11} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile / Tablet Friendly Grid */}
        <div className="mt-8 lg:hidden">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Tap Any Floating Module Below to Inspect:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {FEATURE_NOTES.map((note) => {
              const Icon = note.icon;
              return (
                <div
                  key={note.id}
                  onClick={() => setInspectedNote(note)}
                  className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs cursor-pointer hover:border-emerald-400 transition-colors"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${note.color} text-white`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="truncate text-xs font-bold text-slate-900">{note.title}</h4>
                      <span className="text-xs font-black text-emerald-700">{note.metric}</span>
                    </div>
                    <p className="truncate text-[11px] text-slate-600">{note.summary}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* INSPECT MODAL */}
      {inspectedNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setInspectedNote(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-slate-900/5"
          >
            {/* Close Button */}
            <button
              onClick={() => setInspectedNote(null)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3.5">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${inspectedNote.color} text-white shadow-xs`}
              >
                <inspectedNote.icon size={24} />
              </div>
              <div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200">
                  {inspectedNote.badge}
                </span>
                <h3 className="mt-1 text-xl font-bold text-slate-900">{inspectedNote.title}</h3>
              </div>
            </div>

            {/* Detailed Explanation */}
            <p className="mt-5 text-sm text-slate-600 leading-relaxed">
              {inspectedNote.detail}
            </p>

            {/* Metric Highlight Box */}
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4">
              <div>
                <span className="text-xs font-semibold text-slate-500">Benchmarked Impact:</span>
                <p className="text-sm font-bold text-slate-900">{inspectedNote.summary}</p>
              </div>
              <div className="text-right">
                <span className="font-display text-2xl font-black text-emerald-700">
                  {inspectedNote.metric}
                </span>
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">
                  {inspectedNote.metricLabel}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setInspectedNote(null)}
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-400 transition-all cursor-pointer"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
