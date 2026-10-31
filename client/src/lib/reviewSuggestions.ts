export const BUSINESS_CATEGORIES = [
  "Restaurant / Café",
  "Salon / Beauty Parlour",
  "Clothing / Fashion Store",
  "Electronics Store",
  "Grocery / Retail Shop",
  "Gym / Fitness",
  "Hotel / Accommodation",
  "Coaching / Education",
  "Photography",
  "Healthcare",
  "Professional Services",
  "Other",
] as const;

export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number];

export const CATEGORY_ATTRIBUTES: Record<string, string[]> = {
  "Restaurant / Café": [
    "Food quality",
    "Service & hospitality",
    "Atmosphere & ambiance",
    "Value for money",
    "Cleanliness & hygiene",
    "Overall experience",
  ],
  "Salon / Beauty Parlour": [
    "Service quality",
    "Staff experience",
    "Cleanliness & hygiene",
    "Ambiance & comfort",
    "Punctuality & booking",
    "Overall experience",
  ],
  "Clothing / Fashion Store": [
    "Collection & variety",
    "Fitting & quality",
    "Store staff support",
    "Pricing & value",
    "Store ambiance",
    "Overall experience",
  ],
  "Electronics Store": [
    "Product availability",
    "Staff knowledge & guidance",
    "Pricing & deals",
    "Store service",
    "Billing & checkout",
    "Overall experience",
  ],
  "Grocery / Retail Shop": [
    "Freshness & stock",
    "Product variety",
    "Staff helpfulness",
    "Fast checkout",
    "Cleanliness & organization",
    "Overall experience",
  ],
  "Gym / Fitness": [
    "Equipment quality",
    "Trainer guidance",
    "Cleanliness & sanitation",
    "Workout atmosphere",
    "Facilities & space",
    "Overall experience",
  ],
  "Hotel / Accommodation": [
    "Room comfort & cleanliness",
    "Staff hospitality",
    "Location & accessibility",
    "Amenities & facilities",
    "Food & breakfast",
    "Overall experience",
  ],
  "Coaching / Education": [
    "Teaching quality",
    "Mentor guidance",
    "Study material & curriculum",
    "Learning environment",
    "Query resolution",
    "Overall experience",
  ],
  "Photography": [
    "Photo quality & creativity",
    "Professionalism & punctuality",
    "Comfort during shoot",
    "Editing & delivery time",
    "Communication",
    "Overall experience",
  ],
  "Healthcare": [
    "Doctor & staff attentiveness",
    "Hygiene & clinic standards",
    "Wait time & scheduling",
    "Clear explanations",
    "Care & professionalism",
    "Overall experience",
  ],
  "Professional Services": [
    "Work quality & expertise",
    "Timely delivery",
    "Clear communication",
    "Problem solving",
    "Professional conduct",
    "Overall experience",
  ],
  "Other": [
    "Service quality",
    "Customer support",
    "Punctuality & speed",
    "Value for money",
    "Communication",
    "Overall experience",
  ],
};

export function getCategoryAttributes(category: string): string[] {
  if (category && CATEGORY_ATTRIBUTES[category]) {
    return CATEGORY_ATTRIBUTES[category];
  }
  // Fallback match by partial name or "Other"
  const matchedKey = Object.keys(CATEGORY_ATTRIBUTES).find((k) =>
    category.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(category.toLowerCase())
  );
  return matchedKey ? CATEGORY_ATTRIBUTES[matchedKey] : CATEGORY_ATTRIBUTES["Other"];
}

function formatAttributesList(attrs: string[]): string {
  if (!attrs.length) return "";
  const cleaned = attrs.map((a) => a.toLowerCase());
  if (cleaned.length === 1) return cleaned[0];
  if (cleaned.length === 2) return `${cleaned[0]} and ${cleaned[1]}`;
  return `${cleaned.slice(0, -1).join(", ")}, and ${cleaned[cleaned.length - 1]}`;
}

export interface CategorySeoInfo {
  singular: string;
  plural: string;
  localQuery: string;
  highlightTerm: string;
}

export const CATEGORY_SEO_INFO: Record<string, CategorySeoInfo> = {
  "Restaurant / Café": {
    singular: "cafe & restaurant",
    plural: "cafes & restaurants",
    localQuery: "cafes and dining spots in the area",
    highlightTerm: "food and drinks",
  },
  "Salon / Beauty Parlour": {
    singular: "salon",
    plural: "hair & beauty salons",
    localQuery: "salons and parlours in town",
    highlightTerm: "styling and beauty care",
  },
  "Clothing / Fashion Store": {
    singular: "clothing store",
    plural: "fashion & clothing stores",
    localQuery: "clothing stores around here",
    highlightTerm: "outfits and collections",
  },
  "Electronics Store": {
    singular: "electronics store",
    plural: "electronics & gadget shops",
    localQuery: "electronics stores in the area",
    highlightTerm: "gadgets and electronics",
  },
  "Grocery / Retail Shop": {
    singular: "grocery store",
    plural: "grocery & retail shops",
    localQuery: "grocery stores in town",
    highlightTerm: "daily essentials and groceries",
  },
  "Gym / Fitness": {
    singular: "gym",
    plural: "gyms & fitness centers",
    localQuery: "fitness gyms in the area",
    highlightTerm: "workouts and fitness training",
  },
  "Hotel / Accommodation": {
    singular: "hotel",
    plural: "hotels & places to stay",
    localQuery: "places to stay and hotels in the city",
    highlightTerm: "rooms and hospitality",
  },
  "Coaching / Education": {
    singular: "coaching institute",
    plural: "coaching & learning institutes",
    localQuery: "education and coaching centers in town",
    highlightTerm: "classes and exam mentoring",
  },
  "Photography": {
    singular: "photo studio",
    plural: "photographers & studios",
    localQuery: "photographers in the area",
    highlightTerm: "photoshoots and creative photography",
  },
  "Healthcare": {
    singular: "clinic",
    plural: "clinics & healthcare centers",
    localQuery: "healthcare clinics in town",
    highlightTerm: "care and medical guidance",
  },
  "Professional Services": {
    singular: "service provider",
    plural: "professional service firms",
    localQuery: "professional services in the area",
    highlightTerm: "expert service and support",
  },
  "Other": {
    singular: "business",
    plural: "spots",
    localQuery: "local places in town",
    highlightTerm: "service and customer care",
  },
};

export function getCategorySeoInfo(category: string): CategorySeoInfo {
  if (category && CATEGORY_SEO_INFO[category]) {
    return CATEGORY_SEO_INFO[category];
  }
  const cleanCat = (category || "").trim();
  const matchedKey = Object.keys(CATEGORY_SEO_INFO).find(
    (k) =>
      cleanCat.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(cleanCat.toLowerCase())
  );
  if (matchedKey) {
    return CATEGORY_SEO_INFO[matchedKey];
  }
  if (cleanCat && cleanCat.toLowerCase() !== "other") {
    const lower = cleanCat.toLowerCase();
    return {
      singular: lower,
      plural: `${lower} places`,
      localQuery: `${lower} spots in the area`,
      highlightTerm: `${lower} service`,
    };
  }
  return CATEGORY_SEO_INFO["Other"];
}

function formatCustomHighlight(custom?: string): string {
  if (!custom || !custom.trim()) return "";
  const cleaned = custom.trim().replace(/^[,.\s]+|[,.\s]+$/g, "");
  if (!cleaned) return "";
  return `Special mention for the ${cleaned}—absolutely loved it! `;
}

// Natural, human-sounding neutral 5-star reviews with local SEO search keywords
const NEUTRAL_TEMPLATES: ((name: string, seo: CategorySeoInfo, extra: string) => string)[] = [
  (name, seo, extra) =>
    `Hands down one of the best ${seo.plural} in town! Visited ${name} and had an amazing experience from start to finish. The team was super welcoming, the place was spotless, and the service was quick. ${extra}Easily a 5-star recommendation for anyone in the area!`,
  (name, seo, extra) =>
    `If you're looking for a top-rated ${seo.singular} around here, ${name} is definitely the place to go. Welcoming atmosphere, prompt service, and genuinely great value for money. ${extra}Will definitely be a regular customer from now on. Highly recommended!`,
  (name, seo, extra) =>
    `Really impressed with my visit to ${name}! Easily one of the top ${seo.localQuery}. Staff was courteous, everything was organized, and the whole experience was smooth. ${extra}10/10, definitely worth visiting!`,
  (name, seo, extra) =>
    `Came across ${name} recently and it truly exceeded expectations. Hands down one of my favorite ${seo.plural} around. Great hospitality, fair pricing, and top quality. ${extra}Definitely giving 5 stars and telling friends and family about this place!`,
  (name, seo, extra) =>
    `Such a wonderful experience at ${name}! By far one of the best ${seo.plural} in the area if you want dependable quality and friendly service. ${extra}Everything was handled with so much care. Don't hesitate to check them out!`,
  (name, seo, extra) =>
    `Had a fantastic visit to ${name} today. Super clean, polite staff, and top notch service throughout. Honestly one of the best ${seo.plural} in town. ${extra}5 stars all the way!`,
];

export interface TemplateOptions {
  businessName: string;
  category: string;
  selectedAttributes: string[];
  customHighlight?: string;
  previousIndex?: number;
}

// Natural, human-sounding attribute reviews with high-ranking Google local search keywords
const ATTRIBUTE_TEMPLATES: ((
  n: string,
  f: string,
  a1: string,
  rest: string,
  seo: CategorySeoInfo,
  extra: string
) => string)[] = [
  // 0: Warm & Local Top Pick
  (n, f, _a1, _rest, seo, extra) =>
    `Honestly one of the best ${seo.plural} in town! Visited ${n} today and the ${f} was absolutely top tier. Super courteous team, great ambiance, and prompt service. ${extra}Hands down a 5-star experience, highly recommend to anyone in the area!`,

  // 1: Conversational & Search Intent ("If you're looking for...")
  (n, _f, a1, rest, seo, extra) =>
    rest
      ? `If you're looking for a top-rated ${seo.singular} in the area, ${n} is easily the go-to spot! The ${a1} really stood out, and the ${rest} made the visit even better. Friendly staff and top-notch service all around. ${extra}Definitely giving 5 stars!`
      : `If you're looking for a top-rated ${seo.singular} in the area, ${n} is easily the go-to spot! The ${a1} really stood out. Friendly staff and top-notch service all around. ${extra}Definitely giving 5 stars!`,

  // 2: Local Recommendation & Value Focus
  (n, f, _a1, _rest, seo, extra) =>
    `Came by ${n} and was thoroughly impressed. By far one of the top ${seo.localQuery}. What really stood out was the ${f}—everything was clean, well managed, and worth every rupee. ${extra}Will definitely be coming back again soon!`,

  // 3: Enthusiastic 10/10 with Special Shoutout
  (n, f, _a1, _rest, seo, extra) =>
    `Such an awesome experience at ${n}! Special shoutout for the ${f}—it definitely set a high benchmark. Easily one of the best ${seo.plural} around here. Super friendly people and fast service. ${extra}10/10 recommended!`,

  // 4: Genuine & Neighborhood Favorite
  (n, _f, a1, rest, seo, extra) =>
    rest
      ? `Stopped by ${n} and had a genuinely fantastic time. Loved the ${a1}, and the team really delivered on the ${rest}. Easily one of the most reliable ${seo.plural} in the neighborhood. ${extra}Keep up the great work guys!`
      : `Stopped by ${n} and had a genuinely fantastic time. The ${a1} was totally on point and the hospitality was excellent. Easily one of the most reliable ${seo.plural} in the neighborhood. ${extra}Keep up the great work guys!`,

  // 5: Consistent Quality & 5 Stars
  (n, f, _a1, _rest, seo, extra) =>
    `One of the best ${seo.plural} in town without question! The ${f} at ${n} was consistently top quality. Super helpful team, welcoming vibe, and great attention to detail. ${extra}A solid 5-star place in the area!`,

  // 6: Smooth Experience & Top Recommendation
  (n, _f, a1, rest, seo, extra) =>
    rest
      ? `Had a super smooth visit to ${n}. Particularly impressed with the ${a1}, and also really appreciated the ${rest}. Hands down one of the best ${seo.localQuery}. ${extra}Don't think twice before visiting—top quality all the way!`
      : `Had a super smooth visit to ${n}. Particularly impressed with the ${a1}. Hands down one of the best ${seo.localQuery}. ${extra}Don't think twice before visiting—top quality all the way!`,

  // 7: Exceeded Expectations & High Standard
  (n, f, _a1, _rest, seo, extra) =>
    `Very satisfied with my experience at ${n}! The ${f} definitely exceeded expectations. Easily ranks among the top ${seo.plural} in the area for both quality and customer care. ${extra}Prompt service, fair pricing, and courteous staff. Highly recommended!`,

  // 8: Local Go-To & First-Time Visitor
  (n, f, _a1, _rest, seo, extra) =>
    `First time visiting ${n} and I was completely blown away! The ${f} was top notch, and the staff made sure everything was smooth and comfortable. Truly one of the best ${seo.plural} around here. ${extra}Will definitely be recommending this to everyone!`,
];

export function generateReviewDraft(options: TemplateOptions): { draft: string; templateIndex: number } {
  const name = options.businessName.trim() || "this business";
  const attrs = options.selectedAttributes;
  const prev = options.previousIndex ?? -1;
  const seo = getCategorySeoInfo(options.category);
  const extra = formatCustomHighlight(options.customHighlight);

  if (attrs.length === 0) {
    const total = NEUTRAL_TEMPLATES.length;
    let nextIndex = Math.floor(Math.random() * total);
    if (nextIndex === prev && total > 1) {
      nextIndex = (nextIndex + 1) % total;
    }
    return {
      draft: NEUTRAL_TEMPLATES[nextIndex](name, seo, extra),
      templateIndex: nextIndex,
    };
  }

  const formatted = formatAttributesList(attrs);
  const firstAttr = attrs[0].toLowerCase();
  const restAttrs = attrs.length > 1 ? formatAttributesList(attrs.slice(1)) : "";

  const total = ATTRIBUTE_TEMPLATES.length;
  let nextIndex = Math.floor(Math.random() * total);
  if (nextIndex === prev && total > 1) {
    nextIndex = (nextIndex + 1) % total;
  }

  const draft = ATTRIBUTE_TEMPLATES[nextIndex](name, formatted, firstAttr, restAttrs, seo, extra);
  return { draft, templateIndex: nextIndex };
}
