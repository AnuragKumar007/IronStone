"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getPricingPlans, getPricingSettings } from "@/lib/firestore";
import { PricingCard, Button } from "@/components/ui";
import type { PricingPlan, PricingSettings } from "@/types";

type PlanType = "gym" | "trainer";

export default function MembershipSection() {
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [settings, setSettings] = useState<PricingSettings>({ showTrainerPlans: false });
    const [loading, setLoading] = useState(true);
    const [activePlanType, setActivePlanType] = useState<PlanType>("gym");

    useEffect(() => {
        Promise.all([getPricingPlans(), getPricingSettings()])
            .then(([plansData, settingsData]) => {
                setPlans(plansData);
                setSettings(settingsData);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

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

    return (
        <div className="relative min-h-screen bg-black overflow-hidden mt-60 md:pt-16 pb-24">
            <div className="relative z-10 container mx-auto px-4 py-16">
                {/* Header */}
                <div className="flex flex-col items-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 mb-6">
                        <i className="ri-price-tag-3-fill text-red-500 text-sm"></i>
                        <span className="text-white text-xs font-semibold tracking-widest uppercase">Pricing</span>
                    </div>
                    <h2 className="text-5xl text-center md:text-6xl font-bold text-white leading-tight">Plans and Pricing</h2>
                    <p className="text-gray-400 text-center max-w-2xl mt-4 text-lg mb-10">
                        Choose a plan that fits your fitness goals, whether you&apos;re just starting out or scaling your workout routines.
                    </p>

                    {/* Gym Only / With Trainer Toggle */}
                    {!loading && settings.showTrainerPlans && (
                        <div className="bg-zinc-900 rounded-full p-1 inline-flex border border-zinc-800">
                            <button
                                onClick={() => setActivePlanType("gym")}
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
                                onClick={() => setActivePlanType("trainer")}
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
                    )}
                </div>

                {/* Plans Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-zinc-900 animate-pulse rounded-3xl h-[32rem]" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
                                <Link href="/pricing">
                                    <Button
                                        variant={isHighlighted(plan) ? "primary" : "outline"}
                                        fullWidth
                                    >
                                        Get Started
                                        <i className="ri-arrow-right-line ml-2"></i>
                                    </Button>
                                </Link>
                            </PricingCard>
                        ))}
                    </div>
                )}

                <p className="text-center text-gray-500 text-sm mt-12">
                    All plans include full access to our facility.{" "}
                    <Link href="/pricing" className="text-red-500 hover:underline">View details</Link>
                </p>
            </div>
        </div>
    );
}
