// ============================================
// POST /api/coupon/validate — Validate coupon for a plan
// ============================================
import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

const PLAN_TIER_MAP: Record<string, number> = {
  monthly: 1,
  quarterly: 2,
  halfYearly: 3,
  yearly: 4,
};

const PLAN_TIER_LABELS: Record<number, string> = {
  1: "All plans",
  2: "Quarterly & above",
  3: "Half-Yearly & above",
  4: "Yearly only",
};

export async function POST(req: NextRequest) {
  try {
    const { code, planId, planType, planPrice } = await req.json();

    if (!code || !planId || !planPrice) {
      return NextResponse.json(
        { valid: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        { valid: false, error: "Server not configured" },
        { status: 503 }
      );
    }

    // Get user from session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("ironstone-session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { valid: false, error: "You must be logged in to use coupons" },
        { status: 401 }
      );
    }

    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userId = decodedToken.uid;

    // Find coupon by code
    const couponsRef = adminDb.collection("coupons");
    const snap = await couponsRef.where("code", "==", code.toUpperCase()).limit(1).get();

    if (snap.empty) {
      return NextResponse.json({ valid: false, error: "Invalid coupon code" });
    }

    const couponDoc = snap.docs[0];
    const coupon = couponDoc.data();

    // Validate active
    if (!coupon.isActive) {
      return NextResponse.json({ valid: false, error: "This coupon is no longer active" });
    }

    // Validate expiry
    if (coupon.expiresAt) {
      const expiryDate = coupon.expiresAt.toDate ? coupon.expiresAt.toDate() : new Date(coupon.expiresAt);
      if (new Date() > expiryDate) {
        return NextResponse.json({ valid: false, error: "This coupon has expired" });
      }
    }

    // Validate one-time use per user
    if (coupon.usedBy && coupon.usedBy.includes(userId)) {
      return NextResponse.json({ valid: false, error: "You have already used this coupon" });
    }

    // Validate max uses
    if (coupon.maxUses > 0 && coupon.currentUses >= coupon.maxUses) {
      return NextResponse.json({ valid: false, error: "This coupon has reached its usage limit" });
    }

    // Validate plan tier
    const planTier = PLAN_TIER_MAP[planId];
    if (!planTier || planTier < coupon.minPlanTier) {
      const minLabel = PLAN_TIER_LABELS[coupon.minPlanTier] || "this plan";
      return NextResponse.json({
        valid: false,
        error: `This coupon is only valid for ${minLabel}`,
      });
    }

    // Calculate discount
    let discount: number;
    if (coupon.discountType === "percentage") {
      discount = Math.round(planPrice * (coupon.discountValue / 100));
    } else {
      discount = coupon.discountValue;
    }
    discount = Math.min(discount, planPrice);
    const finalPrice = planPrice - discount;

    return NextResponse.json({
      valid: true,
      couponId: couponDoc.id,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount,
      finalPrice,
      planType: planType || "gym",
    });
  } catch (error) {
    console.error("Coupon validation failed:", error);
    return NextResponse.json(
      { valid: false, error: "Validation failed" },
      { status: 500 }
    );
  }
}
