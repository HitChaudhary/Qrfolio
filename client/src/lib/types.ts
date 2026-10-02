export interface BusinessLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
  position: number;
}

export interface Business {
  id: string;
  businessName: string;
  description: string;
  category: string;
  slug: string;
  logoUrl: string;
  links: BusinessLink[];
  scanCount: number;
  isActive: boolean;
}

export interface PublicLink {
  id: string;
  title: string;
  url: string;
  icon: string;
}

export interface PublicProfileData {
  profileId: string;
  businessName: string;
  description: string;
  category: string;
  logoUrl: string;
  links: PublicLink[];
}

export interface Analytics {
  totalScans: number;
  today: number;
  thisMonth: number;
  totalClicks: number;
  links: { id: string; title: string; icon: string; clicks: number }[];
}
