import { BusinessProfile } from "../models/BusinessProfile";

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function slugify(input: string): string {
  const base = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 34)
    .replace(/-+$/g, "");
  if (base.length >= 3) return base;
  return base ? `${base}-biz` : "business";
}

export async function uniqueSlug(name: string): Promise<string> {
  const base = slugify(name);
  for (let i = 0; i < 20; i++) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`;
    if (!(await BusinessProfile.exists({ slug: candidate }))) return candidate;
  }
  return `${base}-${Math.random().toString(36).slice(2, 8)}`;
}
