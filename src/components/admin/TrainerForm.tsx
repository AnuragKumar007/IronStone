"use client";
// ============================================
// TrainerForm — Add/Edit trainer form
// ============================================
import { useState } from "react";
import { Input, Button, ImageUpload } from "@/components/ui";
import type { Trainer } from "@/types";

interface TrainerFormProps {
  trainer?: Trainer;
  onSubmit: (data: Omit<Trainer, "id"> & { file?: File }) => Promise<void>;
  loading: boolean;
}

export default function TrainerForm({ trainer, onSubmit, loading }: TrainerFormProps) {
  const [form, setForm] = useState({
    name: trainer?.name || "",
    specialization: trainer?.specialization || "",
    bio: trainer?.bio || "",
    experience: trainer?.experience || "",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...form,
      photoUrl: trainer?.photoUrl || "",
      order: trainer?.order || 0,
      ...(file ? { file } : {}),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        icon="ri-user-line"
        placeholder="Trainer name"
        value={form.name}
        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        required
      />
      <Input
        label="Specialization"
        icon="ri-focus-3-line"
        placeholder="e.g. Strength Training"
        value={form.specialization}
        onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))}
        required
      />
      <div>
        <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
          Bio
        </label>
        <textarea
          placeholder="Short biography..."
          value={form.bio}
          onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
          rows={3}
          className="auth-input w-full resize-none"
          required
        />
      </div>
      <Input
        label="Experience"
        icon="ri-medal-line"
        placeholder="e.g. 8+ Years"
        value={form.experience}
        onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))}
        required
      />
      <div>
        <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
          Photo
        </label>
        <ImageUpload
          value={trainer?.photoUrl}
          onChange={(f) => setFile(f)}
        />
      </div>
      <Button type="submit" variant="primary" fullWidth loading={loading}>
        {trainer ? "Update Trainer" : "Add Trainer"}
      </Button>
    </form>
  );
}
