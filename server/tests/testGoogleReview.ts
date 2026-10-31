import assert from "node:assert";
import { LINK_ICONS, normalizeUrl, urlErrorMessage } from "../src/utils/url";
import { BUSINESS_CATEGORIES, getCategoryAttributes, generateReviewDraft } from "../../client/src/lib/reviewSuggestions";

console.log("=== RUNNING GOOGLE REVIEW ASSISTANT TESTS ===\n");

// 1. Verify link icon list includes google-reviews
console.log("Test 1: Verify LINK_ICONS includes google-reviews");
assert.ok(LINK_ICONS.includes("google-reviews"), "LINK_ICONS must include google-reviews");
console.log("✓ Passed");

// 2. Test URL Normalization & Validation for google-reviews
console.log("\nTest 2: Test Google Review URL normalization");
const validUrls = [
  "https://g.page/r/Cb923x/review",
  "http://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
  "https://maps.app.goo.gl/abc12345",
  "g.page/r/sample/review", // should auto prepend https://
];

for (const u of validUrls) {
  const normalized = normalizeUrl(u, "google-reviews");
  assert.ok(normalized, `Expected ${u} to be valid`);
  assert.ok(normalized.startsWith("http"), `Expected ${normalized} to start with http`);
}

const invalidUrls = ["not a url", "http://", "ftp://invalid.com", "   "];
for (const u of invalidUrls) {
  const normalized = normalizeUrl(u, "google-reviews");
  assert.strictEqual(normalized, null, `Expected ${u} to be invalid`);
}

assert.ok(urlErrorMessage("google-reviews").includes("Google Review URL"));
console.log("✓ Passed");

// 3. Test Business Categories
console.log("\nTest 3: Test Business Categories list");
const expectedCategories = [
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
];

assert.strictEqual(BUSINESS_CATEGORIES.length, 12, "Should have 12 predefined categories");
for (const cat of expectedCategories) {
  assert.ok(BUSINESS_CATEGORIES.includes(cat as any), `Category ${cat} must be in BUSINESS_CATEGORIES`);
  const attrs = getCategoryAttributes(cat);
  assert.ok(Array.isArray(attrs) && attrs.length >= 4, `Category ${cat} must have at least 4 experience attributes`);
}
console.log("✓ Passed");

// 4. Test Review Generation without attributes (neutral draft)
console.log("\nTest 4: Neutral Review Draft (no attributes selected)");
const neutralDraft1 = generateReviewDraft({
  businessName: "Bean & Brew Café",
  category: "Restaurant / Café",
  selectedAttributes: [],
});
assert.ok(neutralDraft1.draft.includes("Bean & Brew Café"), "Draft must mention business name");
assert.ok(neutralDraft1.draft.length > 20, "Draft must have content");
console.log("Sample neutral draft:", neutralDraft1.draft);
console.log("✓ Passed");

// 5. Test Review Generation with single attribute
console.log("\nTest 5: Single attribute draft");
const singleAttrDraft = generateReviewDraft({
  businessName: "Glow Hair Salon",
  category: "Salon / Beauty Parlour",
  selectedAttributes: ["Service quality"],
});
assert.ok(singleAttrDraft.draft.includes("Glow Hair Salon"), "Draft must mention business name");
assert.ok(singleAttrDraft.draft.toLowerCase().includes("service quality"), "Draft must mention service quality");
console.log("Sample single attribute draft:", singleAttrDraft.draft);
console.log("✓ Passed");

// 6. Test Review Generation with multiple attributes
console.log("\nTest 6: Multiple attributes draft");
const multiAttrDraft = generateReviewDraft({
  businessName: "Urban Threads",
  category: "Clothing / Fashion Store",
  selectedAttributes: ["Collection & variety", "Fitting & quality", "Pricing & value"],
});
assert.ok(multiAttrDraft.draft.includes("Urban Threads"), "Draft must mention business name");
assert.ok(multiAttrDraft.draft.toLowerCase().includes("collection & variety"), "Draft must mention attributes");
console.log("Sample multi-attribute draft:", multiAttrDraft.draft);
console.log("✓ Passed");

// 7. Test Non-consecutive template generation (Generate Another)
console.log("\nTest 7: Consecutive regeneration avoids repeat template");
let currentPrevIndex = -1;
const draftsGenerated: string[] = [];

for (let i = 0; i < 5; i++) {
  const result = generateReviewDraft({
    businessName: "Apex Fitness Gym",
    category: "Gym / Fitness",
    selectedAttributes: ["Equipment quality", "Trainer guidance"],
    previousIndex: currentPrevIndex,
  });
  if (currentPrevIndex !== -1) {
    assert.notStrictEqual(result.templateIndex, currentPrevIndex, "Consecutive template indices must differ");
  }
  currentPrevIndex = result.templateIndex;
  draftsGenerated.push(result.draft);
}
console.log("Generated 5 distinct drafts without consecutive repeat.");
console.log("✓ Passed");

// 8. Test Review Assistant for all 12 categories
console.log("\nTest 8: Review Assistant generation across all 12 categories");
for (const cat of expectedCategories) {
  const attrs = getCategoryAttributes(cat);
  const sampleAttrs = attrs.slice(0, 2);
  const res = generateReviewDraft({
    businessName: `Test ${cat} Co`,
    category: cat,
    selectedAttributes: sampleAttrs,
  });
  assert.ok(res.draft.includes(`Test ${cat} Co`), `Draft for ${cat} must include business name`);
  assert.ok(res.draft.length > 30, `Draft for ${cat} must be substantial`);
}
console.log("✓ Passed for all 12 categories");

// 8b. Test Custom Mention & Local SEO keywords integration
console.log("\nTest 8b: Test custom highlight and SEO keywords integration");
const seoDraft = generateReviewDraft({
  businessName: "Bean & Brew Café",
  category: "Restaurant / Café",
  selectedAttributes: ["Food quality"],
  customHighlight: "cold brew & blueberry cheesecake",
});
assert.ok(seoDraft.draft.includes("Bean & Brew Café"), "Must include business name");
assert.ok(seoDraft.draft.toLowerCase().includes("food quality"), "Must include attribute");
assert.ok(seoDraft.draft.includes("cold brew & blueberry cheesecake"), "Must include custom highlight");
assert.ok(
  seoDraft.draft.includes("cafes & restaurants") ||
    seoDraft.draft.includes("cafe & restaurant") ||
    seoDraft.draft.includes("cafes and dining spots in the area") ||
    seoDraft.draft.includes("cafes in town"),
  "Must include category SEO search keywords"
);
console.log("Sample SEO draft with custom highlight:\n" + seoDraft.draft);
console.log("✓ Passed");

// 9. Test readLink validation logic (mimicking business controller readLink)
console.log("\nTest 9: Test readLink validation logic");
function mockReadLink(body: any, existing?: any) {
  const icon = body.icon !== undefined ? String(body.icon) : existing?.icon ?? "custom";
  if (!LINK_ICONS.includes(icon)) return { error: "Unknown link type" };

  const title = body.title !== undefined ? String(body.title).trim() : existing?.title ?? "";
  if (title.length < 1 || title.length > 60) return { error: "Title must be 1 to 60 characters" };

  const rawUrl = body.url !== undefined ? String(body.url) : existing?.url ?? "";
  const url = normalizeUrl(rawUrl, icon);
  if (!url) return { error: urlErrorMessage(icon) };

  let reviewCategory = existing?.reviewCategory ?? "";
  let enableReviewAssistant = existing?.enableReviewAssistant ?? false;

  if (icon === "google-reviews") {
    if (body.reviewCategory !== undefined) {
      reviewCategory = String(body.reviewCategory).trim();
    }
    if (!reviewCategory) {
      return { error: "Please select a business category for Google Reviews" };
    }
    if (body.enableReviewAssistant !== undefined) {
      enableReviewAssistant = Boolean(body.enableReviewAssistant);
    } else if (existing?.enableReviewAssistant === undefined) {
      enableReviewAssistant = true;
    }
  }

  return { value: { title, url, icon, reviewCategory, enableReviewAssistant } };
}

// 9a: Google review link without category
const noCat = mockReadLink({
  icon: "google-reviews",
  title: "Review Us",
  url: "https://g.page/r/test/review",
  reviewCategory: "",
});
assert.ok("error" in noCat, "Should fail when reviewCategory is missing");
assert.strictEqual(noCat.error, "Please select a business category for Google Reviews");

// 9b: Google review link with valid fields
const validGoogleLink = mockReadLink({
  icon: "google-reviews",
  title: "Review Us",
  url: "https://g.page/r/test/review",
  reviewCategory: "Restaurant / Café",
  enableReviewAssistant: true,
});
assert.ok("value" in validGoogleLink && validGoogleLink.value, "Should succeed when valid");
if ("value" in validGoogleLink && validGoogleLink.value) {
  assert.strictEqual(validGoogleLink.value.reviewCategory, "Restaurant / Café");
  assert.strictEqual(validGoogleLink.value.enableReviewAssistant, true);
}

// 9c: Non-google link (e.g. WhatsApp, Instagram) unaffected
const whatsappLink = mockReadLink({
  icon: "whatsapp",
  title: "Chat with us",
  url: "https://wa.me/919876543210",
});
assert.ok("value" in whatsappLink && whatsappLink.value, "WhatsApp link should be valid");
if ("value" in whatsappLink && whatsappLink.value) {
  assert.strictEqual(whatsappLink.value.reviewCategory, "");
  assert.strictEqual(whatsappLink.value.enableReviewAssistant, false);
}
console.log("✓ Passed");

console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!");
