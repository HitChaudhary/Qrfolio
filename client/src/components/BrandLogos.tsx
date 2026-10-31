import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * Authentic 4-color Google "G" Logo
 */
export function GoogleLogo({ size = 20, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      aria-label="Google"
    >
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.14 0 9.99 0 12s.45 3.86 1.24 5.42l4.04-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

/**
 * Authentic WhatsApp Green Chat Logo
 */
export function WhatsAppLogo({ size = 20, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      aria-label="WhatsApp"
    >
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        fill="#FFFFFF"
        d="M17.5 14.3c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.36.22-.66.08-.3-.15-1.28-.47-2.43-1.5-.9-.8-1.5-1.8-1.68-2.1-.18-.3-.02-.46.13-.6.14-.14.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.65-.94-2.26-.25-.6-.5-.52-.68-.53l-.58-.01c-.2 0-.53.08-.8.38-.28.3-1.07 1.05-1.07 2.56 0 1.5 1.1 2.96 1.25 3.16.15.2 2.15 3.3 5.2 4.62.73.31 1.3.5 1.74.64.73.23 1.4.2 1.93.12.59-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.07-.12-.27-.2-.57-.35z"
      />
      <path
        fill="#FFFFFF"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3.6c-4.63 0-8.4 3.77-8.4 8.4 0 1.48.39 2.93 1.12 4.2L3.6 20.4l4.33-1.1c1.23.68 2.62 1.04 4.07 1.04 4.63 0 8.4-3.77 8.4-8.4 0-4.63-3.77-8.34-8.4-8.34zm0 15.3c-1.3 0-2.57-.34-3.69-.99l-.26-.16-2.57.67.69-2.5-.18-.28A6.87 6.87 0 0 1 5.1 12c0-3.8 3.1-6.9 6.9-6.9 3.8 0 6.9 3.1 6.9 6.9 0 3.8-3.1 6.9-6.9 6.9z"
      />
    </svg>
  );
}

/**
 * Authentic Instagram Vibrant Multi-Color Gradient Camera Logo
 */
export function InstagramLogo({ size = 20, className = "" }: LogoProps) {
  const gradientId = React.useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      aria-label="Instagram"
    >
      <defs>
        <radialGradient id={`${gradientId}-ig`} cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6.5" fill={`url(#${gradientId}-ig)`} />
      <rect
        x="3.2"
        y="3.2"
        width="17.6"
        height="17.6"
        rx="5"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * Authentic 4-color Google Maps Pin Logo
 */
export function GoogleMapsLogo({ size = 20, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      aria-label="Google Maps"
    >
      {/* Red Pin Cap */}
      <path
        fill="#EA4335"
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      />
      {/* Center White Aperture */}
      <circle cx="12" cy="9" r="2.8" fill="#FFFFFF" />
      {/* Lower Shadow Accent */}
      <path
        fill="#34A853"
        d="M12 22s2.5-3.2 4.2-6.5L12 18.5 7.8 15.5C9.5 18.8 12 22 12 22z"
        opacity="0.9"
      />
      {/* Yellow/Blue folds */}
      <path
        fill="#4285F4"
        d="M12 9c-1.55 0-2.8 1.25-2.8 2.8 0 .8.34 1.52.88 2.03L12 11.5l1.92 2.33c.54-.51.88-1.23.88-2.03 0-1.55-1.25-2.8-2.8-2.8z"
        opacity="0.3"
      />
    </svg>
  );
}

/**
 * Sleek Modern Custom Website / Web Portal Logo
 */
export function WebsiteLogo({ size = 20, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      aria-label="Website"
    >
      <circle cx="12" cy="12" r="11" fill="#0284c7" />
      <circle cx="12" cy="12" r="10" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
      <ellipse cx="12" cy="12" rx="4.5" ry="10" fill="none" stroke="#FFFFFF" strokeWidth="1.3" />
      <line x1="2" y1="12" x2="22" y2="12" stroke="#FFFFFF" strokeWidth="1.3" />
      <line x1="4.5" y1="7.2" x2="19.5" y2="7.2" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.8" />
      <line x1="4.5" y1="16.8" x2="19.5" y2="16.8" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.8" />
    </svg>
  );
}

/**
 * Universal Brand & Icon Resolver
 */
export function BrandLogo({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const normalized = name.toLowerCase().trim();

  if (normalized.includes("google") || normalized.includes("review")) {
    return <GoogleLogo size={size} className={className} />;
  }
  if (normalized.includes("whatsapp") || normalized.includes("wa")) {
    return <WhatsAppLogo size={size} className={className} />;
  }
  if (normalized.includes("insta")) {
    return <InstagramLogo size={size} className={className} />;
  }
  if (normalized.includes("map") || normalized.includes("direction")) {
    return <GoogleMapsLogo size={size} className={className} />;
  }
  if (
    normalized.includes("web") ||
    normalized.includes("site") ||
    normalized.includes("globe") ||
    normalized.includes("portal")
  ) {
    return <WebsiteLogo size={size} className={className} />;
  }

  // Fallback to Website logo
  return <WebsiteLogo size={size} className={className} />;
}
