export { inputClass } from "../components/AuthShell";

const baseBtn =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-95";

export const primaryBtn = `${baseBtn} bg-slate-950 text-white hover:bg-slate-800 shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2`;

export const brandBtn = `${baseBtn} bg-[#b8de20] hover:bg-[#a6cc18] text-[#0e1424] font-black shadow-md hover:shadow-lg active:scale-95 focus-visible:ring-2 focus-visible:ring-[#b8de20] focus-visible:ring-offset-2`;

export const secondaryBtn = `${baseBtn} border border-slate-200/90 bg-white text-slate-800 shadow-2xs hover:bg-slate-50 hover:border-slate-300 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-400`;

export const dangerBtn = `${baseBtn} border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:border-rose-300 hover:text-rose-800 focus-visible:ring-2 focus-visible:ring-rose-500`;

export const cardClass =
  "rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs transition-all duration-200";

export const interactiveCardClass =
  `${cardClass} hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5`;
