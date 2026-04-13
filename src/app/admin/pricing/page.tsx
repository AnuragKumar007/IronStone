"use client";
// ============================================
// Admin Pricing — Edit membership plans + trainer toggle
// ============================================
import { useState, useEffect } from "react";
import { Card, Button, Input } from "@/components/ui";
import {
  getPricingPlans,
  updatePricingPlan,
  getPricingSettings,
  updatePricingSettings,
} from "@/lib/firestore";
import type { PricingPlan, PricingSettings } from "@/types";

interface EditableFields {
  // Gym Only
  price: string;
  features: string;
  highlighted: boolean;
  badge: string;
  // With Trainer
  trainerPrice: string;
  trainerFeatures: string;
  trainerHighlighted: boolean;
  trainerBadge: string;
}

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState<Record<string, EditableFields>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [settings, setSettings] = useState<PricingSettings>({ showTrainerPlans: false });
  const [savingSettings, setSavingSettings] = useState(false);
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getPricingPlans(), getPricingSettings()])
      .then(([data, settingsData]) => {
        setPlans(data);
        setSettings(settingsData);
        const initial: Record<string, EditableFields> = {};
        data.forEach((p) => {
          initial[p.id] = {
            price: String(p.price),
            features: p.features.join("\n"),
            highlighted: p.highlighted,
            badge: p.badge || "",
            trainerPrice: String(p.trainerPrice || 0),
            trainerFeatures: (p.trainerFeatures || []).join("\n"),
            trainerHighlighted: p.trainerHighlighted || false,
            trainerBadge: p.trainerBadge || "",
          };
        });
        setEdits(initial);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleToggleTrainerPlans = async () => {
    const next = !settings.showTrainerPlans;
    setSavingSettings(true);
    try {
      await updatePricingSettings({ showTrainerPlans: next });
      setSettings({ ...settings, showTrainerPlans: next });
    } catch (err) {
      console.error("Failed to update settings:", err);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSave = async (plan: PricingPlan) => {
    const edit = edits[plan.id];
    if (!edit) return;

    const fieldErrors: Record<string, string> = {};
    if (!edit.price || Number(edit.price) <= 0) fieldErrors.price = "Price must be greater than 0.";
    if (!edit.features.trim()) fieldErrors.features = "At least one feature is required.";
    if (settings.showTrainerPlans) {
      if (!edit.trainerPrice || Number(edit.trainerPrice) <= 0) fieldErrors.trainerPrice = "Trainer price must be greater than 0.";
      if (!edit.trainerFeatures.trim()) fieldErrors.trainerFeatures = "At least one trainer feature is required.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors((prev) => ({ ...prev, [plan.id]: fieldErrors }));
      return;
    }

    setErrors((prev) => ({ ...prev, [plan.id]: {} }));
    setSaving(plan.id);
    setSuccess(null);
    setSaveError(null);

    try {
      await updatePricingPlan(plan.id, {
        price: Number(edit.price),
        features: edit.features.split("\n").filter((f) => f.trim()),
        highlighted: edit.highlighted,
        badge: edit.badge || "",
        trainerPrice: Number(edit.trainerPrice),
        trainerFeatures: edit.trainerFeatures.split("\n").filter((f) => f.trim()),
        trainerHighlighted: edit.trainerHighlighted,
        trainerBadge: edit.trainerBadge || "",
      });
      setSuccess(plan.id);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Save failed:", err);
      setSaveError("Failed to save. Please try again.");
    } finally {
      setSaving(null);
    }
  };

  const updateField = (planId: string, field: keyof EditableFields, value: string | boolean) => {
    setEdits((prev) => ({
      ...prev,
      [planId]: { ...prev[planId], [field]: value },
    }));
    // Clear error for this field
    if (errors[planId]?.[field]) {
      setErrors((prev) => ({
        ...prev,
        [planId]: { ...prev[planId], [field]: "" },
      }));
    }
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

      {/* Trainer Plans Toggle */}
      <Card variant="default" padding="lg" className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Show Trainer Plans on Pricing Page</h3>
            <p className="text-gray-500 text-sm">
              When enabled, users can switch between &quot;Gym Only&quot; and &quot;With Trainer&quot; plans on the pricing page.
            </p>
          </div>
          <button
            onClick={handleToggleTrainerPlans}
            disabled={savingSettings}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 shrink-0 ${
              settings.showTrainerPlans ? "bg-red-600" : "bg-zinc-700"
            } ${savingSettings ? "opacity-50" : ""}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform duration-300 ${
                settings.showTrainerPlans ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </Card>

      {/* Plan Cards */}
      <div className="space-y-8">
        {plans.map((plan) => {
          const edit = edits[plan.id];
          if (!edit) return null;

          return (
            <Card key={plan.id} variant="default" padding="lg">
              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                  {plan.name}
                </h3>
                <p className="text-gray-600 text-sm">{plan.duration} days</p>
              </div>

              {/* Two-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Gym Only Column */}
                <div className="space-y-5">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-zinc-800 pb-2">
                    <i className="ri-building-line mr-1.5"></i>
                    Gym Only
                  </h4>

                  <Input
                    label="Price (₹)"
                    type="number"
                    icon="ri-money-rupee-circle-line"
                    value={edit.price}
                    error={errors[plan.id]?.price}
                    onChange={(e) => updateField(plan.id, "price", e.target.value)}
                  />

                  <Input
                    label="Badge Text"
                    icon="ri-price-tag-3-line"
                    placeholder="e.g. Most Popular"
                    value={edit.badge}
                    onChange={(e) => updateField(plan.id, "badge", e.target.value)}
                  />

                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
                      Features (one per line)
                    </label>
                    <textarea
                      value={edit.features}
                      onChange={(e) => updateField(plan.id, "features", e.target.value)}
                      rows={5}
                      className={`auth-input w-full resize-none text-sm ${errors[plan.id]?.features ? "!border-red-500" : ""}`}
                    />
                    {errors[plan.id]?.features && <p className="text-red-500 text-xs mt-1.5">{errors[plan.id].features}</p>}
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={edit.highlighted}
                      onChange={(e) => updateField(plan.id, "highlighted", e.target.checked)}
                      className="w-4 h-4 rounded accent-red-600"
                    />
                    <span className="text-gray-400 text-sm font-semibold">Featured / Highlighted</span>
                  </label>
                </div>

                {/* With Trainer Column */}
                <div className="space-y-5">
                  <h4 className="text-sm font-bold text-red-500/80 uppercase tracking-widest border-b border-zinc-800 pb-2">
                    <i className="ri-user-star-line mr-1.5"></i>
                    With Trainer
                  </h4>

                  <Input
                    label="Trainer Price (₹)"
                    type="number"
                    icon="ri-money-rupee-circle-line"
                    value={edit.trainerPrice}
                    error={errors[plan.id]?.trainerPrice}
                    onChange={(e) => updateField(plan.id, "trainerPrice", e.target.value)}
                  />

                  <Input
                    label="Trainer Badge Text"
                    icon="ri-price-tag-3-line"
                    placeholder="e.g. Trainer Included"
                    value={edit.trainerBadge}
                    onChange={(e) => updateField(plan.id, "trainerBadge", e.target.value)}
                  />

                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
                      Trainer Features (one per line)
                    </label>
                    <textarea
                      value={edit.trainerFeatures}
                      onChange={(e) => updateField(plan.id, "trainerFeatures", e.target.value)}
                      rows={5}
                      className={`auth-input w-full resize-none text-sm ${errors[plan.id]?.trainerFeatures ? "!border-red-500" : ""}`}
                    />
                    {errors[plan.id]?.trainerFeatures && <p className="text-red-500 text-xs mt-1.5">{errors[plan.id].trainerFeatures}</p>}
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={edit.trainerHighlighted}
                      onChange={(e) => updateField(plan.id, "trainerHighlighted", e.target.checked)}
                      className="w-4 h-4 rounded accent-red-600"
                    />
                    <span className="text-gray-400 text-sm font-semibold">Featured / Highlighted</span>
                  </label>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 pt-6 border-t border-zinc-800">
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
                {saveError && saving === null && (
                  <p className="text-red-500 text-xs mt-2 text-center">{saveError}</p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
