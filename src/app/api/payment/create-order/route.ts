// ============================================
// POST /api/payment/create-order — Create Razorpay Order
// ============================================
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { planId, amount } = await req.json();

    if (!planId || !amount) {
      return NextResponse.json(
        { error: "Missing planId or amount" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount, // amount in paise
      currency: "INR",
      receipt: `ironstone_${planId}_${Date.now()}`,
      notes: { planId },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
