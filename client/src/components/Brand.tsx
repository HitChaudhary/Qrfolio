import { Link } from "react-router-dom";
import QrfolioLogo from "./QrfolioLogo";

export interface BrandProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  link?: boolean;
  className?: string;
  showBadge?: boolean;
  mode?: "light" | "dark" | "auto";
  animated?: boolean;
}

export default function Brand({
  size = "md",
  link = true,
  className = "",
  showBadge = false,
  mode = "light",
  animated = false,
}: BrandProps) {
  const content = (
    <QrfolioLogo
      size={size}
      variant="full"
      mode={mode}
      animated={animated}
      showBadge={showBadge}
      className={className}
    />
  );

  if (link) {
    return (
      <Link to="/" className="group inline-flex items-center outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
