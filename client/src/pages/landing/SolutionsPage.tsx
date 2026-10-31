import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calculator,
  Store,
} from "lucide-react";
import LogoLoop, { BUSINESS_TYPES, BusinessItem } from "../../components/reactbits/LogoLoop";

export default function SolutionsPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<BusinessItem>(BUSINESS_TYPES[0]);

  // Interactive ROI calculator state for India shops
  const [tablesOrLocations, setTablesOrLocations] = useState(15);
  const [menuChangesPerYear, setMenuChangesPerYear] = useState(6);

  // Estimated reprint cost = tables * ₹450 reprint batch cost * changes
  const estimatedSavings = tablesOrLocations * menuChangesPerYear * 450;
  const estimatedReviews = tablesOrLocations * 28;

  return (
    <div className="py-12 sm:py-20 bg-slate-50 font-sans selection:bg-[#d4f04d] selection:text-slate-950">
      {/* Page Header */}
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-800 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-[#d4f04d] animate-pulse" />
          <span>Tailored For Indian Local Commerce</span>
        </div>
        <h1 className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-tight">
          One Dynamic QR for Every Shop & Counter
        </h1>
        <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Whether you run an artisanal chai cafe in Ahmedabad, a traditional Kathiyawadi dining hall in Rajkot, or a luxury bridal salon in Surat, QrFolio turns customer scans into 5★ Google reviews and direct WhatsApp orders.
        </p>
      </div>

      {/* Infinite Logo Loop Section */}
      <div className="mt-12">
        <LogoLoop showSpotlight={false} />
      </div>

      {/* Detailed Industry Solutions Showcase */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-20">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            • INTERACTIVE BLUEPRINTS
          </span>
          <h2 className="mt-2 font-display text-3xl font-black text-slate-950 sm:text-4xl">
            Select Your Industry To View Blueprint
          </h2>
          <p className="mt-3 text-slate-600 text-xs sm:text-base leading-relaxed">
            Click any sector below to see typical destination links, recommended counter placement, and conversion rates.
          </p>
        </div>

        {/* Industry Pill Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {BUSINESS_TYPES.map((biz) => {
            const Icon = biz.icon;
            const isSelected = selectedIndustry.id === biz.id;

            return (
              <button
                key={biz.id}
                onClick={() => setSelectedIndustry(biz)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-950 text-[#d4f04d] shadow-md scale-105"
                    : "bg-white border border-slate-200 text-slate-700 hover:text-slate-950 hover:border-slate-300 shadow-2xs"
                }`}
              >
                <Icon size={14} />
                <span>{biz.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Industry Blueprint Card */}
        <div className="mt-10 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            {/* Left 7 cols: Blueprint Info */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-[#d4f04d] shadow-sm"
                >
                  <selectedIndustry.icon size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {selectedIndustry.category}
                  </span>
                  <h3 className="text-2xl font-black text-slate-950 font-display">{selectedIndustry.name}</h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedIndustry.tagline}
              </p>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 space-y-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                  Recommended Physical Placement:
                </span>
                <p className="text-xs sm:text-sm text-slate-800 font-semibold">{selectedIndustry.placement}</p>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2.5">
                  Pre-Configured High-Converting Links:
                </span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {selectedIndustry.topLinks.map((link, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800"
                    >
                      <CheckCircle2 size={14} className="text-[#d4f04d] fill-slate-950 shrink-0" />
                      <span className="truncate">{link}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 cols: Live Mobile Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-xs rounded-[32px] border-4 border-slate-900 bg-slate-900 p-4 shadow-2xl">
                <div className="mx-auto mb-3 h-3 w-20 rounded-full bg-slate-800" />
                <div className="rounded-2xl bg-white p-5 text-center shadow-inner">
                  <div
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-[#d4f04d] font-bold text-xl shadow-xs"
                  >
                    <selectedIndustry.icon size={26} />
                  </div>
                  <h4 className="mt-2.5 font-black text-sm text-slate-950 font-display">{selectedIndustry.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    qrfolio.io/p/{selectedIndustry.id}
                  </p>

                  <div className="mt-4 space-y-2 text-left">
                    {selectedIndustry.topLinks.map((link, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-900 flex items-center justify-between"
                      >
                        <span className="truncate">{link}</span>
                        <ArrowRight size={12} className="text-slate-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive ROI & Reprint Savings Calculator */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 mt-24">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-[#d4f04d]">
              <Calculator size={22} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                • ANNUAL SAVINGS CALCULATOR
              </span>
              <h3 className="font-display text-2xl font-black text-slate-950">
                Calculate Your Annual Menu & Standee Savings
              </h3>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Number of Tables / Billing Stands:</span>
                  <span className="text-slate-950 font-mono font-black">{tablesOrLocations} stands</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="100"
                  value={tablesOrLocations}
                  onChange={(e) => setTablesOrLocations(Number(e.target.value))}
                  className="w-full accent-slate-950"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Menu / Price / Promo Changes Per Year:</span>
                  <span className="text-slate-950 font-mono font-black">{menuChangesPerYear} times/year</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={menuChangesPerYear}
                  onChange={(e) => setMenuChangesPerYear(Number(e.target.value))}
                  className="w-full accent-slate-950"
                />
              </div>

              <p className="text-xs text-slate-500">
                Based on average Indian printing costs of ₹450 per standee/menu leaflet run and ~28 review booster conversions per table annually.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 flex flex-col justify-between text-white shadow-xl">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#d4f04d]">
                  Estimated Direct Annual Savings
                </span>
                <p className="font-display text-4xl sm:text-5xl font-black text-white mt-1">
                  ₹{estimatedSavings.toLocaleString()}
                </p>
                <span className="text-xs text-slate-300 mt-2 block">
                  Plus ~{estimatedReviews.toLocaleString()} verified Google 5★ reviews collected right at the billing counter!
                </span>
              </div>

              <Link
                to="/register"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#d4f04d] hover:bg-[#c4e436] px-5 py-3 text-xs font-black text-slate-950 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Claim Your Permanent QR Now ↗</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
