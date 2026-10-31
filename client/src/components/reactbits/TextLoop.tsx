import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

export interface TextLoopItem {
  text: string;
  badge?: string;
  highlight?: boolean;
}

export interface TextLoopProps {
  items?: (string | TextLoopItem)[];
  speed?: number; // seconds per loop
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
  separator?: ReactNode;
}

const DEFAULT_ITEMS: TextLoopItem[] = [
  { text: "Dynamic Smart QR Routing", badge: "Engine", highlight: true },
  { text: "Zero Reprint Costs When Updating Links", badge: "Cost Saver" },
  { text: "Embedded Brand Center Badging", badge: "Design", highlight: true },
  { text: "Ultra-Fast Mobile Bio Hub Pages", badge: "Speed" },
  { text: "Level-H Error Correction Guaranteed", badge: "Reliability" },
  { text: "Zero-PII Privacy-First Scan Analytics", badge: "Privacy", highlight: true },
  { text: "Print-Ready Vector SVG & 4K PNG", badge: "Print" },
  { text: "Instant Reordering & Promo Toggles", badge: "Flexibility" },
  { text: "Scannable On All Modern Smartphones", badge: "100% Mobile" },
];

export default function TextLoop({
  items = DEFAULT_ITEMS,
  speed = 28,
  direction = "left",
  pauseOnHover = true,
  className = "",
  separator,
}: TextLoopProps) {
  // Normalize items to array of objects
  const normalizedItems = items.map((item) =>
    typeof item === "string" ? { text: item } : item
  );

  // Duplicate items 2 times to form an unbroken continuous loop
  const loopItems = [...normalizedItems, ...normalizedItems];

  const defaultSeparator = (
    <span className="inline-flex items-center justify-center text-emerald-500/80 px-4">
      <Sparkles size={14} className="text-emerald-500 animate-pulse" />
    </span>
  );

  return (
    <div
      className={`relative w-full overflow-hidden border-y border-slate-200/80 bg-white/70 py-4 backdrop-blur-md shadow-2xs ${
        pauseOnHover ? "pause-hover" : ""
      } ${className}`}
      aria-label="Features Ticker"
    >
      {/* Edge gradient masks for seamless fade out in light mode */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#fafbfc] via-[#fafbfc]/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#fafbfc] via-[#fafbfc]/80 to-transparent" />

      {/* Looping Track */}
      <div
        className={
          direction === "left"
            ? "animate-loop-scroll"
            : "animate-loop-scroll-reverse"
        }
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {loopItems.map((item, idx) => (
          <div
            key={idx}
            className="inline-flex items-center shrink-0 cursor-default transition-all duration-200 hover:scale-[1.02]"
          >
            <div
              className={`inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 transition-all ${
                item.highlight
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300/80 shadow-2xs"
                  : "bg-white text-slate-700 border border-slate-200/90 shadow-2xs hover:border-emerald-300"
              }`}
            >
              {item.badge && (
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  {item.badge}
                </span>
              )}
              <span className="font-display text-sm font-semibold tracking-tight whitespace-nowrap">
                {item.text}
              </span>
            </div>

            {separator || defaultSeparator}
          </div>
        ))}
      </div>
    </div>
  );
}
