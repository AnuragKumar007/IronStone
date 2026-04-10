"use client";
// ============================================
// EquipmentForm — Add/Edit equipment form
// ============================================
import { useState } from "react";
import { Input, Button, ImageUpload } from "@/components/ui";
import type { Equipment } from "@/types";

const CATEGORIES = ["Cardio", "Strength", "Free Weights", "Machines", "Functional", "Recovery"];

interface EquipmentFormProps {
  equipment?: Equipment;
  onSubmit: (data: Omit<Equipment, "id"> & { file?: File }) => Promise<void>;
  loading: boolean;
}

export default function EquipmentForm({ equipment, onSubmit, loading }: EquipmentFormProps) {
  const [form, setForm] = useState({
    name: equipment?.name || "",
    description: equipment?.description || "",
    category: equipment?.category || CATEGORIES[0],
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...form,
      imageUrl: equipment?.imageUrl || "",
      order: equipment?.order || 0,
      ...(file ? { file } : {}),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        icon="ri-settings-3-line"
        placeholder="Equipment name"
        value={form.name}
        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        required
      />
      <div>
        <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
          Description
        </label>
        <textarea
          placeholder="Short description..."
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          rows={3}
          className="auth-input w-full resize-none"
          required
        />
      </div>
      <div>
        <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
          Category
        </label>
        <select
          value={form.category}
          onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
          className="auth-input w-full"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
          Image
        </label>
        <ImageUpload
          value={equipment?.imageUrl}
          onChange={(f) => setFile(f)}
        />
      </div>
      <Button type="submit" variant="primary" fullWidth loading={loading}>
        {equipment ? "Update Equipment" : "Add Equipment"}
      </Button>
    </form>
  );
}
