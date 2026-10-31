import { ArrowLeft, Compass, Home } from "lucide-react";
import { Link } from "react-router-dom";
import Brand from "../components/Brand";
import { brandBtn, secondaryBtn } from "../lib/ui";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center font-sans selection:bg-[#d4f04d] selection:text-slate-950">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mb-8">
        <Brand size="lg" />
      </div>

      <div className="relative rounded-3xl bg-white p-8 sm:p-12 shadow-xl border border-slate-200/90 max-w-md w-full animate-fade-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-[#d4f04d] shadow-sm">
          <Compass size={32} />
        </div>

        <div className="mt-4 inline-block rounded-full bg-slate-100 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-slate-800">
          404 Not Found
        </div>

        <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-slate-950 font-display">
          Page Not Found
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
          The link you followed might be broken, or the dynamic QR stand may have been retired.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className={`${brandBtn} w-full sm:w-auto text-xs py-2.5 px-5`}>
            <Home size={14} /> Return Home
          </Link>
          <Link to="/dashboard" className={`${secondaryBtn} w-full sm:w-auto text-xs py-2.5 px-5`}>
            <ArrowLeft size={14} /> Open Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
