"use client";
// ============================================
// Pricing Page — Membership Plans & Razorpay Checkout
// ============================================
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import PageHero from "@/components/PageHero";

interface Plan {
  id: string;
  name: string;
  price: number; // INR display price
  pricePaise: number; // INR paise for Razorpay
  duration: number; // days
  perMonth: number;
  features: string[];
  highlighted: boolean;
  badge?: string;
}

const plans: Plan[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: 1499,
    pricePaise: 149900,
    duration: 30,
    perMonth: 1499,
    features: [
      "Full gym access",
      "Locker facility",
      "Basic fitness assessment",
      "Access to all equipment",
      "Open gym hours (6 AM – 10 PM)",
    ],
    highlighted: false,
  },
  {
    id: "quarterly",
    name: "Quarterly",
    price: 3999,
    pricePaise: 399900,
    duration: 90,
    perMonth: 1333,
    features: [
      "Everything in Monthly",
      "1 personal training session / month",
      "Diet consultation",
      "Progress tracking",
      "Guest pass (1 / month)",
    ],
    highlighted: false,
  },
  {
    id: "halfYearly",
    name: "Half-Yearly",
    price: 6999,
    pricePaise: 699900,
    duration: 180,
    perMonth: 1167,
    features: [
      "Everything in Quarterly",
      "2 personal training sessions / month",
      "Custom workout plan",
      "Body composition analysis",
      "Priority booking for classes",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "yearly",
    name: "Yearly",
    price: 11999,
    pricePaise: 1199900,
    duration: 365,
    perMonth: 1000,
    features: [
      "Everything in Half-Yearly",
      "4 personal training sessions / month",
      "Unlimited guest passes",
      "Exclusive member events",
      "Free merchandise kit",
      "Freeze membership (up to 30 days)",
    ],
    highlighted: false,
    badge: "Best Value",
  },
];

export default function PricingPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".pricing-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.4,
      }
    );
  }, []);

  const handleCheckout = async (plan: Plan) => {
    setSelectedPlan(plan.id);
    setProcessing(true);

    try {
      // Step 1: Create Razorpay order on server
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          amount: plan.pricePaise,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      const { orderId, amount, currency } = await res.json();

      // Step 2: Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "IronStone Gym",
        description: `${plan.name} Membership`,
        order_id: orderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // Step 3: Verify payment on server
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              planId: plan.id,
              duration: plan.duration,
            }),
          });

          if (verifyRes.ok) {
            window.location.href = "/profile?payment=success";
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        theme: { color: "#dc2626" },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 md:px-16 py-16">
        <PageHero
          badge="Membership"
          badgeIcon="ri-price-tag-3-fill"
          title="Choose Your Plan"
          highlight="Plan"
          description="Flexible membership plans designed to fit your fitness journey. No hidden fees, cancel anytime."
        />

        {/* Plans Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card relative rounded-3xl border p-8 flex flex-col transition-all duration-300
                ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-red-950/40 to-[#0d0d0d] border-red-700 scale-[1.02] shadow-lg shadow-red-900/20"
                    : "bg-[#0d0d0d] border-zinc-800 hover:border-zinc-600"
                }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className={`px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-full
                    ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-red-600 to-red-800 text-white"
                        : "bg-zinc-800 text-gray-300 border border-zinc-700"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-1 mt-2">
                {plan.name}
              </h3>
              <p className="text-gray-500 text-sm mb-6">{plan.duration} days</p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-gray-500 text-lg">₹</span>
                  <span className="text-4xl font-black text-white">
                    {plan.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  ₹{plan.perMonth.toLocaleString("en-IN")} / month
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <i
                      className={`ri-check-line text-sm mt-0.5 ${
                        plan.highlighted ? "text-red-500" : "text-green-500"
                      }`}
                    ></i>
                    <span className="text-gray-400 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleCheckout(plan)}
                disabled={processing && selectedPlan === plan.id}
                className={`w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300
                  ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-red-600 to-red-800 text-white hover:shadow-lg hover:shadow-red-900/30 hover:-translate-y-0.5"
                      : "bg-zinc-900 border border-zinc-700 text-white hover:border-red-600 hover:text-red-500"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {processing && selectedPlan === plan.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-loader-4-line animate-spin"></i>
                    Processing...
                  </span>
                ) : (
                  <>
                    Get Started
                    <i className="ri-arrow-right-line ml-2"></i>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center max-w-2xl">
            <div className="flex items-center gap-6 text-gray-600 text-sm mb-6">
              <span className="flex items-center gap-2">
                <i className="ri-shield-check-line text-green-500"></i>
                Secure Payment
              </span>
              <span className="flex items-center gap-2">
                <i className="ri-refresh-line text-blue-500"></i>
                Easy Renewal
              </span>
              <span className="flex items-center gap-2">
                <i className="ri-customer-service-2-line text-orange-500"></i>
                24/7 Support
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              All plans include full access to our 10,000 sq. ft. facility.
              Payments powered by Razorpay. GST included.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
