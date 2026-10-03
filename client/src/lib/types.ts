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

// ---------- Admin panel ----------
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  businessCount?: number;
}

export interface AdminBusinessSummary {
  id: string;
  businessName: string;
  slug: string;
  category: string;
  logoUrl: string;
  isActive: boolean;
  scanCount: number;
  linkCount: number;
  createdAt: string;
  owner: { id: string; name: string; email: string } | null;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

export interface AdminDashboardData {
  totalUsers: number;
  totalBusinesses: number;
  activeBusinesses: number;
  inactiveBusinesses: number;
  totalScans: number;
  newUsers: number;
  newBusinesses: number;
  recentUsers: AdminUser[];
  recentBusinesses: AdminBusinessSummary[];
}

export interface AdminUserDetailData {
  user: AdminUser;
  businesses: AdminBusinessSummary[];
}

export interface AdminBusinessDetailData {
  business: {
    id: string;
    businessName: string;
    description: string;
    category: string;
    slug: string;
    logoUrl: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    owner: { id: string; name: string; email: string } | null;
  };
  links: { id: string; title: string; url: string; icon: string; isActive: boolean; position: number; clicks: number }[];
  analytics: { totalScans: number; today: number; thisMonth: number; totalClicks: number };
}

export interface AdminAnalyticsData {
  totalScans: number;
  today: number;
  thisMonth: number;
  totalClicks: number;
  clicksThisMonth: number;
  daily: { date: string; scans: number; clicks: number }[];
  topBusinesses: {
    id: string;
    businessName: string;
    slug: string;
    isActive: boolean;
    scans: number;
    clicks: number;
    owner: string | null;
  }[];
}
