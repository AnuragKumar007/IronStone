// ============================================
// POST /api/payment/verify — Verify Razorpay Payment & Update User
// ============================================
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId, signature, planId, planType, duration, couponCode } = await req.json();

    if (!orderId || !paymentId || !signature || !planId || !duration) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Step 1: Verify HMAC signature
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Step 2: Ensure Firebase Admin is initialized
    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        { error: "Server not configured — Firebase Admin unavailable" },
        { status: 503 }
      );
    }

    // Step 3: Get user from session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("ironstone-session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const uid = decodedToken.uid;

    // Step 4: Update user document with membership details
    const now = new Date();
    const expiry = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);

    await adminDb.collection("users").doc(uid).update({
      membershipPlan: planId,
      membershipType: planType || "gym",
      membershipStart: now,
      membershipExpiry: expiry,
      isActive: true,
      razorpayPaymentId: paymentId,
    });

    // Step 5: Mark coupon as used (if one was applied)
    if (couponCode) {
      const couponsSnap = await adminDb
        .collection("coupons")
        .where("code", "==", couponCode.toUpperCase())
        .limit(1)
        .get();

      if (!couponsSnap.empty) {
        const couponDoc = couponsSnap.docs[0];
        await couponDoc.ref.update({
          currentUses: FieldValue.increment(1),
          usedBy: FieldValue.arrayUnion(uid),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment verification failed:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
