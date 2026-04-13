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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.specialization.trim()) newErrors.specialization = "Specialization is required.";
    if (!form.bio.trim()) newErrors.bio = "Bio is required.";
    if (!form.experience.trim()) newErrors.experience = "Experience is required.";
    if (!trainer && !file) newErrors.photo = "Photo is required for new trainers.";
    return newErrors;
  };

  const clearError = (field: string) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
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
        error={errors.name}
        onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); clearError("name"); }}
      />
      <Input
        label="Specialization"
        icon="ri-focus-3-line"
        placeholder="e.g. Strength Training"
        value={form.specialization}
        error={errors.specialization}
        onChange={(e) => { setForm((p) => ({ ...p, specialization: e.target.value })); clearError("specialization"); }}
      />
      <div>
        <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
          Bio
        </label>
        <textarea
          placeholder="Short biography..."
          value={form.bio}
          onChange={(e) => { setForm((p) => ({ ...p, bio: e.target.value })); clearError("bio"); }}
          rows={3}
          className={`auth-input w-full resize-none ${errors.bio ? "!border-red-500" : ""}`}
        />
        {errors.bio && <p className="text-red-500 text-xs mt-1.5">{errors.bio}</p>}
      </div>
      <Input
        label="Experience"
        icon="ri-medal-line"
        placeholder="e.g. 8+ Years"
        value={form.experience}
        error={errors.experience}
        onChange={(e) => { setForm((p) => ({ ...p, experience: e.target.value })); clearError("experience"); }}
      />
      <div>
        <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
          Photo
        </label>
        <ImageUpload
          value={trainer?.photoUrl}
          onChange={(f) => { setFile(f); clearError("photo"); }}
        />
        {errors.photo && <p className="text-red-500 text-xs mt-1.5">{errors.photo}</p>}
      </div>
      <Button type="submit" variant="primary" fullWidth loading={loading}>
        {trainer ? "Update Trainer" : "Add Trainer"}
      </Button>
    </form>
  );
}
