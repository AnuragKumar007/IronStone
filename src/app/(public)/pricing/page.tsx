"use client";
// ============================================
// Pricing Page — Membership Plans & Razorpay Checkout
// ============================================
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import PageHero from "@/components/PageHero";
import { Badge, Button } from "@/components/ui";
import { getPricingPlans } from "@/lib/firestore";
import type { PricingPlan } from "@/types";

export default function PricingPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    getPricingPlans()
      .then(setPlans)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // GSAP animation after plans load
  useEffect(() => {
    if (loading || !gridRef.current) return;
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
        delay: 0.2,
      }
    );
  }, [loading]);

  const handleCheckout = async (plan: PricingPlan) => {
    setSelectedPlan(plan.id);
    setProcessing(true);

    try {
      const pricePaise = plan.price * 100;

      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          amount: pricePaise,
        }),
      });

      if (!res.ok) throw new Error("Failed to create order");

      const { orderId, amount, currency } = await res.json();

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

  const getPerMonth = (plan: PricingPlan) =>
    Math.round(plan.price / (plan.duration / 30));

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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-zinc-900 animate-pulse rounded-3xl h-[32rem]"
              />
            ))}
          </div>
        ) : (
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
                      ? "bg-gradient-to-b from-red-950/40 to-surface-100 border-red-700 scale-[1.02] shadow-lg shadow-red-900/20"
                      : "bg-surface-100 border-zinc-800 hover:border-zinc-600"
                  }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge
                      variant={plan.highlighted ? "danger" : "neutral"}
                      size="sm"
                      className={
                        plan.highlighted
                          ? "bg-gradient-to-r from-red-600 to-red-800 text-white uppercase tracking-wider"
                          : "bg-zinc-800 text-gray-300 border border-zinc-700 uppercase tracking-wider"
                      }
                    >
                      {plan.badge}
                    </Badge>
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
                    ₹{getPerMonth(plan).toLocaleString("en-IN")} / month
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
                <Button
                  variant={plan.highlighted ? "primary" : "outline"}
                  fullWidth
                  loading={processing && selectedPlan === plan.id}
                  onClick={() => handleCheckout(plan)}
                >
                  Get Started
                  <i className="ri-arrow-right-line ml-2"></i>
                </Button>
              </div>
            ))}
          </div>
        )}

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
