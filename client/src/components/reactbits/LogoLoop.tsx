import { useState } from "react";
import {
  Coffee,
  UtensilsCrossed,
  Home,
  Scissors,
  ShoppingBag,
  Dumbbell,
  Palette,
  Hotel,
  Ticket,
  HeartPulse,
  Beer,
  Truck,
  ArrowUpRight,
  Sparkles,
  CheckCircle,
  LucideIcon,
} from "lucide-react";

export interface BusinessItem {
  id: string;
  name: string;
  category: string;
  icon: LucideIcon;
  tagline: string;
  placement: string;
  topLinks: string[];
  gradient: string;
}

export const BUSINESS_TYPES: BusinessItem[] = [
  {
    id: "cafes",
    name: "Specialty Cafes & Roasters",
    category: "Coffee & Bakeries",
    icon: Coffee,
    tagline: "Touchless tabletop drink menus, daily single-origin bean specials & WhatsApp pickup ordering.",
    placement: "Wooden table stands, cup sleeves & pickup counters",
    topLinks: ["Seasonal Drink Menu", "Order Ahead via WhatsApp", "Instagram Roasting Feed"],
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    id: "restaurants",
    name: "Bistros & Fine Dining",
    category: "Food & Hospitality",
    icon: UtensilsCrossed,
    tagline: "Interactive multi-course food menus, sommelier wine pairings & instant Google 5-star reviews.",
    placement: "Brass table tents, bill holders & hostess stands",
    topLinks: ["Full Dinner Menu (PDF)", "Reserve a Table", "Google Reviews 4.9★"],
    gradient: "from-teal-600 to-emerald-600",
  },
  {
    id: "realestate",
    name: "Real Estate & Realtors",
    category: "Property & Homes",
    icon: Home,
    tagline: "Instant 3D Matterport virtual tours, printable listing sheets & direct WhatsApp agent chat.",
    placement: "Yard sign riders, open-house brochures & business cards",
    topLinks: ["3D Virtual Property Tour", "Download Floor Plan", "Schedule Private Showing"],
    gradient: "from-cyan-600 to-teal-500",
  },
  {
    id: "salons",
    name: "Salons, Spas & Barbers",
    category: "Beauty & Grooming",
    icon: Scissors,
    tagline: "Stylist lookbooks, bespoke treatment pricing, and direct calendar appointment booking.",
    placement: "Mirror decals, styling station inserts & front desk",
    topLinks: ["Book Online Appointment", "Before & After Transformations", "Service Price List"],
    gradient: "from-emerald-500 to-cyan-500",
  },
  {
    id: "retail",
    name: "Boutiques & Apparel",
    category: "Retail & Fashion",
    icon: ShoppingBag,
    tagline: "New seasonal drops, size charts, digital loyalty signups & VIP discount codes.",
    placement: "Clothing hangtags, store checkout signs & window vinyls",
    topLinks: ["New Arrivals Lookbook", "Join VIP Club (10% Off)", "Store Hours & Locations"],
    gradient: "from-teal-500 to-emerald-500",
  },
  {
    id: "fitness",
    name: "Gyms & Yoga Studios",
    category: "Health & Fitness",
    icon: Dumbbell,
    tagline: "Weekly group class timetable, personal trainer profiles & complimentary first-session passes.",
    placement: "Locker room posters, reception counter & gym water bottles",
    topLinks: ["Weekly Class Timetable", "Claim Free Day Pass", "Meet the Personal Trainers"],
    gradient: "from-emerald-600 to-teal-700",
  },
  {
    id: "creatives",
    name: "Designers & Agencies",
    category: "Creative Services",
    icon: Palette,
    tagline: "Live case studies, client testimonial videos, pitch decks & direct consultation bookings.",
    placement: "Conference badge lanyards, pitch decks & NFC smart cards",
    topLinks: ["Selected Case Studies", "Book 30-min Intro Call", "Download Agency Deck"],
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    id: "hotels",
    name: "Boutique Hotels & Airbnbs",
    category: "Travel & Lodging",
    icon: Hotel,
    tagline: "In-room WiFi QR connection, localized neighborhood guides, and late checkout requests.",
    placement: "Bedside nightstands, keycard holders & concierge desk",
    topLinks: ["Instant WiFi Auto-Connect", "Curated Local Guide", "Request Late Checkout"],
    gradient: "from-teal-600 to-emerald-500",
  },
  {
    id: "events",
    name: "Conferences & Festivals",
    category: "Live Events & Music",
    icon: Ticket,
    tagline: "Real-time stage schedule changes, digital sponsor booths & interactive venue maps.",
    placement: "Attendee badges, entry banners & wristbands",
    topLinks: ["Live Stage Timetable", "Interactive Floor Map", "Speaker Slides Download"],
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "clinics",
    name: "Dental & Health Clinics",
    category: "Healthcare & Wellness",
    icon: HeartPulse,
    tagline: "Touchless patient intake forms, doctor credentials, and direct insurance FAQ lookup.",
    placement: "Waiting room clipboards, consultation rooms & front desk",
    topLinks: ["Digital Intake Form", "Doctor Credentials & Bio", "Emergency Contact WhatsApp"],
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    id: "breweries",
    name: "Craft Breweries & Taprooms",
    category: "Beverage & Bars",
    icon: Beer,
    tagline: "Live rotating draft list on tap, ABV ratings, untappd check-in & can-to-go online store.",
    placement: "Bar coasters, growler tags & taproom chalkboards",
    topLinks: ["Live On-Tap Beer Menu", "Order 4-Packs for Pickup", "Untappd Check-in Link"],
    gradient: "from-emerald-600 to-teal-500",
  },
  {
    id: "foodtrucks",
    name: "Food Trucks & Popups",
    category: "Mobile Street Food",
    icon: Truck,
    tagline: "Today's live GPS parking spot, sold-out item status & contactless Venmo/Apple Pay.",
    placement: "Side order window, napkin holders & outdoor A-frame signs",
    topLinks: ["Live Today's Menu & Specials", "Follow Live Truck GPS", "Pay with Venmo / CashApp"],
    gradient: "from-emerald-500 to-teal-400",
  },
];

export interface LogoLoopProps {
  speed?: number; // seconds per full loop
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
  showSpotlight?: boolean;
}

export default function LogoLoop({
  speed = 36,
  direction = "left",
  pauseOnHover = true,
  className = "",
  showSpotlight = true,
}: LogoLoopProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessItem>(
    BUSINESS_TYPES[0]
  );

  // Duplicate list to achieve continuous infinite marquee loop
  const loopList = [...BUSINESS_TYPES, ...BUSINESS_TYPES];

  return (
    <div className={`relative w-full ${className}`}>
      {/* Header section introducing the loop */}
      <div className="mx-auto max-w-4xl text-center px-4 mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
          <Sparkles size={13} className="text-emerald-600" />
          Versatile For Every Industry
        </span>
        <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Built For Modern Businesses That Connect in the Physical World
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          From bustling specialty cafes to luxury real estate brokerages, see how physical brands turn customer scans into lasting digital engagement.
        </p>
      </div>

      {/* Main Continuous Logo Loop Track */}
      <div
        className={`relative w-full overflow-hidden py-4 ${
          pauseOnHover ? "pause-hover" : ""
        }`}
      >
        {/* Soft edge gradient masks in light mode */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 sm:w-28 bg-gradient-to-r from-[#fafbfc] via-[#fafbfc]/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 sm:w-28 bg-gradient-to-l from-[#fafbfc] via-[#fafbfc]/80 to-transparent" />

        <div
          className={
            direction === "left"
              ? "animate-loop-scroll"
              : "animate-loop-scroll-reverse"
          }
          style={{ animationDuration: `${speed}s` }}
        >
          {loopList.map((biz, idx) => {
            const Icon = biz.icon;
            const isSelected = selectedBusiness.id === biz.id;

            return (
              <div
                key={`${biz.id}-${idx}`}
                onClick={() => setSelectedBusiness(biz)}
                className={`mx-3 shrink-0 cursor-pointer rounded-2xl border transition-all duration-300 p-3.5 sm:p-4 flex items-center gap-3.5 select-none ${
                  isSelected
                    ? "border-emerald-500 bg-white shadow-md shadow-emerald-500/10 ring-2 ring-emerald-400/30 scale-[1.03]"
                    : "border-slate-200/90 bg-white hover:border-emerald-300 hover:shadow-xs shadow-2xs"
                }`}
                style={{ width: "260px" }}
              >
                {/* Industry Brand Emblem */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${biz.gradient} text-white shadow-2xs transition-transform duration-200 group-hover:scale-105`}
                >
                  <Icon size={20} />
                </div>

                {/* Name & Category Info */}
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-xs sm:text-sm font-bold text-slate-900">
                    {biz.name}
                  </h4>
                  <p className="truncate text-[11px] font-medium text-slate-500">
                    {biz.category}
                  </p>
                </div>

                <div
                  className={`h-2 w-2 rounded-full ${
                    isSelected ? "bg-emerald-500 animate-ping" : "bg-slate-300"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Selected Industry Spotlight Card */}
      {showSpotlight && (
        <div className="mt-8 mx-auto max-w-4xl px-4">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_15px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Left Column: Business details & placement */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${selectedBusiness.gradient} text-white shadow-xs`}
                  >
                    <selectedBusiness.icon size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                      Industry Spotlight
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {selectedBusiness.name}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedBusiness.tagline}
                </p>

                <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                  <span className="font-semibold text-emerald-700">
                    Ideal Print Placement:
                  </span>
                  <span>{selectedBusiness.placement}</span>
                </div>
              </div>

              {/* Right Column: Typical Links Hub Preview */}
              <div className="w-full md:w-80 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    High-Converting Links
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                    QrFolio Hub
                  </span>
                </div>

                <div className="space-y-1.5">
                  {selectedBusiness.topLinks.map((link, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs hover:border-emerald-300 transition-colors"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <CheckCircle size={13} className="text-emerald-600 shrink-0" />
                        <span className="truncate">{link}</span>
                      </span>
                      <ArrowUpRight size={13} className="text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
