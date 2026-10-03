import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Brand({
  size = "md",
  link = true,
  className = "",
  showBadge = false,
}: {
  size?: "sm" | "md" | "lg";
  link?: boolean;
  className?: string;
  showBadge?: boolean;
}) {
  const iconSizes = {
    sm: "h-7 w-7 rounded-lg text-xs",
    md: "h-9 w-9 rounded-xl text-sm",
    lg: "h-11 w-11 rounded-2xl text-base",
  };

  const textSizes = {
    sm: "text-base font-bold",
    md: "text-lg font-extrabold tracking-tight",
    lg: "text-2xl font-extrabold tracking-tight",
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Sleek geometric QR icon with sage/mint green gradient */}
      <div className={`relative flex ${iconSizes[size]} shrink-0 items-center justify-center bg-gradient-to-br from-[#284737] via-[#467359] to-[#69bd92] p-1.5 text-white shadow-md shadow-[#467359]/20 ring-1 ring-[#b7dbc4]/40 group-hover:scale-105 transition-transform duration-200`}>
        <div className="grid grid-cols-2 gap-0.5 w-full h-full p-0.5">
          <div className="rounded-[2px] bg-[#69bd92]" />
          <div className="rounded-[2px] bg-white" />
          <div className="rounded-[2px] bg-white" />
          <div className="rounded-[2px] bg-[#dff6e2]" />
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`font-display ${textSizes[size]} text-[#284737]`}>
          Qr<span className="bg-gradient-to-r from-[#467359] to-[#69bd92] bg-clip-text text-transparent">Folio</span>
        </span>
        {showBadge && (
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#e3f7e6] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#355d48] ring-1 ring-[#b7dbc4]">
            <Sparkles size={10} className="text-[#69bd92]" /> v2.0
          </span>
        )}
      </div>
    </div>
  );

  if (link) {
    return (
      <Link to="/" className="group inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
