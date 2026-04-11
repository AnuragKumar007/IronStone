// ============================================
// IronStone — TypeScript Interfaces
// ============================================

export interface UserData {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  membershipPlan: "monthly" | "quarterly" | "halfYearly" | "yearly" | null;
  membershipType: "gym" | "trainer" | null;
  membershipStart: Date | null;
  membershipExpiry: Date | null;
  isActive: boolean;
  razorpayPaymentId: string | null;
  createdAt: Date;
}

export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  experience: string;
  photoUrl: string;
  order: number;
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  order: number;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface PricingPlan {
  id: string;
  name: "Monthly" | "Quarterly" | "Half-Yearly" | "Yearly";
  price: number; // in INR (paise for Razorpay)
  duration: number; // in days
  features: string[];
  highlighted: boolean;
  badge?: string; // e.g. "Most Popular", "Best Value"
  // Trainer plan fields
  trainerPrice: number;
  trainerFeatures: string[];
  trainerHighlighted: boolean;
  trainerBadge?: string;
}

export interface PricingSettings {
  showTrainerPlans: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minPlanTier: number;
  maxUses: number;
  currentUses: number;
  usedBy: string[];
  expiresAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
}

export const PLAN_TIER_MAP: Record<string, number> = {
  monthly: 1,
  quarterly: 2,
  halfYearly: 3,
  yearly: 4,
};

export const PLAN_TIER_LABELS: Record<number, string> = {
  1: "All plans",
  2: "Quarterly & above",
  3: "Half-Yearly & above",
  4: "Yearly only",
};

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
  read: boolean;
}
