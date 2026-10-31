import type { SVGProps } from "react";

export interface QrfolioLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "wordmark";
  mode?: "light" | "dark" | "white" | "auto";
  animated?: boolean;
  className?: string;
  showBadge?: boolean;
}

export function QrfolioIconMark({
  size = 36,
  mode = "light",
  animated = false,
  className = "",
  ...props
}: {
  size?: number;
  mode?: "light" | "dark" | "white" | "auto";
  animated?: boolean;
  className?: string;
} & SVGProps<SVGSVGElement>) {
  const isDarkBg = mode === "dark" || mode === "white";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      {...props}
    >
      {/* Container Squircle:
          - On dark/sky: Luminous crystalline white glass with crisp edge
          - On light: Deep obsidian graphite with precision metallic rim */}
      <rect
        x="3"
        y="3"
        width="42"
        height="42"
        rx="12"
        fill={isDarkBg ? "rgba(255, 255, 255, 0.22)" : "#090d16"}
        stroke={isDarkBg ? "rgba(255, 255, 255, 0.55)" : "#1e293b"}
        strokeWidth="1.5"
      />

      {/* Top Glass Sheen (Subtle highlight across upper half) */}
      <path
        d="M3 15C3 8.37258 8.37258 3 15 3H33C39.6274 3 45 8.37258 45 15V22H3V15Z"
        fill="white"
        fillOpacity={isDarkBg ? "0.18" : "0.06"}
      />

      {/* --- GEOMETRIC DYNAMIC QR MATRIX GLYPH --- */}
      {/* 1. Top-Left Primary QR Finder Pattern */}
      <rect
        x="9.5"
        y="9.5"
        width="13"
        height="13"
        rx="3.5"
        fill={isDarkBg ? "#ffffff" : "#ffffff"}
      />
      <rect
        x="11.5"
        y="11.5"
        width="9"
        height="9"
        rx="2"
        fill={isDarkBg ? "#0284c7" : "#090d16"}
      />
      <rect
        x="14"
        y="14"
        width="4"
        height="4"
        rx="1"
        fill={isDarkBg ? "#d4f04d" : "#38bdf8"}
      />

      {/* 2. Top-Right Secondary Finder Pattern */}
      <rect
        x="25.5"
        y="9.5"
        width="13"
        height="13"
        rx="3.5"
        fill={isDarkBg ? "#ffffff" : "#ffffff"}
      />
      <rect
        x="27.5"
        y="11.5"
        width="9"
        height="9"
        rx="2"
        fill={isDarkBg ? "#0284c7" : "#090d16"}
      />
      <circle
        cx="32"
        cy="16"
        r="2"
        fill={isDarkBg ? "#38bdf8" : "#d4f04d"}
      />

      {/* 3. Bottom-Left Third Finder Pattern */}
      <rect
        x="9.5"
        y="25.5"
        width="13"
        height="13"
        rx="3.5"
        fill={isDarkBg ? "#ffffff" : "#ffffff"}
      />
      <rect
        x="11.5"
        y="27.5"
        width="9"
        height="9"
        rx="2"
        fill={isDarkBg ? "#0284c7" : "#090d16"}
      />
      <rect
        x="14"
        y="30"
        width="4"
        height="4"
        rx="1"
        fill="#ffffff"
      />

      {/* 4. Bottom-Right "Smart Dynamic Folio Node" */}
      {/* Folio Gateway Brackets */}
      <rect
        x="25.5"
        y="25.5"
        width="5.5"
        height="5.5"
        rx="1.5"
        fill="#ffffff"
      />
      <rect
        x="33"
        y="25.5"
        width="5.5"
        height="5.5"
        rx="1.5"
        fill={isDarkBg ? "#d4f04d" : "#38bdf8"}
      />

      {/* Dynamic Signal Node: Pulsing core */}
      <circle
        cx="29"
        cy="35"
        r="3.5"
        fill={isDarkBg ? "#ffffff" : "#d4f04d"}
        className={animated ? "animate-pulse" : ""}
      />

      {/* Dynamic Proxy Routing Tail */}
      <path
        d="M34 32.5L37.5 36"
        stroke={isDarkBg ? "#ffffff" : "#ffffff"}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function QrfolioLogo({
  size = "md",
  variant = "full",
  mode = "light",
  animated = false,
  className = "",
  showBadge = false,
}: QrfolioLogoProps) {
  const sizeMap = {
    xs: { icon: 22, text: "text-sm", gap: "gap-1.5" },
    sm: { icon: 28, text: "text-base", gap: "gap-2" },
    md: { icon: 34, text: "text-xl", gap: "gap-2.5" },
    lg: { icon: 42, text: "text-2xl", gap: "gap-3" },
    xl: { icon: 52, text: "text-3xl", gap: "gap-3.5" },
  };

  const currentSize = sizeMap[size];
  const isDarkBg = mode === "dark" || mode === "white";

  return (
    <div className={`inline-flex items-center ${currentSize.gap} select-none ${className}`}>
      {/* Logo Icon Mark */}
      {variant !== "wordmark" && (
        <div className="relative group-hover:scale-105 transition-transform duration-200 shrink-0">
          <QrfolioIconMark
            size={currentSize.icon}
            mode={mode}
            animated={animated}
            className="drop-shadow-xs"
          />
        </div>
      )}

      {/* Wordmark: Clean, crisp, high-end display typography */}
      {variant !== "icon" && (
        <div className="flex items-center gap-2">
          {isDarkBg ? (
            /* On dark/sky background: Crisp pure white with subtle electric lime accent */
            <span
              className={`font-display ${currentSize.text} font-black tracking-tight leading-none text-white drop-shadow-xs`}
            >
              Qr<span className="font-extrabold text-white/95">folio</span>
            </span>
          ) : (
            /* On light background: Deep obsidian with high contrast */
            <span
              className={`font-display ${currentSize.text} font-black tracking-tight leading-none text-slate-950`}
            >
              Qr<span className="font-extrabold text-slate-800">folio</span>
            </span>
          )}

          {showBadge && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide shadow-2xs ${
                isDarkBg
                  ? "bg-white/20 text-white border border-white/30 backdrop-blur-md"
                  : "bg-slate-100 text-slate-800 border border-slate-200"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isDarkBg ? "bg-[#d4f04d]" : "bg-sky-500"
                } animate-pulse`}
              />
              v2.0
            </span>
          )}
        </div>
      )}
    </div>
  );
}
