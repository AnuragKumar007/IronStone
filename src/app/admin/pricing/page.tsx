"use client";
// ============================================
// Admin Pricing — Edit membership plans
// ============================================
import { useState, useEffect } from "react";
import { Card, Button, Input } from "@/components/ui";
import { getPricingPlans, updatePricingPlan } from "@/lib/firestore";
import type { PricingPlan } from "@/types";

interface EditableFields {
  price: string;
  features: string;
  highlighted: boolean;
  badge: string;
}

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState<Record<string, EditableFields>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    getPricingPlans()
      .then((data) => {
        setPlans(data);
        const initial: Record<string, EditableFields> = {};
        data.forEach((p) => {
          initial[p.id] = {
            price: String(p.price),
            features: p.features.join("\n"),
            highlighted: p.highlighted,
            badge: p.badge || "",
          };
        });
        setEdits(initial);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (plan: PricingPlan) => {
    const edit = edits[plan.id];
    if (!edit) return;

    setSaving(plan.id);
    setSuccess(null);

    try {
      await updatePricingPlan(plan.id, {
        price: Number(edit.price),
        features: edit.features.split("\n").filter((f) => f.trim()),
        highlighted: edit.highlighted,
        badge: edit.badge || undefined,
      });
      setSuccess(plan.id);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(null);
    }
  };

  const updateField = (planId: string, field: keyof EditableFields, value: string | boolean) => {
    setEdits((prev) => ({
      ...prev,
      [planId]: { ...prev[planId], [field]: value },
    }));
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Pricing Plans</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 animate-pulse rounded-3xl h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Pricing Plans</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plans.map((plan) => {
          const edit = edits[plan.id];
          if (!edit) return null;

          return (
            <Card key={plan.id} variant="default" padding="lg">
              <div className="space-y-5">
                {/* Plan Name (read-only) */}
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{plan.duration} days</p>
                </div>

                {/* Price */}
                <Input
                  label="Price (₹)"
                  type="number"
                  icon="ri-money-rupee-circle-line"
                  value={edit.price}
                  onChange={(e) => updateField(plan.id, "price", e.target.value)}
                />

                {/* Badge */}
                <Input
                  label="Badge Text"
                  icon="ri-price-tag-3-line"
                  placeholder="e.g. Most Popular"
                  value={edit.badge}
                  onChange={(e) => updateField(plan.id, "badge", e.target.value)}
                />

                {/* Features */}
                <div>
                  <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
                    Features (one per line)
                  </label>
                  <textarea
                    value={edit.features}
                    onChange={(e) => updateField(plan.id, "features", e.target.value)}
                    rows={5}
                    className="auth-input w-full resize-none text-sm"
                  />
                </div>

                {/* Highlighted Toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={edit.highlighted}
                    onChange={(e) => updateField(plan.id, "highlighted", e.target.checked)}
                    className="w-4 h-4 rounded accent-red-600"
                  />
                  <span className="text-gray-400 text-sm font-semibold">Featured / Highlighted</span>
                </label>

                {/* Save */}
                <Button
                  variant="primary"
                  fullWidth
                  loading={saving === plan.id}
                  onClick={() => handleSave(plan)}
                >
                  {success === plan.id ? (
                    <>
                      <i className="ri-check-line mr-1"></i>
                      Saved!
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
