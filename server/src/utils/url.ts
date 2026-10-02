export const LINK_ICONS: string[] = [
  "instagram", "facebook", "website", "google-maps", "google-reviews", "whatsapp", "youtube",
  "linkedin", "x", "telegram", "menu", "zomato", "swiggy", "booking", "phone", "email", "custom",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returns a safe, normalized URL (http, https, tel or mailto only) or null if invalid.
export function normalizeUrl(raw: string, icon: string): string | null {
  const value = raw.trim();
  if (!value || value.length > 2000) return null;

  if (icon === "phone") {
    const digits = value.replace(/^tel:/i, "").replace(/[\s\-().]/g, "");
    return /^\+?\d{5,15}$/.test(digits) ? `tel:${digits}` : null;
  }
  if (icon === "email") {
    const email = value.replace(/^mailto:/i, "");
    return EMAIL_RE.test(email) ? `mailto:${email}` : null;
  }

  if (/\s/.test(value)) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;
  try {
    const u = new URL(withScheme);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (!u.hostname.includes(".")) return null;
    return u.href;
  } catch {
    return null;
  }
}

export function urlErrorMessage(icon: string): string {
  if (icon === "phone") return "Enter a valid phone number, e.g. +919876543210";
  if (icon === "email") return "Enter a valid email address";
  return "Enter a valid URL, e.g. https://example.com";
}
