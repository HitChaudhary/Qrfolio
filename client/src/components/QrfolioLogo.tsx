import type { SVGProps } from "react";

export interface QrfolioLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "wordmark";
  mode?: "light" | "dark" | "white" | "squircle" | "auto";
  animated?: boolean;
  className?: string;
  showBadge?: boolean;
  useImage?: boolean;
}

/**
 * Authentic Qrfolio Folded-Q Brand Icon Mark
 * Features:
 * - Continuous obsidian / white rounded stroke loop with circular end caps
 * - Floating inner rounded square
 * - Iconic origami folded corner triangle in Electric Lime (#b8de20)
 * - Optional squircle app icon container
 */
export function QrfolioIconMark({
  size = 36,
  mode = "light",
  animated = false,
  className = "",
  ...props
}: {
  size?: number;
  mode?: "light" | "dark" | "white" | "squircle" | "auto";
  animated?: boolean;
  className?: string;
} & SVGProps<SVGSVGElement>) {
  const isSquircle = mode === "squircle";
  const isDarkBg = mode === "dark" || mode === "white";

  const strokeColor = isSquircle || isDarkBg ? "#f7f5f0" : "#0e1424";
  const innerSquareColor = isSquircle || isDarkBg ? "#f7f5f0" : "#0e1424";
  const limeColor = "#b8de20";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      {...props}
    >
      {/* Optional Brand Squircle Container */}
      {isSquircle && (
        <rect
          width="800"
          height="800"
          rx="180"
          fill="#0e1424"
        />
      )}

      {/* Main Vector Glyph Group */}
      <g
        transform={
          isSquircle
            ? "translate(142, 142) scale(0.645)"
            : "translate(0, 0)"
        }
      >
        {/* Continuous Loop with Rounded Caps */}
        <path
          d="M 755 474 V 210 A 165 165 0 0 0 590 45 H 210 A 165 165 0 0 0 45 210 V 590 A 165 165 0 0 0 210 755 H 474"
          stroke={strokeColor}
          strokeWidth="70"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Origami Folded Corner Triangle */}
        <polygon
          points="510,510 690,510 510,690"
          fill={limeColor}
          className={animated ? "animate-pulse" : ""}
        />

        {/* Floating Inner Rounded Core */}
        <rect
          x="308"
          y="308"
          width="184"
          height="184"
          rx="28"
          fill={innerSquareColor}
        />
      </g>
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
  useImage = false,
}: QrfolioLogoProps) {
  const sizeMap = {
    xs: { icon: 22, text: "text-base", gap: "gap-1.5", badgeText: "text-[9px]" },
    sm: { icon: 28, text: "text-lg", gap: "gap-2", badgeText: "text-[10px]" },
    md: { icon: 34, text: "text-2xl", gap: "gap-2.5", badgeText: "text-[11px]" },
    lg: { icon: 42, text: "text-3xl", gap: "gap-3", badgeText: "text-xs" },
    xl: { icon: 54, text: "text-4xl", gap: "gap-3.5", badgeText: "text-xs" },
  };

  const currentSize = sizeMap[size];
  const isDarkBg = mode === "dark" || mode === "white";

  // When useImage is requested, render the exact official transparent high-res PNG
  if (useImage) {
    const imgSrc = isDarkBg ? "/logo-dark.png" : "/logo.png";
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src={imgSrc}
          alt="qrfolio"
          className="h-auto w-auto object-contain"
          style={{ height: `${currentSize.icon * 1.05}px` }}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${currentSize.gap} select-none ${className}`}>
      {/* Icon Mark */}
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

      {/* Wordmark: "qrfolio" in lowercase geometric sans with signature lime dot on i */}
      {variant !== "icon" && (
        <div className="flex items-center gap-2">
          <span
            className={`font-display ${currentSize.text} font-black tracking-[-0.04em] leading-none ${
              isDarkBg ? "text-white" : "text-[#0e1424]"
            }`}
          >
            qrfol
            <span className="relative inline-block">
              {/* Invisible native 'i' preserves font kerning, space and accessibility */}
              <span className="opacity-0">i</span>
              {/* Custom stem with electric lime square dot */}
              <span className="absolute inset-0 flex flex-col items-center justify-between pointer-events-none pb-[0.02em]">
                <span
                  className={`w-[0.26em] h-[0.26em] rounded-[0.06em] bg-[#b8de20] shadow-[0_0_8px_rgba(184,222,32,0.7)] ${
                    animated ? "animate-pulse" : ""
                  }`}
                  aria-hidden="true"
                />
                <span className="w-[0.28em] h-[0.67em] rounded-[0.04em] bg-current" />
              </span>
            </span>
            o
          </span>

          {showBadge && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 ${currentSize.badgeText} font-bold tracking-wide shadow-2xs ${
                isDarkBg
                  ? "bg-white/15 text-white border border-white/25 backdrop-blur-md"
                  : "bg-slate-100 text-[#0e1424] border border-slate-200"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#b8de20] animate-pulse" />
              v2.0
            </span>
          )}
        </div>
      )}
    </div>
  );
}
