import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Sparkles, HelpCircle, ShieldCheck } from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const plans = [
    {
      name: "Starter",
      badge: "Free Forever",
      price: "₹0",
      period: "forever",
      description: "Ideal for individual freelancers, chai stalls, and testing out dynamic QR links.",
      highlight: false,
      cta: "Claim Free Plan",
      ctaTo: "/register",
      features: [
        "1 Smart Dynamic QR Code",
        "Permanent Routing (Edit in 10s)",
        "Standard Center Badging",
        "Mobile Customer Bio Page",
        "High-Res PNG Export",
        "Unlimited Customer Scans",
        "Standard Level-M Error Correction",
      ],
    },
    {
      name: "Pro",
      badge: "Most Popular",
      price: billingCycle === "annual" ? "₹399" : "₹499",
      period: "per month, billed " + (billingCycle === "annual" ? "annually" : "monthly"),
      description: "For cafes, restaurants, salons, retail shops, and clinics across India.",
      highlight: true,
      cta: "Claim Pro Plan ↗",
      ctaTo: "/register?plan=pro",
      features: [
        "Unlimited Dynamic QR Codes",
        "Custom Logo Upload & Center Badging",
        "Industrial Level-H Error Correction (Spill & chai proof)",
        "Print-Ready Vector SVG & 4K PNG",
        "5-Star Google Review Booster Assistant",
        "Real-Time Zero-PII Counter Scan Analytics",
        "Daily Link Click Velocity Metrics",
        "Custom Vanity Slugs (qrfolio.io/p/yourbrand)",
        "Direct Deep-App Linking (WhatsApp, Maps)",
      ],
    },
    {
      name: "Business",
      badge: "Multi-Outlet",
      price: billingCycle === "annual" ? "₹1,199" : "₹1,499",
      period: "per month, billed " + (billingCycle === "annual" ? "annually" : "monthly"),
      description: "For restaurant chains, multi-venue franchises, agencies, and hospitality groups.",
      highlight: false,
      cta: "Start Business Trial ↗",
      ctaTo: "/register?plan=business",
      features: [
        "Everything in Pro Plan",
        "Up to 25 Distinct Location Hubs",
        "Staff Role Permissions & Multi-user",
        "Bulk Vector SVG Batch Export",
        "Custom CNAME Branded Domain",
        "Zero-Downtime SLA (99.99%)",
        "Dedicated VIP WhatsApp Support",
      ],
    },
  ];

  return (
    <div className="py-12 sm:py-20 bg-slate-50 font-sans selection:bg-[#d4f04d] selection:text-slate-950">
      {/* Header */}
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-800 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-[#d4f04d] animate-pulse" />
          <span>Simple, Transparent Pricing</span>
        </div>
        <h1 className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-tight">
          Invest Once. Save ₹35,000+ in Annual Reprints.
        </h1>
        <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Start for free, then upgrade when your shop needs custom logo embedding, Level-H vector SVG exports, and Google 5-star review boosters.
        </p>

        {/* Billing Cycle Toggle */}
        <div className="mt-8 inline-flex items-center rounded-full border border-slate-200 bg-white p-1.5 shadow-2xs">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer ${
              billingCycle === "monthly"
                ? "bg-slate-950 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`rounded-full px-5 py-2 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              billingCycle === "annual"
                ? "bg-slate-950 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            <span>Annual Billing</span>
            <span className="rounded-full bg-[#d4f04d] px-2 py-0.5 text-[9px] font-black uppercase text-slate-950">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-14 sm:mt-16">
        <div className="grid gap-8 lg:grid-cols-3 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.highlight
                  ? "bg-slate-950 text-white shadow-2xl border-2 border-slate-800 scale-100 lg:-translate-y-2"
                  : "bg-white text-slate-900 border border-slate-200/90 shadow-xs hover:shadow-lg"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-[#d4f04d] px-4 py-1 text-[11px] font-black uppercase tracking-wider text-slate-950 shadow-md">
                    ★ {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-black">{plan.name}</h3>
                  {!plan.highlight && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <p className={`mt-2 text-xs leading-relaxed ${plan.highlight ? "text-slate-300" : "text-slate-500"}`}>
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-4xl sm:text-5xl font-black tracking-tight">
                    {plan.price}
                  </span>
                  <span className={`text-xs ${plan.highlight ? "text-slate-400" : "text-slate-500"}`}>
                    /{plan.period}
                  </span>
                </div>

                <div className="my-6 border-t border-slate-200/20" />

                <ul className="space-y-3 text-xs sm:text-sm">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check
                        size={16}
                        className={`shrink-0 mt-0.5 ${
                          plan.highlight ? "text-[#d4f04d]" : "text-emerald-600"
                        }`}
                      />
                      <span className={plan.highlight ? "text-slate-200 font-medium" : "text-slate-700 font-medium"}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  to={plan.ctaTo}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 px-6 text-xs font-black transition-all active:scale-95 cursor-pointer shadow-md ${
                    plan.highlight
                      ? "bg-[#d4f04d] hover:bg-[#c4e436] text-slate-950"
                      : "bg-slate-950 hover:bg-slate-800 text-white"
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
