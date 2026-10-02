// Base URL used for public profile links (and later, the QR code)
export const publicBase = (import.meta.env.VITE_PUBLIC_URL || window.location.origin).replace(/\/$/, "");
export const publicUrl = (slug: string) => `${publicBase}/p/${slug}`;
