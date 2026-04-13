"use client";
// ============================================
// Pricing Page — Membership Plans & Razorpay Checkout
// ============================================
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import PageHero from "@/components/PageHero";
import { Badge, Button, Modal, Input, PricingCard } from "@/components/ui";
import { getPricingPlans, getPricingSettings } from "@/lib/firestore";
import type { PricingPlan, PricingSettings } from "@/types";

type PlanType = "gym" | "trainer";

interface CouponState {
  code: string;
  applied: boolean;
  loading: boolean;
  error: string;
  discount: number;
  finalPrice: number;
  discountType: "percentage" | "flat" | null;
  discountValue: number;
}

const emptyCoupon: CouponState = {
  code: "",
  applied: false,
  loading: false,
  error: "",
  discount: 0,
  finalPrice: 0,
  discountType: null,
  discountValue: 0,
};

export default function PricingPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [settings, setSettings] = useState<PricingSettings>({ showTrainerPlans: false });
  const [activePlanType, setActivePlanType] = useState<PlanType>("gym");

  // Checkout modal state
  const [checkoutPlan, setCheckoutPlan] = useState<PricingPlan | null>(null);
  const [coupon, setCoupon] = useState<CouponState>(emptyCoupon);

  useEffect(() => {
    Promise.all([getPricingPlans(), getPricingSettings()])
      .then(([plansData, settingsData]) => {
        setPlans(plansData);
        setSettings(settingsData);
      })
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
  }, [loading, activePlanType]);

  // Open checkout modal
  const openCheckout = (plan: PricingPlan) => {
    setCheckoutPlan(plan);
    setCoupon(emptyCoupon);
  };

  // Close checkout modal
  const closeCheckout = () => {
    setCheckoutPlan(null);
    setCoupon(emptyCoupon);
  };

  // Validate coupon via API
  const handleApplyCoupon = async () => {
    if (!coupon.code.trim() || !checkoutPlan) return;

    setCoupon((prev) => ({ ...prev, loading: true, error: "", applied: false }));

    try {
      const price = activePlanType === "trainer" ? checkoutPlan.trainerPrice : checkoutPlan.price;

      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: coupon.code.trim(),
          planId: checkoutPlan.id,
          planType: activePlanType,
          planPrice: price,
        }),
      });

      const data = await res.json();

      if (data.valid) {
        setCoupon((prev) => ({
          ...prev,
          applied: true,
          loading: false,
          error: "",
          discount: data.discount,
          finalPrice: data.finalPrice,
          discountType: data.discountType,
          discountValue: data.discountValue,
        }));
      } else {
        setCoupon((prev) => ({
          ...prev,
          loading: false,
          error: data.error || "Invalid coupon",
          applied: false,
        }));
      }
    } catch {
      setCoupon((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to validate coupon",
        applied: false,
      }));
    }
  };

  // Remove applied coupon
  const removeCoupon = () => {
    setCoupon(emptyCoupon);
  };

  // Proceed to Razorpay payment
  const handleProceedToPayment = async () => {
    if (!checkoutPlan) return;
    setProcessing(true);

    try {
      const originalPrice = activePlanType === "trainer" ? checkoutPlan.trainerPrice : checkoutPlan.price;
      const pricePaise = originalPrice * 100;

      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: checkoutPlan.id,
          planType: activePlanType,
          amount: pricePaise,
          couponCode: coupon.applied ? coupon.code.trim() : undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || "Failed to create order");
        setProcessing(false);
        return;
      }

      const { orderId, amount, currency } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "IronStone Gym",
        description: `${checkoutPlan.name} Membership${activePlanType === "trainer" ? " (With Trainer)" : ""}`,
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
              planId: checkoutPlan.id,
              planType: activePlanType,
              duration: checkoutPlan.duration,
              couponCode: coupon.applied ? coupon.code.trim() : undefined,
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
      rzp.on("payment.failed", () => {
        setProcessing(false);
      });
      rzp.open();

      closeCheckout();
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const getPrice = (plan: PricingPlan) =>
    activePlanType === "trainer" ? plan.trainerPrice : plan.price;

  const getFeatures = (plan: PricingPlan) =>
    activePlanType === "trainer" ? (plan.trainerFeatures || []) : plan.features;

  const getBadge = (plan: PricingPlan) =>
    activePlanType === "trainer" ? plan.trainerBadge : plan.badge;

  const isHighlighted = (plan: PricingPlan) =>
    activePlanType === "trainer" ? plan.trainerHighlighted : plan.highlighted;

  const getPerMonth = (plan: PricingPlan) => {
    const price = getPrice(plan);
    return Math.round(price / (plan.duration / 30));
  };

  const handlePlanTypeSwitch = (type: PlanType) => {
    if (type === activePlanType) return;
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".pricing-card");
      gsap.to(cards, {
        opacity: 0,
        y: 20,
        duration: 0.25,
        stagger: 0.04,
        ease: "power2.in",
        onComplete: () => setActivePlanType(type),
      });
    } else {
      setActivePlanType(type);
    }
  };

  // Get checkout modal price
  const checkoutPrice = checkoutPlan ? getPrice(checkoutPlan) : 0;
  const displayFinalPrice = coupon.applied ? coupon.finalPrice : checkoutPrice;

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

        {/* Plan Type Toggle */}
        {!loading && settings.showTrainerPlans && (
          <div className="flex justify-center mb-12">
            <div className="bg-zinc-900 rounded-full p-1 inline-flex border border-zinc-800">
              <button
                onClick={() => handlePlanTypeSwitch("gym")}
                className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  activePlanType === "gym"
                    ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <i className="ri-building-line mr-1.5"></i>
                Gym Only
              </button>
              <button
                onClick={() => handlePlanTypeSwitch("trainer")}
                className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  activePlanType === "trainer"
                    ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <i className="ri-user-star-line mr-1.5"></i>
                With Trainer
              </button>
            </div>
          </div>
        )}

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
              <PricingCard
                key={plan.id}
                plan={plan}
                price={getPrice(plan)}
                features={getFeatures(plan)}
                highlighted={isHighlighted(plan)}
                badge={getBadge(plan)}
                perMonth={getPerMonth(plan)}
              >
                <Button
                  variant={isHighlighted(plan) ? "primary" : "outline"}
                  fullWidth
                  onClick={() => openCheckout(plan)}
                >
                  Get Started
                  <i className="ri-arrow-right-line ml-2"></i>
                </Button>
              </PricingCard>
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

      {/* Checkout Confirmation Modal */}
      <Modal
        isOpen={!!checkoutPlan}
        onClose={closeCheckout}
        title="Confirm Your Plan"
        size="sm"
      >
        {checkoutPlan && (
          <div className="space-y-6">
            {/* Plan Summary */}
            <div className="bg-zinc-900/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-white font-bold text-lg">
                  {checkoutPlan.name} Plan
                </h4>
                {activePlanType === "trainer" && (
                  <Badge variant="info" size="sm">
                    <i className="ri-user-star-line mr-1"></i>
                    Trainer
                  </Badge>
                )}
              </div>
              <p className="text-gray-500 text-sm">{checkoutPlan.duration} days</p>
            </div>

            {/* Coupon Input */}
            {!coupon.applied ? (
              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
                  Have a coupon?
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      icon="ri-coupon-line"
                      placeholder="Enter coupon code"
                      value={coupon.code}
                      onChange={(e) =>
                        setCoupon((prev) => ({
                          ...prev,
                          code: e.target.value.toUpperCase(),
                          error: "",
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleApplyCoupon();
                      }}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    loading={coupon.loading}
                    onClick={handleApplyCoupon}
                    className="shrink-0 self-start mt-[26px]"
                  >
                    Apply
                  </Button>
                </div>
                {coupon.error && (
                  <p className="text-red-500 text-xs mt-2">
                    <i className="ri-error-warning-line mr-1"></i>
                    {coupon.error}
                  </p>
                )}
              </div>
            ) : (
              /* Applied Coupon */
              <div className="bg-green-900/20 border border-green-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <i className="ri-check-line text-green-400"></i>
                    <span className="text-green-400 font-bold text-sm font-mono">
                      {coupon.code}
                    </span>
                    <span className="text-green-500/70 text-xs">applied!</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    title="Remove coupon"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
                <p className="text-green-500/70 text-sm">
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}% off`
                    : `₹${coupon.discountValue.toLocaleString("en-IN")} off`}
                  {" — "}You save ₹{coupon.discount.toLocaleString("en-IN")}
                </p>
              </div>
            )}

            {/* Price Summary */}
            <div className="border-t border-zinc-800 pt-4 space-y-2">
              {coupon.applied ? (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Original price</span>
                    <span className="text-gray-500 line-through">
                      ₹{checkoutPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-500">Discount</span>
                    <span className="text-green-500">
                      -₹{coupon.discount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-white font-black text-2xl">
                      ₹{displayFinalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-white font-black text-2xl">
                    ₹{checkoutPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>

            {/* Proceed Button */}
            <Button
              variant="primary"
              fullWidth
              loading={processing}
              onClick={handleProceedToPayment}
            >
              Proceed to Payment — ₹{displayFinalPrice.toLocaleString("en-IN")}
              <i className="ri-arrow-right-line ml-2"></i>
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
