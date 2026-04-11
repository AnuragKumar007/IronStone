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

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
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
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.code.trim() || !form.discountValue) return;
    setSaving(true);

    try {
      const data = {
        code: form.code.toUpperCase().trim(),
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
          <Input
            label="Coupon Code"
            icon="ri-coupon-line"
            placeholder="e.g. NEWYEAR25"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
          />

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
            onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
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
