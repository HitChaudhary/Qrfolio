import {
  ArrowRight, ArrowUpDown, BarChart3, Check, ChevronDown, ImagePlus, Link2,
  Loader2, QrCode, RefreshCw, ScanLine, Smartphone, Store,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQr } from "../hooks/useQr";
import { getLinkType } from "../lib/linkTypes";
import { primaryBtn, secondaryBtn } from "../lib/ui";

const SAMPLE_QR_URL = "https://linkqr.example/p/cafe-xyz";

const STEPS = [
  { Icon: Store, title: "Create your page", text: "Add your business name, logo and every link customers might need." },
  { Icon: QrCode, title: "Get your QR code", text: "Download it as PNG or SVG and put it on menus, windows, receipts and packaging." },
  { Icon: ScanLine, title: "Customers scan", text: "They land on one clean page with all your links. Change them any time, the QR stays the same." },
];

const FEATURES = [
  { Icon: RefreshCw, title: "A QR that never changes", text: "Your QR holds only your page address, so you can edit links without reprinting anything." },
  { Icon: ImagePlus, title: "Branded with your logo", text: "Your logo sits in the center on a clean white badge, sized to keep scanning reliable." },
  { Icon: Link2, title: "Unlimited links", text: "Instagram, Google Maps, reviews, WhatsApp, menu, booking, phone, email or any custom URL." },
  { Icon: ArrowUpDown, title: "Reorder and switch off", text: "Put the most important link first, and hide a link temporarily without deleting it." },
  { Icon: Smartphone, title: "Built for phones", text: "A fast, mobile-first page that customers can use with one thumb. No app to install." },
  { Icon: BarChart3, title: "Simple analytics", text: "See total, daily and monthly scans, and which links get clicked. No personal data stored." },
];

const DEMO_LINKS = [
  { icon: "instagram", title: "Instagram" },
  { icon: "google-maps", title: "Find us on Google Maps" },
  { icon: "google-reviews", title: "Leave a Google review" },
  { icon: "whatsapp", title: "Order on WhatsApp" },
  { icon: "menu", title: "View our menu" },
];

const FAQS = [
  { q: "What happens when I change my links?", a: "Nothing changes for your QR. It only contains your page address, so customers who scan it always see your latest links." },
  { q: "Do I need to reprint my QR code if I update my links?", a: "No. Update your links in the dashboard and the QR you already printed keeps working. The only exception is changing your page address itself, which we warn you about." },
  { q: "Is the number of links limited?", a: "No. Add as many links as you like, reorder them, and switch individual links on or off." },
  { q: "Will it scan with any phone?", a: "Yes. It's a standard QR code that works with the built-in camera on current iPhone and Android phones. It uses the highest error correction level so the center logo doesn't get in the way." },
  { q: "What file formats can I download?", a: "PNG for printing and sharing, and SVG for signage and large formats where you need it to stay sharp at any size." },
  { q: "Do you track the people who scan?", a: "No. We only keep counts: total scans, scans per day and clicks per link. We don't store names, devices or locations." },
];

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-3 text-slate-600">{subtitle}</p>}
    </div>
  );
}

function Section({ id, className = "", children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-20 ${className}`}>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">{children}</div>
    </section>
  );
}

function SampleQr() {
  const { qr, error } = useQr(SAMPLE_QR_URL, "");
  return (
    <div className="relative h-64 w-64">
      {qr ? (
        <>
          <img src={qr.pngDataUrl} alt="Sample QR code" className="h-full w-full rounded-xl" />
          {/* Same proportions as the real QR: logo badge is 22% of the width */}
          <div className="absolute left-1/2 top-1/2 flex h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-white">
            <div className="flex h-[78%] w-[78%] items-center justify-center rounded-lg bg-amber-700 font-semibold text-white">C</div>
          </div>
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">
          {error ? "Sample unavailable" : <Loader2 className="animate-spin" />}
        </div>
      )}
    </div>
  );
}

function PhoneMock() {
  return (
    <div className="mx-auto w-64 rounded-[2.5rem] border-[10px] border-slate-900 bg-slate-50 px-4 pb-6 pt-8 shadow-xl">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-700 text-xl font-semibold text-white ring-4 ring-white">C</div>
        <p className="mt-3 font-semibold">Cafe XYZ</p>
        <p className="text-xs text-slate-500">Cafe &amp; bakery</p>
        <p className="mt-2 text-xs text-slate-600">Fresh coffee and pastries, baked every morning.</p>
      </div>
      <ul className="mt-5 space-y-2">
        {DEMO_LINKS.map((l) => {
          const { Icon } = getLinkType(l.icon);
          return (
            <li key={l.icon} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-medium shadow-sm ring-1 ring-slate-200">
              <Icon size={14} className="text-slate-600" /> {l.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PlanFeature({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <Check size={16} className="mt-0.5 shrink-0 text-emerald-600" />
      {children}
    </li>
  );
}

export default function Home() {
  const { user } = useAuth();
  const cta = user ? { to: "/dashboard", label: "Go to dashboard" } : { to: "/register", label: "Create Your QR" };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <a href="#top" className="flex items-center gap-2 font-semibold">
            <span className="rounded-lg bg-slate-900 p-1.5 text-white"><QrCode size={18} /></span>
            LinkQR
          </a>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a href="#how-it-works" className="hover:text-slate-900">How it works</a>
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#pricing" className="hover:text-slate-900">Pricing</a>
            <a href="#faq" className="hover:text-slate-900">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            {!user && <Link to="/login" className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900">Log in</Link>}
            <Link to={cta.to} className={primaryBtn}>{user ? cta.label : "Get started"}</Link>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-4 pb-16 pt-16 text-center sm:pt-24">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            One QR. Everything your business offers.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Create a branded QR code that connects customers to your website, Instagram, Google Maps, WhatsApp, menu, reviews, and any other link you choose.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to={cta.to} className={`${primaryBtn} !px-5 !py-3 !text-base`}>
              {cta.label} <ArrowRight size={18} />
            </Link>
            <a href="#demo" className={`${secondaryBtn} !px-5 !py-3 !text-base`}>See Demo</a>
          </div>
          <p className="mt-4 text-sm text-slate-500">Free to start. Customers don't need to install anything.</p>
        </section>

        {/* How it works */}
        <Section id="how-it-works" className="bg-slate-50">
          <SectionHeading title="How it works" subtitle="From sign-up to a printed QR in a few minutes." />
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map(({ Icon, title, text }, i) => (
              <li key={title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">{i + 1}</span>
                  <Icon size={20} className="text-slate-500" />
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{text}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* Features */}
        <Section id="features">
          <SectionHeading title="Everything you need, nothing you don't" />
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ Icon, title, text }) => (
              <div key={title}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><Icon size={20} /></div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* QR preview */}
        <Section id="qr-preview" className="bg-slate-50">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">A QR code people can actually scan</h2>
              <p className="mt-3 text-slate-600">
                Your logo goes in the center, but never at the cost of reliability.
              </p>
              <ul className="mt-6 space-y-3">
                <PlanFeature>Highest error correction, so the logo badge doesn't affect scanning</PlanFeature>
                <PlanFeature>High-resolution PNG for print, SVG for signage and large formats</PlanFeature>
                <PlanFeature>Contains only your page address, so it never goes out of date</PlanFeature>
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><SampleQr /></div>
              <p className="mt-3 text-xs text-slate-500">Sample only: linkqr.example/p/cafe-xyz</p>
            </div>
          </div>
        </Section>

        {/* Example business */}
        <Section id="demo">
          <SectionHeading title="What your customers see" subtitle="One clean page, all your links, on any phone." />
          <div className="mt-12"><PhoneMock /></div>
          <div className="mt-10 text-center">
            <Link to={cta.to} className={primaryBtn}>Build your own page <ArrowRight size={16} /></Link>
          </div>
        </Section>

        {/* Pricing */}
        <Section id="pricing" className="bg-slate-50">
          <SectionHeading title="Pricing" subtitle="Start free. Paid plans are on the way." />
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-2 ring-slate-900">
              <h3 className="font-semibold">Free</h3>
              <p className="mt-1 text-3xl font-semibold">Free</p>
              <p className="text-sm text-slate-500">Everything to get started</p>
              <ul className="mt-6 space-y-3">
                <PlanFeature>Business page with your logo</PlanFeature>
                <PlanFeature>Unlimited links</PlanFeature>
                <PlanFeature>Dynamic QR with your logo</PlanFeature>
                <PlanFeature>PNG and SVG downloads</PlanFeature>
                <PlanFeature>Scan and click analytics</PlanFeature>
              </ul>
              <Link to={cta.to} className={`${primaryBtn} mt-6 w-full`}>{user ? cta.label : "Get started free"}</Link>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="font-semibold">Pro</h3>
              <p className="mt-1 text-3xl font-semibold text-slate-400">Coming soon</p>
              <p className="text-sm text-slate-500">For growing businesses</p>
              <ul className="mt-6 space-y-3 text-slate-600">
                <PlanFeature>Multiple business pages</PlanFeature>
                <PlanFeature>Custom domain</PlanFeature>
                <PlanFeature>Advanced analytics</PlanFeature>
              </ul>
              <button disabled className={`${secondaryBtn} mt-6 w-full`}>Coming soon</button>
            </div>
          </div>
        </Section>

        {/* FAQ */}
        <Section id="faq">
          <SectionHeading title="Frequently asked questions" />
          <div className="mx-auto mt-10 max-w-2xl space-y-3">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group rounded-xl bg-white p-4 ring-1 ring-slate-200">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                  {q}
                  <ChevronDown size={18} className="shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-slate-600">{a}</p>
              </details>
            ))}
          </div>
        </Section>

        {/* CTA */}
        <section className="bg-slate-900 text-white">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Put your whole business behind one QR</h2>
            <p className="mt-3 text-slate-300">Set it up once, update it whenever you like.</p>
            <Link to={cta.to} className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-medium text-slate-900 hover:bg-slate-100">
              {cta.label} <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row">
          <span className="flex items-center gap-2 font-semibold text-slate-900">
            <span className="rounded-lg bg-slate-900 p-1 text-white"><QrCode size={14} /></span>
            LinkQR
          </span>
          <nav className="flex flex-wrap justify-center gap-5">
            <a href="#how-it-works" className="hover:text-slate-900">How it works</a>
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#pricing" className="hover:text-slate-900">Pricing</a>
            <a href="#faq" className="hover:text-slate-900">FAQ</a>
            {!user && <Link to="/login" className="hover:text-slate-900">Log in</Link>}
          </nav>
          <span>© {new Date().getFullYear()} LinkQR</span>
        </div>
      </footer>
    </div>
  );
}
