import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Menu,
  X,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Brand from "../Brand";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features", badge: "Float" },
  { to: "/solutions", label: "Solutions" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/faq", label: "FAQ" },
];

export default function LandingLayout() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      // On home page, header stays transparent while over the hero sky (~520px).
      // On subpages, it transitions immediately after slight scroll.
      const threshold = isHome ? 520 : 20;
      setIsScrolled(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const cta = user
    ? { to: "/dashboard", label: "Dashboard" }
    : { to: "/register", label: "Get Started ↗" };

  // On home page over hero sky: transparent header with luminous white branding.
  // When scrolled past hero or on subpages: crystalline frosted light header.
  const isTransparent = isHome && !isScrolled;

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-[#d4f04d] selection:text-slate-950 flex flex-col font-sans relative antialiased">
      {/* Sticky / Floating Header */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isTransparent
            ? "bg-transparent border-transparent pt-5 sm:pt-6 pb-3"
            : "bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] py-3"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8">
          <Brand
            size="md"
            showBadge={false}
            mode={isTransparent ? "dark" : "light"}
          />

          {/* Center Navigation Links (Clean uppercase typography as in reference) */}
          <nav
            className={`hidden items-center gap-1 lg:flex px-4 py-1.5 rounded-full transition-all ${
              isTransparent
                ? "bg-black/15 backdrop-blur-md border border-white/20"
                : "bg-slate-100/90 border border-slate-200/80"
            }`}
          >
            {NAV_LINKS.map(({ to, label }) => {
              const isActive =
                to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

              return (
                <NavLink
                  key={to}
                  to={to}
                  className={`relative px-4 py-1.5 text-xs font-semibold rounded-full uppercase tracking-wider transition-all duration-200 ${
                    isTransparent
                      ? isActive
                        ? "bg-white/25 text-white font-bold shadow-xs"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                      : isActive
                      ? "bg-white text-slate-950 font-bold shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-950 hover:bg-white/60"
                  }`}
                >
                  {label}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Button (Electric Lime Pill Button) */}
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className={`hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                    isTransparent
                      ? "text-white/90 hover:text-white hover:bg-white/10"
                      : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
                  }`}
                >
                  Log in
                </Link>
                <Link
                  to={cta.to}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#d4f04d] hover:bg-[#c4e436] px-5 py-2 text-xs font-black text-slate-950 shadow-md transition-all duration-200 active:scale-95"
                >
                  <span>{cta.label}</span>
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#d4f04d] hover:bg-[#c4e436] px-5 py-2 text-xs font-black text-slate-950 shadow-md transition-all active:scale-95"
              >
                <span>Dashboard</span>
                <ArrowRight size={13} />
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                isTransparent
                  ? "border-white/30 bg-black/20 text-white"
                  : "border-slate-200 bg-white text-slate-800"
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 bg-white/95 px-4 py-4 space-y-2 backdrop-blur-2xl animate-fade-in shadow-xl">
            {NAV_LINKS.map(({ to, label }) => {
              const isActive =
                to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-950 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            {!user && (
              <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-center text-xs font-semibold text-slate-800"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full bg-[#d4f04d] px-4 py-2 text-center text-xs font-black text-slate-950 shadow-sm"
                >
                  Get Started ↗
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Page Body (If on subpages, offset top for fixed header) */}
      <main className={`flex-1 ${!isHome ? "pt-20" : ""}`}>
        <Outlet />
      </main>

      {/* Modern Multi-Page Premium Light Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-16 text-slate-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-5">
            {/* Col 1: Brand & Status (2 cols) */}
            <div className="md:col-span-2 space-y-4">
              <Brand size="lg" showBadge mode="light" />
              <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
                qrfolio empowers modern businesses, shops, and restaurants to build branded dynamic QR codes with Level-H error correction and lightning-fast mobile hubs.
              </p>

              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                <span className="h-2 w-2 rounded-full bg-[#b8de20] ring-2 ring-lime-400 animate-pulse" />
                <span>All Systems Operational • 99.99% Routing Uptime</span>
              </div>
            </div>

            {/* Col 2: Public Navigation Pages */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Pages</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/" className="text-slate-600 hover:text-slate-950 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/features" className="text-slate-600 hover:text-slate-950 transition-colors">
                    Features & Folder Float
                  </Link>
                </li>
                <li>
                  <Link to="/solutions" className="text-slate-600 hover:text-slate-950 transition-colors">
                    Industry Solutions
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="text-slate-600 hover:text-slate-950 transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-slate-600 hover:text-slate-950 transition-colors">
                    Transparent Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-slate-600 hover:text-slate-950 transition-colors">
                    Help & FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Product Capabilities */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Capabilities
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#84cc16] shrink-0" />
                  <span>Dynamic Smart Routing</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#84cc16] shrink-0" />
                  <span>Level-H Error Correction</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#84cc16] shrink-0" />
                  <span>Center Logo Badging</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#84cc16] shrink-0" />
                  <span>Sub-300ms Mobile Hub</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#84cc16] shrink-0" />
                  <span>Zero-PII Privacy Analytics</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#84cc16] shrink-0" />
                  <span>Vector SVG & 4K PNG</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Trust & Security */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Trust & Security
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                100% cookie-free analytics. We never store personal customer identifiers, GPS tracks, or intrusive device fingerprints.
              </p>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <ShieldCheck size={14} className="text-[#84cc16]" />
                  <span>GDPR & CCPA Safe</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Zero consent banners needed on your patron bio pages.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/80 pt-6 text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} qrfolio Technologies Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/faq" className="hover:text-slate-900 transition-colors">
                Support
              </Link>
              <Link to="/pricing" className="hover:text-slate-900 transition-colors">
                Pricing
              </Link>
              <Link to="/features" className="hover:text-slate-900 transition-colors">
                Folder Float Demo
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
