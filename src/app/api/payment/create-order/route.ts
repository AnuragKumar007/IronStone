// ============================================
// POST /api/payment/create-order — Create Razorpay Order
// ============================================
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

const PLAN_TIER_MAP: Record<string, number> = {
  monthly: 1,
  quarterly: 2,
  halfYearly: 3,
  yearly: 4,
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { planId, planType, amount, couponCode } = await req.json();

    if (!planId || !amount) {
      return NextResponse.json(
        { error: "Missing planId or amount" },
        { status: 400 }
      );
    }

    let finalAmount = amount; // in paise
    let couponId: string | null = null;

    // Server-side coupon re-validation if coupon was applied
    if (couponCode && adminDb && adminAuth) {
      // Get user
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get("ironstone-session")?.value;
      if (!sessionCookie) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
      const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
      const userId = decodedToken.uid;

      // Fetch coupon
      const couponsSnap = await adminDb
        .collection("coupons")
        .where("code", "==", couponCode.toUpperCase())
        .limit(1)
        .get();

      if (couponsSnap.empty) {
        return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
      }

      const couponDoc = couponsSnap.docs[0];
      const coupon = couponDoc.data();
      couponId = couponDoc.id;

      // Re-validate all conditions
      if (!coupon.isActive) {
        return NextResponse.json({ error: "Coupon is no longer active" }, { status: 400 });
      }
      if (coupon.expiresAt) {
        const expiryDate = coupon.expiresAt.toDate ? coupon.expiresAt.toDate() : new Date(coupon.expiresAt);
        if (new Date() > expiryDate) {
          return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
        }
      }
      if (coupon.usedBy && coupon.usedBy.includes(userId)) {
        return NextResponse.json({ error: "You have already used this coupon" }, { status: 400 });
      }
      if (coupon.maxUses > 0 && coupon.currentUses >= coupon.maxUses) {
        return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
      }
      const planTier = PLAN_TIER_MAP[planId];
      if (!planTier || planTier < coupon.minPlanTier) {
        return NextResponse.json({ error: "Coupon not valid for this plan" }, { status: 400 });
      }

      // Calculate server-side discount (amount is in paise, prices in INR)
      const planPriceINR = amount / 100;
      let discount: number;
      if (coupon.discountType === "percentage") {
        discount = Math.round(planPriceINR * (coupon.discountValue / 100));
      } else {
        discount = coupon.discountValue;
      }
      discount = Math.min(discount, planPriceINR);
      const finalPriceINR = planPriceINR - discount;
      finalAmount = Math.max(finalPriceINR * 100, 100); // Razorpay minimum ₹1 (100 paise)
    }

    const order = await razorpay.orders.create({
      amount: finalAmount,
      currency: "INR",
      receipt: `ironstone_${planId}_${planType || "gym"}_${Date.now()}`,
      notes: {
        planId,
        planType: planType || "gym",
        ...(couponId ? { couponId, couponCode: couponCode.toUpperCase() } : {}),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      couponId,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
