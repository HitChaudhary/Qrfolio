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
    <main className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#f4f4f4] overflow-hidden">
      {/* Ambient background decoration in sage & mint */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#dff6e2]/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#b7dbc4]/40 blur-3xl" />
      
      <div className="relative w-full max-w-md animate-fade-in">
        <div className="mb-8 flex justify-center">
          <Brand size="lg" showBadge />
        </div>

        <div className="rounded-3xl border border-[#b7dbc4]/70 bg-white/95 p-8 shadow-[0_4px_24px_rgba(70,115,89,0.06)] backdrop-blur-md ring-1 ring-[#467359]/5 sm:p-10">
          <div className="mb-6 text-center sm:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-[#284737]">{title}</h1>
            <p className="mt-1.5 text-sm text-[#43745b] leading-relaxed">{subtitle}</p>
          </div>
          <div>{children}</div>
        </div>

        <div className="mt-6 text-center text-sm text-[#43745b]">{footer}</div>
      </div>
    </main>
  );
}

export const inputClass =
  "w-full rounded-xl border border-[#b7dbc4] bg-white px-3.5 py-2.5 text-sm text-[#284737] placeholder:text-[#a5afa9] transition-all duration-150 focus:border-[#69bd92] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#69bd92]/20 disabled:bg-[#f0f3f0] disabled:text-[#a5afa9]";

export const buttonClass =
  "flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#467359] via-[#6dae8c] to-[#69bd92] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#69bd92]/25 transition-all duration-200 hover:shadow-md hover:shadow-[#69bd92]/35 hover:from-[#355d48] hover:to-[#6dae8c] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-[#69bd92] focus-visible:ring-offset-2";
