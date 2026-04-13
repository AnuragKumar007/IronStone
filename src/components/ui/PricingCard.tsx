// ============================================
// PricingCard — Shared pricing plan card used
// on both the landing page and pricing page
// ============================================
import Badge from "./Badge";
import type { PricingPlan } from "@/types";

export interface PricingCardProps {
  plan: PricingPlan;
  price: number;
  features: string[];
  highlighted: boolean;
  badge?: string;
  perMonth: number;
  children?: React.ReactNode;
}

export default function PricingCard({
  plan,
  price,
  features,
  highlighted,
  badge,
  perMonth,
  children,
}: PricingCardProps) {
  return (
    <div
      className={`pricing-card relative rounded-3xl border p-8 flex flex-col transition-all duration-300
        ${
          highlighted
            ? "bg-gradient-to-b from-red-950/40 to-surface-100 border-red-700 scale-[1.02] shadow-lg shadow-red-900/20"
            : "bg-surface-100 border-zinc-800 hover:border-zinc-600"
        }`}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <Badge
            variant={highlighted ? "danger" : "neutral"}
            size="sm"
            className={
              highlighted
                ? "bg-gradient-to-r from-red-600 to-red-800 text-white uppercase tracking-wider"
                : "bg-zinc-800 text-gray-300 border border-zinc-700 uppercase tracking-wider"
            }
          >
            {badge}
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
            {price.toLocaleString("en-IN")}
          </span>
        </div>
        <p className="text-gray-600 text-sm mt-1">
          ₹{perMonth.toLocaleString("en-IN")} / month
        </p>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <i
              className={`ri-check-line text-sm mt-0.5 ${
                highlighted ? "text-red-500" : "text-green-500"
              }`}
            ></i>
            <span className="text-gray-400 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA — rendered by parent */}
      {children}
    </div>
  );
}
