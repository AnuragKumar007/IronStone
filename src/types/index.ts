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
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
  read: boolean;
}
