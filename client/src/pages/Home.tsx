import {
  ArrowRight,
  ArrowUpDown,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  ImagePlus,
  Link2,
  Loader2,
  QrCode,
  RefreshCw,
  ScanLine,
  Smartphone,
  Sparkles,
  Store,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Brand from "../components/Brand";
import { useAuth } from "../context/AuthContext";
import { useQr } from "../hooks/useQr";
import { getLinkType } from "../lib/linkTypes";
import { brandBtn, primaryBtn, secondaryBtn } from "../lib/ui";

const SAMPLE_QR_URL = "https://qrfolio.io/p/artisan-bakery";

const STEPS = [
  {
    step: "01",
    Icon: Store,
    title: "Create Your QrFolio Hub",
    text: "Set up your brand profile with custom colors, logo, bio, and all the links your customers care about.",
  },
  {
    step: "02",
    Icon: QrCode,
    title: "Generate Smart Dynamic QR",
    text: "Get your high-definition QR code with embedded brand badge in vector SVG or high-res PNG formats.",
  },
  {
    step: "03",
    Icon: ScanLine,
    title: "Print Once, Update Forever",
    text: "Place your QR on menus, storefronts, packaging, or business cards. Update your links anytime without reprinting.",
  },
];

const FEATURES = [
  {
    Icon: RefreshCw,
    title: "Dynamic Smart Routing",
    text: "Your QR code stays permanent while your links can change in seconds. Never waste reprint costs on outdated links.",
  },
  {
    Icon: ImagePlus,
    title: "Branded Center Badging",
    text: "Seamlessly embed your business logo inside your QR code with level-H error correction for instant scan reliability.",
  },
  {
    Icon: Link2,
    title: "Unlimited Curated Links",
    text: "Connect Instagram, Google Maps, WhatsApp ordering, Yelp/Google reviews, menu PDFs, payment links, and booking sites.",
  },
  {
    Icon: ArrowUpDown,
    title: "Instant Reordering & Toggles",
    text: "Highlight daily specials, seasonal promotions, or switch temporary links on/off with a single tap.",
  },
  {
    Icon: Smartphone,
    title: "Ultra-Fast Mobile Bio Page",
    text: "Lightning-fast, thumb-friendly landing pages designed specifically for smartphone cameras and QR scanners.",
  },
  {
    Icon: BarChart3,
    title: "Zero-PII Analytics",
    text: "Track total scans, daily visitor trends, and link click performance without storing intrusive personal tracking cookies.",
  },
];

const PRESET_DEMOS = [
  {
    id: "cafe",
    name: "Artisan Roastery & Cafe",
    category: "Specialty Coffee & Bakery",
    bio: "Freshly roasted specialty beans & handcrafted pastries baked fresh every morning in Downtown.",
    initial: "A",
    color: "from-[#467359] to-[#69bd92]",
    badgeColor: "bg-[#467359]",
    links: [
      { icon: "instagram", title: "Instagram @ArtisanRoast", sub: "Daily roasts & behind the scenes" },
      { icon: "google-maps", title: "Find us on Google Maps", sub: "142 Pine Street, Downtown" },
      { icon: "google-reviews", title: "Review us on Google (4.9 ★)", sub: "Read 280+ customer reviews" },
      { icon: "whatsapp", title: "Order ahead on WhatsApp", sub: "Skip the morning queue" },
      { icon: "menu", title: "Seasonal Food & Drink Menu", sub: "Updated Spring 2026" },
    ],
  },
  {
    id: "studio",
    name: "Lumina Design Studio",
    category: "Branding & Digital Agency",
    bio: "We craft thoughtful digital brand identities, responsive web platforms, and design systems for innovators.",
    initial: "L",
    color: "from-[#355d48] to-[#70a087]",
    badgeColor: "bg-[#467359]",
    links: [
      { icon: "website", title: "Explore Design Portfolio", sub: "Selected case studies & client work" },
      { icon: "instagram", title: "Follow our design feed", sub: "UI/UX & typography inspiration" },
      { icon: "calendar", title: "Book a 30-min Discovery Call", sub: "Check open consultation slots" },
      { icon: "email", title: "hello@luminastudio.design", sub: "Inquire for new projects" },
    ],
  },
  {
    id: "salon",
    name: "Velvet & Co. Hair Bar",
    category: "Luxury Hair & Beauty Salon",
    bio: "Organic hair care, bespoke balayage, precision styling, and luxury head spa treatments.",
    initial: "V",
    color: "from-[#6dae8c] to-[#467359]",
    badgeColor: "bg-[#6dae8c]",
    links: [
      { icon: "booking", title: "Book Online Appointment", sub: "Select stylist & service time" },
      { icon: "instagram", title: "Stylist Portfolio & Reels", sub: "Before & after transformations" },
      { icon: "phone", title: "+1 (555) 432-9800", sub: "Call front desk directly" },
      { icon: "google-reviews", title: "Read 5-Star Reviews", sub: "Rated #1 salon in Midtown" },
    ],
  },
];

const FAQS = [
  {
    q: "How does a dynamic QR code work?",
    a: "Your QrFolio QR code encodes a permanent, smart URL for your business page. When customers scan it, our system instantly displays your latest active links. You can add, edit, reorder, or remove links from your dashboard anytime, and the printed QR code remains 100% active.",
  },
  {
    q: "Do I need to reprint my QR code if I update my menu or social links?",
    a: "Never! That is the core superpower of QrFolio. You can change your website, WhatsApp number, Instagram handle, or daily menu link at 2:00 PM, and anyone scanning the QR code on your table at 2:01 PM will immediately see the updated links.",
  },
  {
    q: "Will QrFolio QR codes scan reliably on every phone?",
    a: "Yes. All QR codes are generated with Level-H (High) Reed-Solomon error correction. This ensures that even with a center brand logo badge or minor physical scratches on printed materials, modern iPhone and Android cameras scan them effortlessly in milliseconds.",
  },
  {
    q: "What download formats are available for printing?",
    a: "You can download high-resolution PNG files for social media and tabletop inserts, or vector SVG files for large-scale outdoor signage, window vinyls, billboards, and banners with zero loss in sharpness.",
  },
  {
    q: "Is there any limit to the number of links I can add?",
    a: "No. You can add unlimited links, organize them by priority, and temporarily toggle off inactive links whenever you want.",
  },
  {
    q: "How does QrFolio protect customer privacy?",
    a: "We practice zero-PII tracking. We only count aggregate scan counts and link click metrics. We never record personal identifiers, names, GPS coordinates, or intrusive device fingerprints.",
  },
];

function SectionHeading({
  badge,
  title,
  subtitle,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {badge && (
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#b7dbc4] bg-[#e3f7e6] px-3 py-1 text-xs font-semibold text-[#355d48] backdrop-blur-xs">
          <Sparkles size={12} className="text-[#69bd92]" />
          {badge}
        </span>
      )}
      <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#284737] sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base text-[#43745b] sm:text-lg leading-relaxed">{subtitle}</p>}
    </div>
  );
}

function SampleQr() {
  const { qr, error } = useQr(SAMPLE_QR_URL, "");
  return (
    <div className="relative h-64 w-64 p-3 bg-white rounded-3xl shadow-xl border border-[#b7dbc4]/80 ring-1 ring-[#284737]/5 group hover:scale-[1.02] transition-transform duration-300">
      {qr ? (
        <>
          <img src={qr.pngDataUrl} alt="Sample QR code" className="h-full w-full rounded-2xl" />
          {/* Logo badge in center with sage gradient */}
          <div className="absolute left-1/2 top-1/2 flex h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-white shadow-md ring-2 ring-[#e3f7e6]">
            <div className="flex h-[78%] w-[78%] items-center justify-center rounded-xl bg-gradient-to-tr from-[#467359] to-[#69bd92] font-extrabold text-white text-xs shadow-xs">
              Q
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#f0f3f0] text-sm text-[#70a087]">
          {error ? "Sample unavailable" : <Loader2 className="animate-spin text-[#467359]" />}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [activeDemo, setActiveDemo] = useState(0);
  const currentDemo = PRESET_DEMOS[activeDemo];

  const cta = user
    ? { to: "/dashboard", label: "Open Dashboard" }
    : { to: "/register", label: "Get Started Free" };

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-[#43745b] selection:bg-[#69bd92] selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-[#b7dbc4]/60 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Brand size="md" showBadge />

          <nav className="hidden items-center gap-7 text-sm font-medium text-[#43745b] md:flex">
            <a href="#how-it-works" className="hover:text-[#284737] transition-colors">
              How it works
            </a>
            <a href="#features" className="hover:text-[#284737] transition-colors">
              Features
            </a>
            <a href="#demo" className="hover:text-[#284737] transition-colors">
              Live Demo
            </a>
            <a href="#pricing" className="hover:text-[#284737] transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-[#284737] transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {!user && (
              <Link
                to="/login"
                className="hidden sm:inline-flex px-3 py-2 text-sm font-medium text-[#43745b] hover:text-[#284737] transition-colors"
              >
                Log in
              </Link>
            )}
            <Link to={cta.to} className={brandBtn}>
              {user ? "Dashboard" : "Claim Your QR"}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
          {/* Ambient sage & mint background light */}
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/4 h-[550px] w-[800px] rounded-full bg-gradient-to-tr from-[#dff6e2]/80 via-[#e3f7e6]/50 to-[#b7dbc4]/40 blur-3xl" />

          <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
            {/* Top Announcement Pill */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b7dbc4] bg-white/95 px-4 py-1.5 text-xs font-semibold text-[#284737] shadow-xs backdrop-blur-md animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-[#69bd92] animate-pulse" />
              <span>Next-Gen Dynamic QR & Bio Link Hub</span>
              <span className="rounded-full bg-[#e3f7e6] px-2 py-0.5 text-[10px] text-[#355d48] font-bold">v2.0</span>
            </div>

            {/* Hero Heading */}
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#284737] sm:text-6xl sm:leading-[1.12]">
              One Smart QR. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#467359] via-[#6dae8c] to-[#69bd92] bg-clip-text text-transparent">
                Your Complete Digital Presence.
              </span>
            </h1>

            {/* Hero Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#43745b] sm:text-xl leading-relaxed">
              Generate high-resolution dynamic QR codes with your custom logo. Connect customers directly to your menus,
              Instagram, Google reviews, WhatsApp, and booking links in a single scan.
            </p>

            {/* Dual CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link to={cta.to} className={`${brandBtn} !px-6 !py-3.5 !text-base shadow-lg shadow-[#69bd92]/30`}>
                {cta.label}
                <ArrowRight size={18} />
              </Link>
              <a href="#demo" className={`${secondaryBtn} !px-6 !py-3.5 !text-base`}>
                Explore Live Demo
              </a>
            </div>

            {/* Micro Highlights Banner */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-[#43745b]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[#69bd92]" />
                No reprint needed when links change
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[#69bd92]" />
                Instant camera scan on all phones
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[#69bd92]" />
                Zero tracking cookies / 100% private
              </span>
            </div>

            {/* Hero Visual Mockup Grid */}
            <div className="mt-14 mx-auto max-w-4xl rounded-3xl border border-[#b7dbc4]/80 bg-white/85 p-4 sm:p-8 shadow-[0_12px_40px_rgba(70,115,89,0.08)] backdrop-blur-md">
              <div className="grid items-center gap-8 md:grid-cols-2">
                {/* QR Interactive showcase */}
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="relative">
                    <SampleQr />
                    <div className="absolute -bottom-3 -right-3 rounded-xl bg-[#284737] px-3 py-1 text-xs font-medium text-white shadow-lg flex items-center gap-1.5">
                      <Sparkles size={12} className="text-[#69bd92]" /> Dynamic Link
                    </div>
                  </div>
                  <p className="mt-5 font-mono text-xs text-[#70a087]">qrfolio.io/p/artisan-bakery</p>
                </div>

                {/* Hero Feature Highlights Column */}
                <div className="space-y-4 text-left">
                  <div className="rounded-2xl border border-[#b7dbc4]/60 bg-[#e3f7e6]/40 p-4 transition-all hover:bg-white hover:shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e3f7e6] text-[#467359]">
                        <RefreshCw size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#284737]">Never Reprint Again</h4>
                        <p className="text-xs text-[#43745b]">Change any link instantly from your phone or laptop.</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#b7dbc4]/60 bg-[#e3f7e6]/40 p-4 transition-all hover:bg-white hover:shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#dff6e2] text-[#467359]">
                        <ImagePlus size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#284737]">Custom Brand Badge</h4>
                        <p className="text-xs text-[#43745b]">Your logo placed cleanly in the center of the QR code.</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#b7dbc4]/60 bg-[#e3f7e6]/40 p-4 transition-all hover:bg-white hover:shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#b7dbc4]/50 text-[#355d48]">
                        <BarChart3 size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#284737]">Real-Time Scan Stats</h4>
                        <p className="text-xs text-[#43745b]">Know how many customers scan and click your links daily.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section id="how-it-works" className="border-y border-[#b7dbc4]/70 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <SectionHeading
              badge="Seamless Workflow"
              title="From Setup to Scan in 3 Minutes"
              subtitle="Get your modern business hub live in three frictionless steps."
            />

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {STEPS.map(({ step, Icon, title, text }) => (
                <div
                  key={title}
                  className="relative rounded-3xl border border-[#b7dbc4]/70 bg-[#f0f3f0]/50 p-8 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#69bd92] hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#284737] to-[#467359] text-white shadow-sm">
                      <Icon size={22} />
                    </div>
                    <span className="font-display text-2xl font-black text-[#b7dbc4]">{step}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-[#284737]">{title}</h3>
                  <p className="mt-2 text-sm text-[#43745b] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <SectionHeading
              badge="Built for Modern Businesses"
              title="Everything You Need. Pure Elegance."
              subtitle="Engineered to provide the smoothest scanning and link management experience."
            />

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ Icon, title, text }) => (
                <div
                  key={title}
                  className="group rounded-3xl border border-[#b7dbc4]/70 bg-white p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#69bd92] hover:shadow-lg hover:shadow-[#467359]/10"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e3f7e6] text-[#467359] transition-colors group-hover:bg-[#467359] group-hover:text-white">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-[#284737]">{title}</h3>
                  <p className="mt-2 text-sm text-[#43745b] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Live Demo Preview Section (Sage Dark Container) */}
        <section id="demo" className="border-t border-[#b7dbc4]/70 bg-[#284737] py-20 sm:py-28 text-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#69bd92]/40 bg-[#69bd92]/15 px-3 py-1 text-xs font-semibold text-[#dff6e2]">
                <Smartphone size={13} /> Interactive Simulator
              </span>
              <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                See What Your Customers Experience
              </h2>
              <p className="mt-4 text-[#dff6e2]/90 text-base sm:text-lg">
                Choose an industry below to see how your branded bio-link page renders on mobile devices.
              </p>
            </div>

            {/* Preset Business Switcher Pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {PRESET_DEMOS.map((demo, idx) => (
                <button
                  key={demo.id}
                  onClick={() => setActiveDemo(idx)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    activeDemo === idx
                      ? "bg-white text-[#284737] shadow-md scale-105"
                      : "bg-[#355d48] text-[#dff6e2] hover:bg-[#467359] hover:text-white"
                  }`}
                >
                  {demo.name}
                </button>
              ))}
            </div>

            {/* Mobile Device Frame */}
            <div className="mt-12 flex justify-center">
              <div className="w-full max-w-xs rounded-[3rem] border-[10px] border-[#1e3529] bg-[#1e3529] p-4 shadow-2xl ring-1 ring-[#b7dbc4]/20">
                {/* Phone speaker / camera notch */}
                <div className="mx-auto mb-4 h-4 w-28 rounded-full bg-[#284737]" />

                <div className="rounded-2xl bg-[#f4f4f4] p-5 text-[#43745b] min-h-[440px] flex flex-col justify-between">
                  <div>
                    {/* Business Header */}
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr ${currentDemo.color} text-2xl font-bold text-white shadow-md`}
                      >
                        {currentDemo.initial}
                      </div>
                      <h4 className="mt-3 font-bold text-base text-[#284737] leading-tight">
                        {currentDemo.name}
                      </h4>
                      <p className="text-[11px] font-medium text-[#70a087] mt-0.5">{currentDemo.category}</p>
                      <p className="mt-2 text-xs text-[#43745b] leading-normal">{currentDemo.bio}</p>
                    </div>

                    {/* Link list */}
                    <div className="mt-5 space-y-2">
                      {currentDemo.links.map((link) => {
                        const { Icon } = getLinkType(link.icon);
                        return (
                          <div
                            key={link.title}
                            className="flex items-center gap-2.5 rounded-xl border border-[#b7dbc4]/80 bg-white p-2.5 shadow-2xs transition-all hover:bg-[#e3f7e6] cursor-pointer"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e3f7e6] text-[#467359] shadow-2xs">
                              <Icon size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-[#284737]">{link.title}</p>
                              <p className="truncate text-[10px] text-[#70a087]">{link.sub}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <p className="mt-4 text-center text-[10px] font-medium text-[#70a087]">
                    Powered by <span className="font-bold text-[#284737]">QrFolio</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link to={cta.to} className={brandBtn}>
                Create Your Own Business Hub Now
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <SectionHeading
              badge="Transparent Pricing"
              title="Start Free. Scale as You Grow."
              subtitle="Everything essential to launch your dynamic QR code and business bio hub."
            />

            <div className="mx-auto mt-14 grid max-w-3xl gap-8 md:grid-cols-2">
              {/* Free Tier Card */}
              <div className="relative rounded-3xl border-2 border-[#467359] bg-white p-8 shadow-xl">
                <div className="absolute -top-3.5 right-6 rounded-full bg-[#467359] px-3 py-0.5 text-xs font-semibold text-white">
                  Most Popular
                </div>
                <h3 className="font-display text-xl font-bold text-[#284737]">Starter Free</h3>
                <p className="mt-1 text-sm text-[#70a087]">Perfect for local businesses & creators</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-extrabold text-[#284737]">$0</span>
                  <span className="text-sm font-medium text-[#70a087]">/ forever free</span>
                </div>

                <ul className="mt-8 space-y-3.5">
                  <li className="flex items-center gap-3 text-sm text-[#43745b]">
                    <Check size={18} className="text-[#69bd92] shrink-0" />
                    Branded bio page with custom logo
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#43745b]">
                    <Check size={18} className="text-[#69bd92] shrink-0" />
                    Unlimited active social & service links
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#43745b]">
                    <Check size={18} className="text-[#69bd92] shrink-0" />
                    Dynamic permanent QR code
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#43745b]">
                    <Check size={18} className="text-[#69bd92] shrink-0" />
                    High-res PNG & vector SVG downloads
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#43745b]">
                    <Check size={18} className="text-[#69bd92] shrink-0" />
                    Scan counts & link click analytics
                  </li>
                </ul>

                <Link to={cta.to} className={`${primaryBtn} mt-8 w-full !py-3`}>
                  {user ? "Go to Dashboard" : "Get Started Free"}
                </Link>
              </div>

              {/* Pro Roadmap Card */}
              <div className="rounded-3xl border border-[#b7dbc4]/70 bg-white/70 p-8 shadow-xs">
                <span className="rounded-full bg-[#e3f7e6] px-2.5 py-1 text-[11px] font-semibold text-[#355d48]">
                  Coming Soon
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-[#284737]">Pro & Multi-Location</h3>
                <p className="mt-1 text-sm text-[#70a087]">For multi-venue brands & agencies</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-extrabold text-[#a5afa9]">$9</span>
                  <span className="text-sm font-medium text-[#a5afa9]">/ month</span>
                </div>

                <ul className="mt-8 space-y-3.5 text-[#70a087]">
                  <li className="flex items-center gap-3 text-sm">
                    <Check size={18} className="text-[#69bd92] shrink-0" />
                    Multiple business profiles per account
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check size={18} className="text-[#69bd92] shrink-0" />
                    Custom custom domain support (qr.yourbrand.com)
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check size={18} className="text-[#69bd92] shrink-0" />
                    Advanced geographic & referral analytics
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check size={18} className="text-[#69bd92] shrink-0" />
                    Custom color theme & font builder
                  </li>
                </ul>

                <button disabled className={`${secondaryBtn} mt-8 w-full !py-3 cursor-not-allowed opacity-60`}>
                  Join Pro Waitlist
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="border-t border-[#b7dbc4]/70 bg-white/60 py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <SectionHeading
              badge="Got Questions?"
              title="Frequently Asked Questions"
              subtitle="Everything you need to know about dynamic QR codes and QrFolio."
            />

            <div className="mt-12 space-y-3.5">
              {FAQS.map(({ q, a }) => (
                <details
                  key={q}
                  className="group rounded-2xl border border-[#b7dbc4]/70 bg-white p-5 shadow-xs transition-all [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-[#284737] text-base">
                    <span>{q}</span>
                    <ChevronDown
                      size={18}
                      className="shrink-0 text-[#70a087] transition-transform duration-200 group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-3.5 text-sm text-[#43745b] leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Banner (Forest/Sage Theme) */}
        <section className="relative overflow-hidden bg-[#284737] py-20 text-white">
          {/* Subtle glow accent */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-[#69bd92]/20 blur-3xl" />

          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
              Elevate Your Customer Journey Today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-[#dff6e2]/90">
              Join thousands of businesses who use QrFolio to deliver seamless, branded QR scan experiences.
            </p>
            <div className="mt-8 flex justify-center">
              <Link to={cta.to} className={`${brandBtn} !px-7 !py-4 !text-base shadow-xl shadow-[#69bd92]/30`}>
                {cta.label} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#b7dbc4]/60 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Brand size="md" />

            <nav className="flex flex-wrap justify-center gap-6 text-sm text-[#43745b]">
              <a href="#how-it-works" className="hover:text-[#284737] transition-colors">
                How it works
              </a>
              <a href="#features" className="hover:text-[#284737] transition-colors">
                Features
              </a>
              <a href="#demo" className="hover:text-[#284737] transition-colors">
                Demo
              </a>
              <a href="#pricing" className="hover:text-[#284737] transition-colors">
                Pricing
              </a>
              <a href="#faq" className="hover:text-[#284737] transition-colors">
                FAQ
              </a>
              {!user && (
                <Link to="/login" className="hover:text-[#284737] font-semibold transition-colors">
                  Log in
                </Link>
              )}
            </nav>

            <p className="text-xs text-[#70a087]">
              © {new Date().getFullYear()} QrFolio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
