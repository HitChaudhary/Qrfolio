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

const NEUTRAL_TEMPLATES = [
  (name: string) =>
    `I recently visited ${name}. Overall, my experience was smooth and straightforward. Sharing my honest feedback to help future customers know what to expect.`,
  (name: string) =>
    `Visited ${name} recently. The service met expectations and the staff was available when needed. A dependable choice if you are in the area.`,
  (name: string) =>
    `Sharing my thoughts on ${name} after a recent visit. The overall visit was decent and everything was handled in an orderly manner.`,
  (name: string) =>
    `My experience with ${name}: The visit went well and as anticipated. Happy to share my genuine impressions here.`,
];

interface TemplateOptions {
  businessName: string;
  category: string;
  selectedAttributes: string[];
  previousIndex?: number;
}

export function generateReviewDraft(options: TemplateOptions): { draft: string; templateIndex: number } {
  const name = options.businessName.trim() || "this business";
  const attrs = options.selectedAttributes;
  const prev = options.previousIndex ?? -1;

  if (attrs.length === 0) {
    const total = NEUTRAL_TEMPLATES.length;
    let nextIndex = Math.floor(Math.random() * total);
    if (nextIndex === prev && total > 1) {
      nextIndex = (nextIndex + 1) % total;
    }
    return {
      draft: NEUTRAL_TEMPLATES[nextIndex](name),
      templateIndex: nextIndex,
    };
  }

  const formatted = formatAttributesList(attrs);
  const firstAttr = attrs[0].toLowerCase();
  const restAttrs = attrs.length > 1 ? formatAttributesList(attrs.slice(1)) : "";

  const templates: ((n: string, f: string, a1: string, rest: string) => string)[] = [
    // 0: Short & Balanced
    (n, f) =>
      `Visited ${n} recently. I specifically took note of the ${f}. Overall, everything was well-managed and met expectations. Pleased to share my genuine feedback.`,

    // 1: Medium & Expressive
    (n, _f, a1, rest) =>
      rest
        ? `Had an opportunity to visit ${n}. When it came to ${a1}, the standards were quite clear, and the ${rest} also left a good impression. Appreciate the attention to detail from the team.`
        : `Had an opportunity to visit ${n}. When it came to ${a1}, the experience was well-handled and positive. Appreciate the care from the team.`,

    // 2: Structured & Clear
    (n, f) =>
      `Sharing my review for ${n}. My experience was centered around the ${f}. The staff was attentive and the overall quality was consistent. Glad to recommend them based on this visit.`,

    // 3: Concise & Direct
    (n, f) =>
      `Had a good experience at ${n}. The ${f} definitely stood out during my visit. Would consider visiting again.`,

    // 4: Balanced & Constructive
    (n, _f, a1, rest) =>
      rest
        ? `Visited ${n} recently and wanted to leave some honest feedback. The ${a1} was handled well, and the ${rest} contributed to a solid overall experience. Keep up the good work!`
        : `Visited ${n} recently and wanted to leave some honest feedback. The ${a1} stood out positively and made for a smooth visit. Keep up the good work!`,

    // 5: Thoughtful & Personal
    (n, f) =>
      `A dependable visit to ${n}. What stood out most to me was the ${f}. Overall, a pleasant experience and worth sharing.`,
  ];

  const total = templates.length;
  let nextIndex = Math.floor(Math.random() * total);
  if (nextIndex === prev && total > 1) {
    nextIndex = (nextIndex + 1) % total;
  }

  const draft = templates[nextIndex](name, formatted, firstAttr, restAttrs);
  return { draft, templateIndex: nextIndex };
}
