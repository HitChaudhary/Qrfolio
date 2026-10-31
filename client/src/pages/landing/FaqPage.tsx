import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
  category: "dynamic" | "printing" | "privacy" | "billing";
}

const FAQ_LIST: FaqItem[] = [
  {
    category: "dynamic",
    q: "How does a dynamic QR code differ from a static QR code?",
    a: "A static QR code permanently freezes the destination URL into the black-and-white pixels. If your food menu prices, WhatsApp number, or Instagram handle changes, the printed acrylic stand or sticker becomes useless and must be reprinted. A QrFolio dynamic QR code encodes a permanent, high-speed proxy address. When patrons scan it, our system routes them to your latest active destinations. You can edit, reorder, or toggle links anytime from your dashboard in 10 seconds with ₹0 reprint cost.",
  },
  {
    category: "dynamic",
    q: "Do I need to reprint my physical counter stands when I change food rates or links?",
    a: "Never! That is the core value of QrFolio. You can change your daily special thali at 11:59 AM, and anyone scanning the QR code on your dining table at 12:00 PM will immediately see the updated dishes and prices without reprinting.",
  },
  {
    category: "dynamic",
    q: "Can I add deep links that open Indian smartphone apps directly?",
    a: "Yes! QrFolio supports native deep-linking protocols for WhatsApp (direct one-tap counter ordering or table booking), Instagram (opens the user's Instagram app directly), Google Maps (launches turn-by-turn directions), phone calls, and UPI digital payments.",
  },
  {
    category: "printing",
    q: "What is Level-H Reed-Solomon error correction, and does it resist chai/oil spills?",
    a: "Level-H (High) is the highest error correction tier defined in international ISO QR specifications. It embeds mathematical redundancy so smartphone cameras scan it instantly even if up to 30% of the surface is scratched, wet from spilled tea or water, weathered by sunlight, or partially covered by customer fingers.",
  },
  {
    category: "printing",
    q: "What file formats are provided for printing acrylic stands and table tents?",
    a: "You can download infinite-resolution vector SVG files (essential for commercial Indian print shops, vinyl window cutters, laser engraving, and large hoardings) as well as ultra-high-resolution 4K PNG files for tabletop acrylic inserts and digital flyers.",
  },
  {
    category: "printing",
    q: "What is the recommended print size for reliable dining table scanning?",
    a: "Smartphone camera lenses reliably follow the 10:1 scanning ratio: to scan comfortably from 30 cm away (standard dining table or billing counter distance), print the QR code matrix at least 3×3 cm. For a storefront window scanned from 1.5 meters away, print it at 15 cm wide.",
  },
  {
    category: "privacy",
    q: "How does QrFolio track scan analytics without invasive cookies?",
    a: "We practice zero-PII (Personally Identifiable Information) tracking. We calculate aggregate scan counts and link click velocity using anonymous counters. We never record personal identifiers, IP addresses, GPS tracks, or intrusive device fingerprints. This makes QrFolio 100% compliant with global privacy standards without requiring annoying consent banners.",
  },
  {
    category: "billing",
    q: "Is there a free tier for small Indian shops and tea stalls?",
    a: "Yes! Our Starter plan is free forever (₹0) and includes 1 dynamic QR code with unlimited customer scans and permanent routing. You can upgrade to Pro anytime for custom center logos, Level-H vector SVG exports, and Google 5-star review boosters.",
  },
  {
    category: "billing",
    q: "Can I cancel my subscription at any time?",
    a: "Yes. There are no contracts or cancellation penalties. If you cancel, your existing counter QR code remains functional on the free tier.",
  },
];

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]);

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const filteredFaqs = FAQ_LIST.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 sm:py-20 bg-slate-50 font-sans selection:bg-[#d4f04d] selection:text-slate-950">
      {/* Header */}
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-800 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-[#d4f04d] animate-pulse" />
          <span>Knowledge Base & Support</span>
        </div>
        <h1 className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-tight">
          Frequently Asked Questions
        </h1>
        <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Everything you need to know about dynamic routing, Level-H error correction, zero reprint costs, and counter setups in India.
        </p>

        {/* Live Search Bar */}
        <div className="mt-8 max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. reprint, vector SVG, chai spill, scan distance)..."
            className="w-full rounded-full border border-slate-200 bg-white py-3.5 pl-11 pr-5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-950 focus:outline-hidden"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs">
          {[
            { id: "all", label: "All Questions" },
            { id: "dynamic", label: "Dynamic Routing" },
            { id: "printing", label: "Printing & Scannability" },
            { id: "privacy", label: "Privacy & Speed" },
            { id: "billing", label: "Plans & Pricing" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-4 py-2 font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-slate-950 text-[#d4f04d] shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-950 shadow-2xs"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 mt-12 space-y-3.5">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndices.includes(idx);

            return (
              <div
                key={idx}
                className="rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs transition-all duration-200 hover:border-slate-300"
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-950 text-sm sm:text-base hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-slate-950 shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 rounded-3xl border border-slate-200 bg-white shadow-2xs">
            <p className="text-slate-500 text-sm">No matching questions found for "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-3 text-xs font-bold text-slate-950 hover:underline cursor-pointer"
            >
              Reset search filters
            </button>
          </div>
        )}
      </section>

      {/* Support Contact Box */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 mt-20">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-[#d4f04d]">
              <MessageSquare size={22} />
            </div>
            <div>
              <h3 className="font-display font-black text-slate-950 text-lg">Still have questions?</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Our support team is available to assist you with counter standee setups and print sizing.
              </p>
            </div>
          </div>

          <Link
            to="/register"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#d4f04d] hover:bg-[#c4e436] px-5 py-3 text-xs font-black text-slate-950 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>Ask Support ↗</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
