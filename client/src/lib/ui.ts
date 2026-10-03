export { inputClass } from "../components/AuthShell";

const baseBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

export const primaryBtn = `${baseBtn} bg-[#467359] text-white shadow-sm hover:bg-[#355d48] hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#467359] focus-visible:ring-offset-2`;

export const brandBtn = `${baseBtn} bg-gradient-to-r from-[#467359] via-[#6dae8c] to-[#69bd92] text-white shadow-sm shadow-[#69bd92]/30 hover:shadow-md hover:shadow-[#69bd92]/40 hover:from-[#355d48] hover:to-[#6dae8c] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#69bd92] focus-visible:ring-offset-2`;

export const secondaryBtn = `${baseBtn} border border-[#b7dbc4] bg-white text-[#43745b] shadow-xs hover:bg-[#e3f7e6] hover:border-[#69bd92] hover:text-[#284737] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#70a087]`;

export const dangerBtn = `${baseBtn} border border-red-200 bg-red-50/70 text-red-700 hover:bg-red-100 hover:border-red-300 hover:text-red-800 focus-visible:ring-2 focus-visible:ring-red-500`;

export const cardClass =
  "rounded-2xl border border-[#b7dbc4]/60 bg-white p-6 shadow-[0_2px_12px_rgba(70,115,89,0.05)] transition-all duration-200";

export const interactiveCardClass =
  `${cardClass} hover:border-[#69bd92] hover:shadow-[0_8px_24px_rgba(70,115,89,0.1)] hover:-translate-y-0.5`;
