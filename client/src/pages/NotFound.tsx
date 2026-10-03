import { ArrowLeft, Compass, Home } from "lucide-react";
import { Link } from "react-router-dom";
import Brand from "../components/Brand";
import { brandBtn, secondaryBtn } from "../lib/ui";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#f4f4f4] p-6 text-center selection:bg-[#69bd92]/30 selection:text-[#284737]">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#dff6e2]/80 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mb-8">
        <Brand size="lg" />
      </div>

      <div className="relative rounded-3xl bg-white/90 backdrop-blur-xl p-8 sm:p-10 shadow-xl ring-1 ring-[#b7dbc4] max-w-md w-full animate-fadeIn">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e3f7e6] text-[#467359]">
          <Compass size={32} />
        </div>

        <div className="mt-4 inline-block rounded-full bg-[#dff6e2] px-3 py-0.5 text-xs font-bold text-[#355d48] ring-1 ring-[#b7dbc4]">
          404 Error
        </div>

        <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#284737] font-['Outfit']">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-[#43745b] leading-relaxed">
          The link you followed might be broken, or the page may have been moved or renamed.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className={`${brandBtn} w-full sm:w-auto text-xs py-2.5`}>
            <Home size={15} /> Return Home
          </Link>
          <Link to="/dashboard" className={`${secondaryBtn} w-full sm:w-auto text-xs py-2.5`}>
            <ArrowLeft size={15} /> Open Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
