import {
  Bike, BookOpen, CalendarCheck, Facebook, Globe, Instagram, Link2, Linkedin, Mail,
  MapPin, MessageCircle, Phone, Send, Star, Twitter, UtensilsCrossed, Youtube,
  type LucideIcon,
} from "lucide-react";

export interface LinkType {
  value: string;
  label: string;
  Icon: LucideIcon;
  placeholder: string;
}

export const LINK_TYPES: LinkType[] = [
  { value: "instagram", label: "Instagram", Icon: Instagram, placeholder: "https://instagram.com/yourbusiness" },
  { value: "facebook", label: "Facebook", Icon: Facebook, placeholder: "https://facebook.com/yourbusiness" },
  { value: "website", label: "Website", Icon: Globe, placeholder: "https://yourbusiness.com" },
  { value: "google-maps", label: "Google Maps", Icon: MapPin, placeholder: "https://maps.app.goo.gl/..." },
  { value: "google-reviews", label: "Google Reviews", Icon: Star, placeholder: "https://g.page/r/.../review" },
  { value: "whatsapp", label: "WhatsApp", Icon: MessageCircle, placeholder: "https://wa.me/919876543210" },
  { value: "youtube", label: "YouTube", Icon: Youtube, placeholder: "https://youtube.com/@yourbusiness" },
  { value: "linkedin", label: "LinkedIn", Icon: Linkedin, placeholder: "https://linkedin.com/company/yourbusiness" },
  { value: "x", label: "X", Icon: Twitter, placeholder: "https://x.com/yourbusiness" },
  { value: "telegram", label: "Telegram", Icon: Send, placeholder: "https://t.me/yourbusiness" },
  { value: "menu", label: "Menu", Icon: BookOpen, placeholder: "https://yourbusiness.com/menu" },
  { value: "zomato", label: "Zomato", Icon: UtensilsCrossed, placeholder: "https://zomato.com/..." },
  { value: "swiggy", label: "Swiggy", Icon: Bike, placeholder: "https://swiggy.com/..." },
  { value: "booking", label: "Booking", Icon: CalendarCheck, placeholder: "https://yourbusiness.com/book" },
  { value: "phone", label: "Phone", Icon: Phone, placeholder: "+919876543210" },
  { value: "email", label: "Email", Icon: Mail, placeholder: "hello@yourbusiness.com" },
  { value: "custom", label: "Custom Link", Icon: Link2, placeholder: "https://" },
];

export const getLinkType = (value: string): LinkType =>
  LINK_TYPES.find((t) => t.value === value) ?? LINK_TYPES[LINK_TYPES.length - 1];
