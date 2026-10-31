import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ImagePlus,
  Loader2,
  RefreshCw,
  ScanLine,
  Smartphone,
  Sparkles,
  Store,
  BarChart3,
  ChevronDown,
  ChevronRight,
  QrCode,
  ShieldCheck,
  TrendingUp,
  Zap,
  Globe,
  Activity,
  Layers,
  Utensils,
  Star,
  MessageCircle,
  Clock,
  Printer,
  Search,
  Check,
  Copy,
  ExternalLink,
  Wifi,
  MapPin,
  Calendar,
  Instagram,
  Phone,
  Mail,
  Share2,
} from "lucide-react";
import { QrfolioIconMark } from "../components/QrfolioLogo";
import PartnerLogoLoop from "../components/landing/PartnerLogoLoop";
import {
  GoogleLogo,
  WhatsAppLogo,
  InstagramLogo,
  GoogleMapsLogo,
  WebsiteLogo,
  BrandLogo,
} from "../components/BrandLogos";
import { useAuth } from "../context/AuthContext";
import { useQr } from "../hooks/useQr";

const SAMPLE_QR_URL = "https://qrfolio.io/p/nilkanth-cafe";

const PRESET_DEMOS = [
  {
    id: "nilkanth-cafe",
    name: "Nilkanth Cafe",
    category: "Specialty Tea, Snacks & Bakery",
    bio: "Famous Kadak Masala Chai, Handcrafted Maska Bun, Fresh Sandwiches & Cold Cocoa in Ahmedabad.",
    location: "SG Highway, Bodakdev • Ahmedabad • Open 7 AM - 11 PM",
    announcement: "☕ Special Today: Fresh Kesar Elaichi Maska Bun & Chilled Cold Cocoa!",
    initial: "☕",
    color: "from-amber-500 to-orange-500",
    badgeColor: "bg-amber-500",
    links: [
      {
        icon: "google-reviews",
        title: "Rate Us 5★ on Google",
        sub: "Rated 4.9/5 by 480+ local chai lovers",
        badge: "4.9 ★",
      },
      {
        icon: "whatsapp",
        title: "Order on WhatsApp / Quick Pickup",
        sub: "Direct counter order — skip the rush hour queue",
        badge: "Instant Chat",
      },
      {
        icon: "instagram",
        title: "Follow @NilkanthCafeOfficial",
        sub: "Behind-the-scenes chai brewing, reels & specials",
        badge: "Instagram",
      },
      {
        icon: "google-maps",
        title: "Directions to SG Highway Cafe",
        sub: "Opp. Pakwan Cross Road, Bodakdev • Free Parking",
        badge: "Open Now",
      },
      {
        icon: "website",
        title: "Digital Food & Beverage Menu",
        sub: "Chai, maskabun, puff, sandwiches & cold cocoa",
        badge: "Updated Today",
      },
      {
        icon: "website",
        title: "Connect to Guest WiFi",
        sub: "High-speed optical fiber • 1-tap connection",
        badge: "Free WiFi",
      },
    ],
  },
  {
    id: "shreeji-restaurant",
    name: "Shreeji Restaurant",
    category: "Authentic Gujarati Thali & Dining",
    bio: "Pure vegetarian traditional Gujarati Thali, Kathiyawadi specials & Punjabi delicacies.",
    location: "Kalawad Road • Rajkot • Lunch 11 AM - 3 PM | Dinner 7 PM - 11 PM",
    announcement: "🍲 Today's Special: Ringan No Olo, Bajra No Rotlo, Kaju Gathiya & Fresh Jalebi!",
    initial: "🍲",
    color: "from-rose-500 to-red-600",
    badgeColor: "bg-rose-500",
    links: [
      {
        icon: "google-reviews",
        title: "Leave a 5★ Google Review",
        sub: "1,250+ family dining reviews across Saurashtra",
        badge: "4.9 ★ (1.2k+)",
      },
      {
        icon: "whatsapp",
        title: "WhatsApp Table Booking & Parcel",
        sub: "Book family AC hall or advance parcel pickup",
        badge: "Instant Chat",
      },
      {
        icon: "instagram",
        title: "Instagram @ShreejiDining",
        sub: "Daily thali specials, festival dishes & reels",
        badge: "Instagram",
      },
      {
        icon: "google-maps",
        title: "Valet Parking & Location",
        sub: "Near Kotecha Chowk, Kalawad Road, Rajkot",
        badge: "Free Valet",
      },
      {
        icon: "website",
        title: "Daily Thali & Kathiyawadi Menu",
        sub: "Daily sabzi, rotla, dal-bhat, farsan & sweets",
        badge: "Live Menu",
      },
      {
        icon: "booking",
        title: "Banquet Hall & Catering Inquiry",
        sub: "Weddings, family get-togethers & business lunches",
        badge: "Catering",
      },
    ],
  },
  {
    id: "shree-krishna-salon",
    name: "Shree Krishna Salon",
    category: "Hair Grooming & Beauty Spa",
    bio: "Professional hair styling, beard grooming, organic facial treatments & wedding grooming packages.",
    location: "CG Road, Navrangpura • Ahmedabad • Open 9 AM - 9 PM",
    announcement: "✂️ Festive Combo: Hair Spa & Charcoal Detox Beard Trim at special festive rates.",
    initial: "✂️",
    color: "from-teal-400 to-emerald-500",
    badgeColor: "bg-teal-400",
    links: [
      {
        icon: "google-reviews",
        title: "Read 5-Star Google Reviews",
        sub: "Voted #1 salon in Navrangpura with 520+ reviews",
        badge: "5.0 ★",
      },
      {
        icon: "whatsapp",
        title: "Book Stylist on WhatsApp",
        sub: "Direct appointment booking with master stylist",
        badge: "Direct Chat",
      },
      {
        icon: "instagram",
        title: "Stylist Lookbook & Hair Styles",
        sub: "Haircuts, beard trims & keratin transformations",
        badge: "22k Fans",
      },
      {
        icon: "google-maps",
        title: "Salon Location & Parking",
        sub: "Near Municipal Market, CG Road, Ahmedabad",
        badge: "Map & Hours",
      },
      {
        icon: "website",
        title: "Service Rate Card & Groom Packages",
        sub: "Haircut, facial, detan, hair spa & wedding packages",
        badge: "Rate Card",
      },
      {
        icon: "website",
        title: "Shop Professional Hair Products",
        sub: "L'Oréal, Schwarzkopf & organic beard oils",
        badge: "15% Off",
      },
    ],
  },
  {
    id: "patel-fashion-store",
    name: "Patel Fashion Store",
    category: "Traditional Ethnic Wear & Sarees",
    bio: "Designer Bandhani, Pure Silk Sarees, Bridal Lehengas & Kurta Sets for weddings and festivals.",
    location: "Ghod Dod Road, Surat • Open 10 AM - 9:30 PM",
    announcement: "✨ New Festive Wedding Collection: Handloom Patola & Bandhej Sarees now in stock.",
    initial: "👗",
    color: "from-purple-500 to-pink-500",
    badgeColor: "bg-purple-500",
    links: [
      {
        icon: "google-reviews",
        title: "Customer Reviews on Google",
        sub: "4.8/5 rating from 600+ happy brides & families",
        badge: "4.8 ★",
      },
      {
        icon: "whatsapp",
        title: "WhatsApp Catalog & Video Shopping",
        sub: "Request live video call to preview new saree arrivals",
        badge: "Video Call",
      },
      {
        icon: "instagram",
        title: "Follow @PatelFashionSurat",
        sub: "Daily new arrivals, festive sarees & client photos",
        badge: "Instagram",
      },
      {
        icon: "google-maps",
        title: "Store Location & Parking",
        sub: "Ghod Dod Road, Near Joggers Park, Surat",
        badge: "Open Today",
      },
      {
        icon: "website",
        title: "Browse Latest Lookbook Catalog",
        sub: "Festival collections, bridal sarees & kurtas",
        badge: "New Catalog",
      },
      {
        icon: "booking",
        title: "Book Bridal Consultation",
        sub: "Private bridal studio appointment with styling expert",
        badge: "VIP Slot",
      },
    ],
  },
  {
    id: "radhe-electronics",
    name: "Radhe Electronics",
    category: "Mobiles, Laptops & Appliances",
    bio: "Authorized retailer for Smartphones, Smart TVs, ACs & Laptops with 0% EMI financing.",
    location: "Alkapuri • Vadodara • Open 10 AM - 9 PM",
    announcement: "📱 Smartphone Festival: Flat ₹2,000 off on select 5G phones + Free tempered glass!",
    initial: "📱",
    color: "from-blue-500 to-indigo-600",
    badgeColor: "bg-blue-500",
    links: [
      {
        icon: "google-reviews",
        title: "Rate Us 5★ on Google",
        sub: "Trusted electronics store in Vadodara since 2012",
        badge: "4.9 ★",
      },
      {
        icon: "whatsapp",
        title: "Check Price & Stock on WhatsApp",
        sub: "Instant quotation & model availability",
        badge: "Instant Chat",
      },
      {
        icon: "instagram",
        title: "Instagram @RadheElectronics",
        sub: "Unboxing reels, gadget reviews & festive discounts",
        badge: "Daily Deals",
      },
      {
        icon: "google-maps",
        title: "Store Location & Parking",
        sub: "RC Dutt Road, Alkapuri, Vadodara",
        badge: "Visit Store",
      },
      {
        icon: "website",
        title: "Latest Price List & EMI Offers",
        sub: "Check Bajaj Finserv & credit card 0% EMI",
        badge: "EMI Rates",
      },
      {
        icon: "booking",
        title: "Home Delivery & AC Installation",
        sub: "Same-day delivery across Vadodara city limits",
        badge: "Fast Delivery",
      },
    ],
  },
  {
    id: "k-one-studio",
    name: "K One Studio",
    category: "Wedding Photography & Cinema",
    bio: "Candid wedding photography, cinematic pre-wedding shoots, and corporate brand films across India.",
    location: "VIP Road, Vesu • Surat, Gujarat • Available Worldwide",
    announcement: "🎬 Wedding Season Dates Open: Pre-wedding shoots & cinematic 4K video bookings.",
    initial: "📸",
    color: "from-cyan-500 to-blue-600",
    badgeColor: "bg-cyan-500",
    links: [
      {
        icon: "google-reviews",
        title: "Verified Client Reviews",
        sub: "5.0 ★ rating from 250+ couples & wedding families",
        badge: "5.0 ★",
      },
      {
        icon: "whatsapp",
        title: "WhatsApp Date & Price Inquiry",
        sub: "Check availability for your wedding dates",
        badge: "Direct Chat",
      },
      {
        icon: "instagram",
        title: "Portfolio on Instagram @KOneStudio",
        sub: "Cinematic wedding reels & candid portrait gallery",
        badge: "35k Fans",
      },
      {
        icon: "google-maps",
        title: "Visit Studio in Vesu",
        sub: "VIP Road, Vesu, Surat, Gujarat",
        badge: "Studio Pin",
      },
      {
        icon: "website",
        title: "View High-Res Photography Portfolio",
        sub: "Cinematic films, pre-wedding & album samples",
        badge: "Portfolio",
      },
      {
        icon: "booking",
        title: "Book Studio Consultation",
        sub: "Discuss packages, dates & drone cinema options",
        badge: "Book Slot",
      },
    ],
  },
];

const FAQS_TEASER = [
  {
    q: "What is QRfolio, and how does it help my business in India?",
    a: "Normally, if you print a standard free QR code on acrylic table stands, billing counters, or menus, the destination link is permanently frozen in the black-and-white pixels. If your food prices, WhatsApp number, UPI ID, or Instagram change, you must discard all your printed materials and pay thousands of rupees to reprint them. QRfolio solves this with a Smart Dynamic QR Code: you print it once on your counter or table, and you can update links, menus, and offers anytime from your phone in 10 seconds. The printed QR code never changes and works forever.",
  },
  {
    q: "Does my customer need to download any special app to scan it?",
    a: "No app download is needed! Customers simply open their regular smartphone camera (Google Lens, iPhone Camera, Samsung, or Xiaomi) and point it at your QR code. In less than 240 milliseconds, your custom digital business profile opens with your menu, WhatsApp ordering, Google reviews, and Google Maps location.",
  },
  {
    q: "How does QRfolio help get more 5-star Google reviews for local shops?",
    a: "When customers scan your QR stand at the billing counter or dining table, a prominent 'Rate Us 5★ on Google' button guides them directly to your Google Maps review modal in 1 tap. This makes it effortless for happy customers to review your shop before leaving, boosting your local search ranking in your city.",
  },
  {
    q: "What happens if chai, water, or oil spills on the printed QR code?",
    a: "All QRfolio codes are generated with industrial Level-H (High) Reed-Solomon error correction. This embeds mathematical redundancy so smartphone cameras scan it instantly even if up to 30% of the surface is scratched, wet from spilled chai or water, weathered by sunlight, or partially covered by fingers.",
  },
];

function SampleQr({
  url = SAMPLE_QR_URL,
  size = "md",
}: {
  url?: string;
  size?: "sm" | "md";
}) {
  const { qr, error } = useQr(url, "");
  const dim = size === "sm" ? "h-40 w-40 sm:h-44 sm:w-44" : "h-56 w-56 sm:h-64 sm:w-64";

  return (
    <div
      className={`relative ${dim} p-2.5 bg-white rounded-2xl shadow-md border border-slate-200/90 ring-1 ring-slate-900/10 group hover:scale-[1.02] transition-transform duration-300`}
    >
      {qr ? (
        <>
          <img
            src={qr.pngDataUrl}
            alt="Sample QR code"
            className="h-full w-full rounded-xl bg-white p-1"
          />
          {/* Logo badge in center with harmonized QrFolio icon mark */}
          <div className="absolute left-1/2 top-1/2 flex h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-white shadow-md ring-1 ring-slate-900/10 p-0.5">
            <QrfolioIconMark
              size={size === "sm" ? 24 : 38}
              mode="light"
              className="drop-shadow-xs"
            />
          </div>
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-50 text-xs text-slate-400">
          {error ? "Sample unavailable" : <Loader2 className="animate-spin text-slate-800" />}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [activeDemo, setActiveDemo] = useState(0);
  const [simulatedLinkTapped, setSimulatedLinkTapped] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const currentDemo = PRESET_DEMOS[activeDemo];

  const handleLinkClick = (title: string) => {
    setSimulatedLinkTapped(title);
    setTimeout(() => {
      setSimulatedLinkTapped(null);
    }, 2200);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`https://qrfolio.io/p/${currentDemo.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const filteredLinks = currentDemo.links.filter(
    (l) =>
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.sub.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cta = user
    ? { to: "/dashboard", label: "Open Dashboard" }
    : { to: "/register", label: "Claim Your Free QR ↗" };

  return (
    <div className="relative overflow-hidden bg-white selection:bg-[#d4f04d] selection:text-slate-950 font-sans">
      {/* =========================================================================
          HERO SECTION: Sunny Azure Blue Sky with Fluffy Clouds Background & 3D Cards
         ========================================================================= */}
      <section className="relative px-2 sm:px-4 lg:px-6 pt-2 sm:pt-3 pb-8 sm:pb-10">
        <div
          className="relative min-h-[760px] sm:min-h-[860px] lg:min-h-[940px] w-full rounded-[28px] sm:rounded-[44px] overflow-hidden bg-cover bg-center shadow-2xl flex flex-col justify-between pt-36 sm:pt-40 pb-14 sm:pb-16"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=2400&q=85')`,
          }}
        >
          {/* Subtle soft gradient overlay ensuring maximum text readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-950/25 via-sky-600/10 to-transparent" />

          {/* Centered Hero Content: CRYSTAL CLEAR VALUE PROPOSITION */}
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            {/* Value Tagline Pill */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/30 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-[#d4f04d] animate-pulse" />
              <span>Smart QR Code for Businesses • Made for India</span>
            </div>

            {/* Main Headline: Exactly explains what the product is with SEO keywords */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] drop-shadow-sm">
              Smart QR Code for Local Businesses in India. <br className="hidden sm:inline" />
              One Stand on Your Counter, Your Entire Business on Their Phone.
            </h1>

            {/* Subtitle: Exactly explains how it helps with natural SEO keyword inclusion */}
            <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base lg:text-lg text-white/95 leading-relaxed font-normal drop-shadow-xs">
              Empower your shop with an industrial <strong>QR code for businesses</strong>. Turn customer scans into 5-star <strong>Google reviews</strong>, direct WhatsApp orders, and loyal followers with a fast <strong>digital business profile</strong>. Perfect <strong>QR code for shops and restaurants</strong> across India with ₹0 reprint cost.
            </p>

            {/* Dual CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <a
                href="#demo"
                className="inline-flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 px-6 py-2.5 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>SCAN LIVE DEMO</span>
              </a>
              <Link
                to={cta.to}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#d4f04d] hover:bg-[#c4e436] text-slate-950 px-6 py-2.5 text-xs font-black shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <span>{cta.label}</span>
              </Link>
            </div>
          </div>

          {/* 3D Curved Ribbon of Floating Showcase Cards (Explains What Product Does Visually) */}
          <div className="relative z-10 mt-12 sm:mt-16 w-full max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto sm:overflow-visible py-6 px-2 no-scrollbar perspective-1000">
              {/* Card 1: Left Angled Glass Card -> ZERO REPRINT COSTS */}
              <div
                className="shrink-0 w-44 sm:w-52 rounded-2xl bg-white/35 backdrop-blur-xl border border-white/50 p-4 shadow-xl transition-all duration-300 hover:scale-105 hover:z-30 select-none hidden md:block"
                style={{
                  transform: "rotateY(16deg) rotateZ(-4deg) translateY(-8px)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#d4f04d] animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                    Reprint Cost
                  </span>
                </div>
                <div className="mt-2 text-2xl font-black text-white">₹0</div>
                <div className="mt-2 space-y-1.5">
                  <div className="rounded-lg bg-white/60 p-2 text-[10px] font-semibold text-slate-900 leading-tight">
                    Special menu or price changed? Update in 10s. Your counter QR never changes.
                  </div>
                </div>
              </div>

              {/* Card 2: Mid-Left Metrics Card -> INSTANT SCAN SPEED */}
              <div
                className="shrink-0 w-44 sm:w-52 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/60 p-4 shadow-2xl transition-all duration-300 hover:scale-105 hover:z-30 select-none"
                style={{
                  transform: "rotateY(8deg) rotateZ(-2deg) translateY(2px)",
                }}
              >
                <div className="rounded-xl bg-slate-950 p-3 text-white">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400">Scan Speed</span>
                    <Zap size={12} className="text-[#d4f04d]" />
                  </div>
                  <div className="font-display text-2xl font-black mt-1 text-white">
                    240ms
                  </div>
                  <div className="text-[10px] text-[#d4f04d] font-bold mt-0.5">
                    Zero App Install Needed
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-[10px] text-slate-500 font-medium">Camera Compatibility</span>
                  <div className="font-display text-sm font-bold text-slate-950">100% All Phones</div>
                  <p className="text-[9px] text-slate-500 mt-0.5">iPhone & Android Default Camera</p>
                </div>
              </div>

              {/* Card 3: Center Focal Card (Glowing Blue Focal Card with Central Harmonized Emblem) */}
              <div
                className="shrink-0 w-48 sm:w-56 rounded-2xl bg-gradient-to-b from-sky-500 to-blue-600 p-5 shadow-[0_20px_50px_rgba(14,165,233,0.4)] border border-sky-300/60 text-white text-center transition-all duration-300 hover:scale-105 hover:z-30 select-none ring-4 ring-white/20"
                style={{
                  transform: "rotateY(0deg) translateY(8px)",
                }}
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner text-white ring-2 ring-white/40">
                  <QrfolioIconMark size={34} mode="dark" />
                </div>
                <h4 className="mt-3.5 font-display text-base font-black tracking-tight text-white">
                  Smart Dynamic QR
                </h4>
                <p className="text-[11px] text-sky-100 mt-1 leading-snug">
                  Permanent printed code that routes to your latest active links
                </p>
                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d4f04d] animate-ping" />
                  Print Once, Update Forever
                </div>
              </div>

              {/* Card 4: Mid-Right Obsidian Card -> ALL YOUR LINKS IN 1 SCAN */}
              <div
                className="shrink-0 w-44 sm:w-52 rounded-2xl bg-slate-950 border border-slate-800 p-4 shadow-2xl text-white transition-all duration-300 hover:scale-105 hover:z-30 select-none"
                style={{
                  transform: "rotateY(-8deg) rotateZ(2deg) translateY(2px)",
                }}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <Sparkles size={11} className="text-[#d4f04d]" />
                  <span>All In One Scan</span>
                </div>
                <h4 className="mt-2 text-xs font-bold text-white leading-snug">
                  Menu, Instagram, WhatsApp Orders & 5★ Google Reviews.
                </h4>
                {/* Visual Brand Channel Icons */}
                <div className="mt-3 flex items-center justify-between gap-1 rounded-xl bg-white/10 p-1.5 border border-white/15">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white shadow-xs" title="Google Reviews">
                    <GoogleLogo size={14} />
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white shadow-xs" title="WhatsApp Orders">
                    <WhatsAppLogo size={14} />
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white shadow-xs" title="Instagram">
                    <InstagramLogo size={14} />
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white shadow-xs" title="Google Maps">
                    <GoogleMapsLogo size={14} />
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white shadow-xs" title="Website & Menu">
                    <WebsiteLogo size={14} />
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Level-H Redundancy</span>
                  <span className="text-[#d4f04d] font-bold">100% Scratch Proof</span>
                </div>
              </div>

              {/* Card 5: Right Angled Chart Card -> REAL SCAN TRAFFIC */}
              <div
                className="shrink-0 w-44 sm:w-52 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/60 p-4 shadow-xl transition-all duration-300 hover:scale-105 hover:z-30 select-none hidden md:block"
                style={{
                  transform: "rotateY(-16deg) rotateZ(4deg) translateY(-8px)",
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Customer Scans
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-display text-xl font-black text-slate-950">1,240+</span>
                  <span className="text-[10px] font-bold text-emerald-600">This Week</span>
                </div>

                {/* Micro SVG Ascending Graph */}
                <div className="mt-3 h-14 w-full">
                  <svg viewBox="0 0 100 40" className="h-full w-full overflow-visible">
                    <path
                      d="M0 35 Q 25 32, 45 22 T 85 10 T 100 4"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M0 35 Q 25 32, 45 22 T 85 10 T 100 4 L 100 40 L 0 40 Z"
                      fill="url(#chart-grad)"
                      opacity="0.25"
                    />
                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            {/* Star Rating below Cards */}
            <div className="mt-6 text-center">
              <p className="text-xs font-semibold text-white/90 drop-shadow-xs">
                Rated 4.9/5 by 4,900+ local businesses, cafes, salons & retail shops across Gujarat & India
              </p>
              <div className="flex items-center justify-center gap-1 mt-1 text-[#d4f04d]">
                {"★★★★★"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LOGO TICKER / PARTNER MARQUEE (Infinite smooth continuous loop)
         ========================================================================= */}
      <PartnerLogoLoop speed={26} />

      {/* =========================================================================
          SECTION 2: "HOW IT HELPS YOUR BUSINESS" (Bento Grid Explaining Value)
         ========================================================================= */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Centered Section Header with Inline Headline Badges */}
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
              • HOW IT HELPS YOUR BUSINESS
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Stop wasting money on reprints. One dynamic QR{" "}
              <span className="inline-flex items-center justify-center align-middle mx-1 h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-sky-500 text-white shadow-sm ring-2 ring-sky-200">
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>{" "}
              connects patrons{" "}
              <span className="inline-flex items-center justify-center align-middle mx-1 px-3 py-0.5 rounded-full bg-[#d4f04d] text-slate-950 font-black text-xs sm:text-sm shadow-xs">
                to everything
              </span>
            </h2>
          </div>

          {/* 3-Column Bento Grid: Concrete Product Benefits */}
          <div className="grid gap-6 md:grid-cols-12 items-stretch">
            {/* Card 1 (Left - 5 Cols): Real Customer Experience photo card */}
            <div className="md:col-span-5 relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[440px] shadow-lg flex flex-col justify-between p-6 bg-slate-900 group">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
                alt="Business Founder with QR Bio"
                className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/20 pointer-events-none" />

              {/* Top Bar on Photo with QRFOLIO brand tag */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="font-display text-xs font-black text-white tracking-widest uppercase bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                  QRFOLIO
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 backdrop-blur-md text-white">
                  <Smartphone size={15} />
                </div>
              </div>

              {/* Bottom White Overlay Card */}
              <div className="relative z-10 rounded-2xl bg-white p-5 shadow-xl">
                <div className="font-display text-2xl font-black text-slate-950">
                  Zero App Install Needed
                </div>
                <p className="mt-1 text-xs text-slate-600 leading-normal">
                  Customers just point their default phone camera. In 240ms, your food menu, WhatsApp ordering, and Google reviews appear cleanly.
                </p>
              </div>
            </div>

            {/* Card 2 (Center - 4 Cols): 100% REPRINT SAVINGS + Testimonial */}
            <div className="md:col-span-4 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Annual Reprint Costs Saved
                </span>
                <div className="font-display text-4xl sm:text-5xl font-black text-slate-950 mt-1">
                  100%
                </div>

                <p className="mt-3 text-xs text-slate-600 leading-relaxed font-medium">
                  Average cafe, restaurant, or shop in India saves <strong>₹35,000+ every year</strong> on printed paper menus, standees, and leaflets.
                </p>

                {/* Overlapping Avatar Stack (4 people) */}
                <div className="flex items-center -space-x-2 mt-5">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                    alt="Customer"
                    className="h-9 w-9 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
                    alt="Customer"
                    className="h-9 w-9 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80"
                    alt="Customer"
                    className="h-9 w-9 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80"
                    alt="Customer"
                    className="h-9 w-9 rounded-full border-2 border-white object-cover"
                  />
                </div>
              </div>

              {/* Customer Quote */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "We used to waste ₹8,000 reprinting table menus whenever vegetable or festival rates changed. With QRfolio, our staff updates the daily Gujarati thali in 20 seconds from their phone."
                </p>
                <span className="block mt-2 text-[10px] font-bold text-slate-400 uppercase">
                  — Jayesh Patel, Shreeji Restaurant • Rajkot
                </span>
              </div>
            </div>

            {/* Card 3 (Right - 3 Cols): GOOGLE REVIEWS BOOST & 100% SCAN RATE */}
            <div className="md:col-span-3 flex flex-col justify-between gap-4">
              {/* Top Electric Lime Card */}
              <div className="rounded-3xl bg-[#d4f04d] p-6 shadow-xs flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-900">
                    Google 5★ Reviews Boost
                  </span>
                  <div className="font-display text-4xl font-black text-slate-950 mt-1">
                    +42%
                  </div>
                </div>
                <p className="mt-3 text-xs font-semibold text-slate-900 leading-relaxed">
                  Happy customers are automatically guided straight to your 5-star Google review modal right at checkout.
                </p>
              </div>

              {/* Bottom Obsidian Black Pill Card */}
              <div className="rounded-2xl bg-slate-950 p-4 text-white flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-xs text-slate-300 font-medium block">Level-H Scannability</span>
                  <span className="text-[10px] text-[#d4f04d] font-bold">Resists Spills & Scratches</span>
                </div>
                <span className="font-display text-2xl font-black text-white">100%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS IN 3 SIMPLE STEPS (Clear step-by-step roadmap)
         ========================================================================= */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
              • HOW IT WORKS
            </span>
            <h3 className="mt-2 font-display text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Live in 3 Simple Steps
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Zero coding or design experience required. Get your business live in 3 minutes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="h-8 w-8 rounded-full bg-slate-950 text-white font-black text-xs flex items-center justify-center">
                  1
                </span>
                <Store size={18} className="text-slate-400" />
              </div>
              <h4 className="mt-4 font-display text-base font-bold text-slate-900">
                Create Your Link Hub
              </h4>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Add your logo, daily food menu, WhatsApp order link, Instagram, and Google review link in minutes.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="h-8 w-8 rounded-full bg-[#d4f04d] text-slate-950 font-black text-xs flex items-center justify-center">
                  2
                </span>
                <Printer size={18} className="text-slate-400" />
              </div>
              <h4 className="mt-4 font-display text-base font-bold text-slate-900">
                Print Your Permanent QR
              </h4>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Download your high-definition vector SVG or PNG. Print it once on table stands, window vinyls, or cards.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="h-8 w-8 rounded-full bg-sky-500 text-white font-black text-xs flex items-center justify-center">
                  3
                </span>
                <RefreshCw size={18} className="text-slate-400" />
              </div>
              <h4 className="mt-4 font-display text-base font-bold text-slate-900">
                Update Anytime for Free
              </h4>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Need to change prices or specials? Edit them from your phone in 5 seconds. The printed QR updates immediately!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: "CORE CAPABILITIES" (What Features Make It Powerful)
         ========================================================================= */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
              • WHAT YOUR CUSTOMERS GET
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Everything physical businesses need to connect with customers
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Designed specifically for restaurants, cafes, salons, retail shops, boutiques, studios, and local businesses in Gujarat and across India.
            </p>

            {/* Pill CTA button in black with lime arrow as in reference */}
            <div className="mt-6 flex justify-center">
              <Link
                to={cta.to}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white px-6 py-2.5 text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <span>CLAIM YOUR FREE QR</span>
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#d4f04d] text-slate-950">
                  ↗
                </span>
              </Link>
            </div>
          </div>

          {/* 4-Column Card Grid: 3 Feature Cards + 1 Photo Card as in reference image */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-12 items-stretch">
            {/* Card 1: Touchless Menus */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4f04d] text-slate-950 font-bold shadow-xs">
                  <Utensils size={18} />
                </div>
                <h4 className="mt-6 font-display text-base font-bold text-slate-900">
                  Digital Menus & Portfolios
                </h4>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Display your complete food menu, drinks list, or services directly on their phone screen. Add seasonal tags and photos easily.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>₹0 Reprint Cost</span>
                <ArrowRight size={13} className="text-slate-400" />
              </div>
            </div>

            {/* Card 2: 1-Tap Ordering */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4f04d] text-slate-950 font-bold shadow-xs">
                  <MessageCircle size={18} />
                </div>
                <h4 className="mt-6 font-display text-base font-bold text-slate-900">
                  1-Tap WhatsApp & Socials
                </h4>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  One tap launches direct WhatsApp ordering or your Instagram profile inside their native smartphone app.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>Instant Conversion</span>
                <ArrowRight size={13} className="text-slate-400" />
              </div>
            </div>

            {/* Card 3: 5-Star Reviews */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4f04d] text-slate-950 font-bold shadow-xs">
                  <Star size={18} />
                </div>
                <h4 className="mt-6 font-display text-base font-bold text-slate-900">
                  5-Star Review Booster
                </h4>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Turn happy customers into 5-star Google reviews right at your billing counter or dining table before they leave.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>+42% More Reviews</span>
                <ArrowRight size={13} className="text-slate-400" />
              </div>
            </div>

            {/* Card 4 (Photo Card as in reference image) */}
            <div className="rounded-3xl overflow-hidden shadow-xs relative min-h-[220px] group">
              <img
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80"
                alt="Happy patrons scanning QR"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
              <div className="relative z-10 h-full flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4f04d]">
                  Tabletop Scans
                </span>
                <h4 className="font-display text-sm font-bold text-white mt-0.5 leading-snug">
                  Fast, frictionless mobile experience loved by diners & shoppers.
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: INTERACTIVE LIVE CAMERA & MOBILE HUB SHOWCASE (150VH VIEWPORT)
         ========================================================================= */}
      <section
        id="demo"
        className="relative min-h-[150vh] flex flex-col justify-center py-20 sm:py-28 lg:py-32 bg-gradient-to-b from-[#024bff] via-[#004bd9] to-[#002f9e] text-white overflow-hidden selection:bg-[#d4f04d] selection:text-slate-950"
        style={{ minHeight: "150vh" }}
      >
        {/* Ambient background glow & silk wave curves */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-sky-300/25 blur-[140px] rounded-full" />
          <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-blue-400/20 blur-[130px] rounded-full" />
          <div className="absolute bottom-10 -right-20 w-[700px] h-[700px] bg-indigo-500/25 blur-[150px] rounded-full" />
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            preserveAspectRatio="none"
            viewBox="0 0 1440 900"
            fill="none"
          >
            <path
              d="M-100 450 C 300 200, 700 700, 1540 350 L 1540 900 L -100 900 Z"
              fill="white"
            />
          </svg>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 my-auto flex flex-col justify-center">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/25 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#d4f04d] animate-pulse" />
              <span>LIVE CAMERA SCAN EXPERIENCE • ZERO APP INSTALL</span>
            </div>

            <h2 className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] drop-shadow-sm">
              Scan The QR Code. <br className="hidden sm:inline" />
              See Your Entire Business Open.
            </h2>

            <p className="mt-4 text-sm sm:text-base lg:text-lg text-white/95 font-normal leading-relaxed max-w-2xl mx-auto">
              Point your regular smartphone camera at the counter stand below. Zero app download required — in <strong>240 milliseconds</strong>, your customer sees your Google reviews, WhatsApp ordering, Instagram, and live digital menu.
            </p>

            {/* Major Supported Channels Strip (Google, WhatsApp, Insta, Maps, Website) */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              <span className="text-xs font-bold text-white/85 mr-1 hidden sm:inline">
                One Scan Connects:
              </span>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow-md transition-transform hover:scale-105">
                <GoogleLogo size={15} />
                <span>Google Reviews</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow-md transition-transform hover:scale-105">
                <WhatsAppLogo size={15} />
                <span>WhatsApp Orders</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow-md transition-transform hover:scale-105">
                <InstagramLogo size={15} />
                <span>Instagram</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow-md transition-transform hover:scale-105">
                <GoogleMapsLogo size={15} />
                <span>Google Maps</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow-md transition-transform hover:scale-105">
                <WebsiteLogo size={15} />
                <span>Digital Menu</span>
              </div>
            </div>

            {/* Indian Business Switcher Pills */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <span className="text-[11px] uppercase font-bold tracking-widest text-white/80">
                Sample Local Business Demos (Click to Preview):
              </span>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 max-w-3xl">
                {PRESET_DEMOS.map((demo, idx) => (
                  <button
                    key={demo.id}
                    onClick={() => {
                      setActiveDemo(idx);
                      setSearchQuery("");
                      setSimulatedLinkTapped(null);
                    }}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer backdrop-blur-md flex items-center gap-2 shadow-sm ${
                      activeDemo === idx
                        ? "bg-[#d4f04d] text-slate-950 shadow-lg scale-105 font-black ring-2 ring-white/60"
                        : "bg-white/15 border border-white/25 text-white hover:bg-white/25 hover:scale-102"
                    }`}
                  >
                    <span className="text-sm">{demo.initial}</span>
                    <span>{demo.name}</span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        activeDemo === idx
                          ? "bg-slate-950/15 text-slate-900"
                          : "bg-white/20 text-white/90"
                      }`}
                    >
                      {demo.location.includes("Ahmedabad")
                        ? "Ahmedabad"
                        : demo.location.includes("Rajkot")
                        ? "Rajkot"
                        : demo.location.includes("Surat")
                        ? "Surat"
                        : demo.location.includes("Vadodara")
                        ? "Vadodara"
                        : "Gujarat"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2-Column Showcase */}
          <div className="mt-12 sm:mt-16 grid gap-10 lg:gap-14 lg:grid-cols-12 items-center justify-center max-w-5xl mx-auto w-full">
            {/* LEFT (5 COLS): ACRYLIC COUNTER STAND MOCKUP */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[340px] sm:max-w-[360px] rounded-[2rem] bg-white p-6 sm:p-7 text-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.35)] ring-4 ring-white/30 backdrop-blur-xl flex flex-col items-center text-center">
                {/* Stand Top Bar */}
                <div className="flex items-center justify-between w-full mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Level-H Scannable
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Counter Display
                  </span>
                </div>

                {/* Optical Viewfinder Frame around Scannable QR */}
                <div className="relative p-2.5 rounded-2xl bg-slate-50 border border-slate-200/90 group">
                  {/* Corner Target Brackets */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-sky-500 rounded-tl-sm pointer-events-none" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-sky-500 rounded-tr-sm pointer-events-none" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-sky-500 rounded-bl-sm pointer-events-none" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-sky-500 rounded-br-sm pointer-events-none" />

                  {/* Scannable Level-H QR */}
                  <SampleQr url={`https://qrfolio.io/p/${currentDemo.id}`} size="md" />
                </div>

                <div className="mt-4 w-full">
                  <span className="text-sm font-black text-slate-950 block">
                    Point Phone Camera Here to Test
                  </span>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    iPhone Camera, Android Camera & Google Lens • Zero app download
                  </p>

                  {/* Clean URL bar with copy & open */}
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-2 text-xs font-mono">
                    <span className="truncate text-slate-700 font-semibold px-2">
                      qrfolio.io/p/{currentDemo.id}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={handleCopyLink}
                        className="p-1.5 rounded-md hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Copy Link"
                      >
                        {copiedLink ? (
                          <Check size={14} className="text-emerald-600" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                      <a
                        href={`https://qrfolio.io/p/${currentDemo.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md bg-slate-950 text-white hover:bg-slate-800 transition-colors"
                        title="Open live link in new tab"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* 3 Step Instruction Row */}
                <div className="mt-5 pt-4 border-t border-slate-100 w-full grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-slate-50 p-2">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Step 1</span>
                    <span className="text-[11px] font-bold text-slate-800 leading-tight block mt-0.5">
                      Open Camera
                    </span>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Step 2</span>
                    <span className="text-[11px] font-bold text-slate-800 leading-tight block mt-0.5">
                      Aim at Stand
                    </span>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-2 border border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-600 block uppercase">Step 3</span>
                    <span className="text-[11px] font-bold text-emerald-900 leading-tight block mt-0.5">
                      Opens in 240ms
                    </span>
                  </div>
                </div>
              </div>

              {/* Counter Table Stand Base Effect */}
              <div className="w-48 sm:w-56 h-3 bg-gradient-to-r from-white/20 via-white/70 to-white/20 rounded-full mx-auto -mt-1.5 shadow-md blur-[0.5px] border-t border-white/40" />

              {/* Sub-pill badges */}
              <div className="mt-5 space-y-2 text-center">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20 shadow-xs">
                  <Zap size={13} className="text-[#d4f04d]" />
                  <span>Industrial Level-H: Scans even if 30% wet or scratched</span>
                </div>
              </div>
            </div>

            {/* RIGHT (7 COLS): REALISTIC FULL-HEIGHT IPHONE 16 PRO SIMULATOR */}
            <div className="lg:col-span-7 flex justify-center items-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[360px] rounded-[3rem] border-[9px] border-slate-900 bg-slate-950 p-2 shadow-[0_30px_70px_rgba(0,0,0,0.5)] ring-1 ring-white/20 select-none">
                {/* Phone Screen Container */}
                <div className="relative rounded-[2.4rem] bg-slate-50 text-slate-800 overflow-hidden h-[580px] sm:h-[640px] flex flex-col justify-between border border-slate-200">
                  {/* Dynamic Island & Status Bar */}
                  <div className="pt-2.5 px-6 pb-2 flex items-center justify-between text-xs font-bold text-slate-900 bg-white border-b border-slate-100 shrink-0">
                    <span>9:41</span>
                    <div className="flex items-center gap-1.5 rounded-full bg-black px-3 py-1">
                      <div className="h-2 w-2 rounded-full bg-slate-900" />
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <span className="text-[10px] font-bold">5G</span>
                      <Wifi size={13} />
                      <div className="flex h-2.5 w-4 items-center rounded-xs border border-slate-700 px-0.5">
                        <div className="h-1.5 w-full rounded-2xs bg-emerald-600" />
                      </div>
                    </div>
                  </div>

                  {/* Tap Feedback Floating Toast */}
                  {simulatedLinkTapped && (
                    <div className="absolute top-12 inset-x-3 z-40 animate-fade-in">
                      <div className="rounded-xl bg-slate-950/95 text-white px-3 py-2.5 shadow-2xl flex items-center justify-between text-xs ring-1 ring-white/20 backdrop-blur-md">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="h-2 w-2 rounded-full bg-[#d4f04d] animate-ping shrink-0" />
                          <span className="font-bold truncate">Tapped: {simulatedLinkTapped}</span>
                        </div>
                        <span className="text-[10px] text-[#d4f04d] font-black shrink-0 ml-2">
                          240ms Launch
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Scrollable Phone Hub Body */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar bg-white">
                    {/* Business Header */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr ${currentDemo.color} text-2xl font-bold text-white shadow-md`}
                      >
                        {currentDemo.initial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-black text-sm text-slate-950 truncate">
                            {currentDemo.name}
                          </h3>
                          <CheckCircle2 size={15} className="text-blue-600 shrink-0" />
                        </div>
                        <p className="text-xs font-semibold text-slate-600 truncate mt-0.5">
                          {currentDemo.category}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 truncate">
                          <MapPin size={11} className="shrink-0 text-slate-400" />
                          <span className="truncate">{currentDemo.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Contact & Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <button
                        onClick={() => handleLinkClick("Call Counter")}
                        className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        <Phone size={12} className="text-slate-600" />
                        <span>Call Shop</span>
                      </button>
                      <button
                        onClick={() => handleLinkClick("Google Maps Directions")}
                        className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        <MapPin size={12} className="text-blue-600" />
                        <span>Directions</span>
                      </button>
                      <button
                        onClick={() => handleLinkClick("Share Business Profile")}
                        className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        <Share2 size={12} className="text-emerald-600" />
                        <span>Share Hub</span>
                      </button>
                    </div>

                    {/* Daily Announcement / Offer Banner */}
                    <div className="rounded-xl bg-amber-50/90 border border-amber-200/90 px-3 py-2 text-xs text-amber-900 leading-snug font-medium shadow-2xs">
                      {currentDemo.announcement}
                    </div>

                    {/* Attached Channel Links List */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-0.5 block">
                        Attached Links (Click to Test Experience):
                      </span>
                      {currentDemo.links.map((link) => (
                        <div
                          key={link.title}
                          onClick={() => handleLinkClick(link.title)}
                          className="group flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs transition-all hover:border-blue-500 hover:shadow-xs hover:scale-[1.01] active:scale-95 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-200/70 shadow-2xs group-hover:scale-105 transition-transform">
                              <BrandLogo name={link.icon} size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {link.title}
                              </p>
                              <p className="truncate text-[10px] text-slate-500">{link.sub}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            {link.badge && (
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-700 border border-slate-200">
                                {link.badge}
                              </span>
                            )}
                            <ChevronRight
                              size={14}
                              className="text-slate-400 group-hover:translate-x-0.5 transition-transform"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Bar inside phone */}
                  <div className="shrink-0 bg-slate-100/90 py-2 text-center border-t border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block">
                      Powered by QrFolio Dynamic Hub
                    </span>
                    <div className="h-1 w-24 bg-slate-300 rounded-full mx-auto mt-1.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: COMMON QUESTIONS ACCORDION
         ========================================================================= */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
              • FAQ
            </span>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-slate-900">
              Common Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS_TEASER.map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-2xl border border-slate-200/90 bg-slate-50/50 p-5 shadow-2xs transition-all [&_summary::-webkit-details-marker]:hidden open:border-slate-400 open:bg-white"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base">
                  <span>{q}</span>
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-slate-500 transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/faq"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:underline"
            >
              <span>View All Questions & Knowledge Base →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FINAL INVITATION CALL TO ACTION
         ========================================================================= */}
      <section className="py-20 bg-slate-950 text-white border-t border-slate-800">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            Stop Paper Waste. Start Connecting.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-400 font-normal leading-relaxed">
            Create your permanent dynamic QR code in 3 minutes. Built for Indian cafes, shops, restaurants, and salons. Update links, WhatsApp orders, and menus anytime from your phone with ₹0 reprint cost.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to={cta.to}
              className="inline-flex items-center gap-2 rounded-full bg-[#d4f04d] px-8 py-3.5 text-xs font-black text-slate-950 shadow-xl hover:bg-[#c4e436] transition-all cursor-pointer active:scale-95"
            >
              <span>CLAIM YOUR FREE QR NOW ↗</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
