import type { ReactNode } from "react";
import Brand from "./Brand";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50 overflow-hidden antialiased selection:bg-[#d4f04d] selection:text-slate-950 font-sans">
      {/* Ambient background soft sky gradients */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#d4f04d]/15 blur-3xl" />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="mb-8 flex justify-center">
          <Brand size="lg" showBadge mode="light" />
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-10 shadow-xl shadow-slate-900/5 ring-1 ring-slate-900/5">
          <div className="mb-6 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 font-display">
              {title}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {subtitle}
            </p>
          </div>
          <div>{children}</div>
        </div>

        <div className="mt-6 text-center text-xs sm:text-sm text-slate-600">
          {footer}
        </div>
      </div>
    </main>
  );
}

export const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:border-slate-900 focus:bg-white focus:outline-hidden focus:ring-3 focus:ring-slate-900/10 disabled:bg-slate-100 disabled:text-slate-400 shadow-2xs";

export const buttonClass =
  "flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#d4f04d] hover:bg-[#c4e436] px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-950 shadow-md transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
