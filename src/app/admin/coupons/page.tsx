"use client";
// ============================================
// Admin Coupons — Create & manage discount coupons
// ============================================
import { useState, useEffect } from "react";
import { Button, Badge, Input, Modal, DataTable } from "@/components/ui";
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from "@/lib/firestore";
import { useAuth } from "@/hooks/useAuth";
import type { Coupon } from "@/types";
import { PLAN_TIER_LABELS } from "@/types";
import type { Column } from "@/components/ui/DataTable";

interface CouponForm {
  code: string;
  discountType: "percentage" | "flat";
  discountValue: string;
  minPlanTier: string;
  maxUses: string;
  expiresAt: string;
  isActive: boolean;
}

const emptyForm: CouponForm = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minPlanTier: "1",
  maxUses: "0",
  expiresAt: "",
  isActive: true,
};

export default function AdminCouponsPage() {
  const { userData } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CouponForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchCoupons = () => {
    setLoading(true);
    getCoupons()
      .then(setCoupons)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const generateCode = (): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const generateUniqueCode = (): string => {
    const existingCodes = new Set(coupons.map((c) => c.code.toUpperCase()));
    let code = generateCode();
    // Keep generating until unique
    while (existingCodes.has(code.toUpperCase())) {
      code = generateCode();
    }
    return code;
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minPlanTier: String(coupon.minPlanTier),
      maxUses: String(coupon.maxUses),
      expiresAt: coupon.expiresAt
        ? new Date(coupon.expiresAt).toISOString().split("T")[0]
        : "",
      isActive: coupon.isActive,
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};

    if (!form.code.trim()) {
      newErrors.code = "Coupon code is required.";
    } else if (form.code.trim().length !== 6) {
      newErrors.code = "Code must be exactly 6 characters.";
    } else {
      const codeUpper = form.code.toUpperCase().trim();
      const duplicate = coupons.find(
        (c) => c.code.toUpperCase() === codeUpper && c.id !== editingId
      );
      if (duplicate) {
        newErrors.code = `Code "${codeUpper}" already exists.`;
      }
    }

    if (!form.discountValue || Number(form.discountValue) <= 0) {
      newErrors.discountValue = "Discount value is required.";
    } else if (form.discountType === "percentage" && Number(form.discountValue) > 100) {
      newErrors.discountValue = "Percentage cannot exceed 100.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const codeUpper = form.code.toUpperCase().trim();

    setSaving(true);

    try {
      const data = {
        code: codeUpper,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minPlanTier: Number(form.minPlanTier),
        maxUses: Number(form.maxUses),
        expiresAt: form.expiresAt ? new Date(form.expiresAt) : null,
        isActive: form.isActive,
      };

      if (editingId) {
        await updateCoupon(editingId, data as Partial<Coupon>);
      } else {
        await createCoupon({
          ...data,
          createdBy: userData?.uid || "",
        } as Omit<Coupon, "id" | "currentUses" | "usedBy" | "createdAt">);
      }

      setModalOpen(false);
      fetchCoupons();
    } catch (err) {
      console.error("Save coupon failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await deleteCoupon(id);
      fetchCoupons();
    } catch (err) {
      console.error("Delete coupon failed:", err);
    } finally {
      setDeleting(null);
    }
  };

  const columns: Column<Coupon>[] = [
    {
      key: "code",
      header: "Code",
      render: (v) => (
        <span className="font-mono font-bold text-white">{String(v)}</span>
      ),
    },
    {
      key: "discountType",
      header: "Discount",
      render: (_, row) =>
        row.discountType === "percentage"
          ? `${row.discountValue}%`
          : `₹${row.discountValue.toLocaleString("en-IN")}`,
    },
    {
      key: "minPlanTier",
      header: "Min Plan",
      render: (v) => PLAN_TIER_LABELS[v as number] || "—",
    },
    {
      key: "currentUses",
      header: "Uses",
      render: (_, row) => `${row.currentUses}${row.maxUses > 0 ? ` / ${row.maxUses}` : ""}`,
    },
    {
      key: "expiresAt",
      header: "Expires",
      render: (v) =>
        v ? new Date(v as Date).toLocaleDateString("en-IN") : "Never",
    },
    {
      key: "isActive",
      header: "Status",
      render: (_, row) => {
        const expired = row.expiresAt && new Date(row.expiresAt) < new Date();
        const maxedOut = row.maxUses > 0 && row.currentUses >= row.maxUses;
        if (!row.isActive) return <Badge variant="neutral" size="sm">Inactive</Badge>;
        if (expired) return <Badge variant="danger" size="sm">Expired</Badge>;
        if (maxedOut) return <Badge variant="warning" size="sm">Maxed Out</Badge>;
        return <Badge variant="success" size="sm">Active</Badge>;
      },
    },
    {
      key: "id",
      header: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(row)}
            className="text-gray-500 hover:text-white transition-colors"
            title="Edit"
          >
            <i className="ri-pencil-line"></i>
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            disabled={deleting === row.id}
            className="text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
            title="Delete"
          >
            <i className={deleting === row.id ? "ri-loader-4-line animate-spin" : "ri-delete-bin-line"}></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Coupons</h1>
        <Button variant="primary" onClick={openCreate}>
          <i className="ri-add-line mr-1"></i>
          Create Coupon
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={coupons}
        loading={loading}
        emptyMessage="No coupons yet. Create one to get started."
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Coupon" : "Create Coupon"}
        size="md"
      >
        <div className="space-y-5">
          <div>
            <Input
              label="Coupon Code (6 characters)"
              icon="ri-coupon-line"
              placeholder="e.g. Ab3xK9"
              value={form.code}
              maxLength={6}
              error={errors.code}
              onChange={(e) => {
                const val = e.target.value.replace(/[^A-Za-z0-9]/g, "");
                setForm({ ...form, code: val.slice(0, 6) });
                if (errors.code) setErrors((prev) => ({ ...prev, code: "" }));
              }}
            />
            <button
              type="button"
              onClick={() => setForm({ ...form, code: generateUniqueCode() })}
              className="mt-2 text-xs font-semibold text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <i className="ri-refresh-line"></i>
              Generate Random Code
            </button>
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
              Discount Type
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setForm({ ...form, discountType: "percentage" })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  form.discountType === "percentage"
                    ? "bg-red-600 text-white"
                    : "bg-zinc-800 text-gray-400 hover:text-white"
                }`}
              >
                Percentage (%)
              </button>
              <button
                onClick={() => setForm({ ...form, discountType: "flat" })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  form.discountType === "flat"
                    ? "bg-red-600 text-white"
                    : "bg-zinc-800 text-gray-400 hover:text-white"
                }`}
              >
                Flat (₹)
              </button>
            </div>
          </div>

          <Input
            label={form.discountType === "percentage" ? "Discount (%)" : "Discount Amount (₹)"}
            type="number"
            icon="ri-discount-percent-line"
            placeholder={form.discountType === "percentage" ? "e.g. 25" : "e.g. 500"}
            value={form.discountValue}
            error={errors.discountValue}
            onChange={(e) => {
              setForm({ ...form, discountValue: e.target.value });
              if (errors.discountValue) setErrors((prev) => ({ ...prev, discountValue: "" }));
            }}
          />

          {/* Min Plan Tier */}
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
              Minimum Plan
            </label>
            <select
              value={form.minPlanTier}
              onChange={(e) => setForm({ ...form, minPlanTier: e.target.value })}
              className="auth-input w-full text-sm"
            >
              {Object.entries(PLAN_TIER_LABELS).map(([tier, label]) => (
                <option key={tier} value={tier}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Max Uses (0 = unlimited)"
            type="number"
            icon="ri-user-follow-line"
            placeholder="0"
            value={form.maxUses}
            onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
          />

          <Input
            label="Expiry Date (optional)"
            type="date"
            icon="ri-calendar-line"
            value={form.expiresAt}
            onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
          />

          {/* Active Toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 rounded accent-red-600"
            />
            <span className="text-gray-400 text-sm font-semibold">Active</span>
          </label>

          <Button
            variant="primary"
            fullWidth
            loading={saving}
            onClick={handleSave}
          >
            {editingId ? "Save Changes" : "Create Coupon"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
