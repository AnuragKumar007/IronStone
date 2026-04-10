"use client";
// ============================================
// Admin Trainers — CRUD + reorder
// ============================================
import { useState, useEffect } from "react";
import { Button, Modal } from "@/components/ui";
import TrainerForm from "@/components/admin/TrainerForm";
import { getTrainers, addTrainer, updateTrainer, deleteTrainer, reorderTrainers } from "@/lib/firestore";
import { uploadImage, deleteImage } from "@/lib/storage";
import type { Trainer } from "@/types";

export default function AdminTrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Trainer | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTrainers = () => {
    setLoading(true);
    getTrainers().then(setTrainers).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchTrainers(); }, []);

  const handleAdd = () => {
    setEditingTrainer(undefined);
    setFormOpen(true);
  };

  const handleEdit = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setFormOpen(true);
  };

  const handleSubmit = async (data: Omit<Trainer, "id"> & { file?: File }) => {
    setSubmitting(true);
    try {
      let photoUrl = data.photoUrl;
      if (data.file) {
        photoUrl = await uploadImage("trainers", data.file);
        if (editingTrainer?.photoUrl && editingTrainer.photoUrl.startsWith("http")) {
          await deleteImage(editingTrainer.photoUrl);
        }
      }

      const trainerData = {
        name: data.name,
        specialization: data.specialization,
        bio: data.bio,
        experience: data.experience,
        photoUrl,
        order: data.order || trainers.length + 1,
      };

      if (editingTrainer) {
        await updateTrainer(editingTrainer.id, trainerData);
      } else {
        await addTrainer(trainerData);
      }

      setFormOpen(false);
      fetchTrainers();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      if (deleteTarget.photoUrl.startsWith("http")) {
        await deleteImage(deleteTarget.photoUrl);
      }
      await deleteTrainer(deleteTarget.id);
      setDeleteTarget(null);
      fetchTrainers();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= trainers.length) return;

    const updated = [...trainers];
    const tempOrder = updated[index].order;
    updated[index].order = updated[swapIndex].order;
    updated[swapIndex].order = tempOrder;
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    setTrainers(updated);

    await reorderTrainers([
      { id: updated[index].id, order: updated[index].order },
      { id: updated[swapIndex].id, order: updated[swapIndex].order },
    ]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Trainers</h1>
        <Button variant="primary" size="sm" onClick={handleAdd}>
          <i className="ri-add-line mr-1"></i>
          Add Trainer
        </Button>
      </div>

      {/* Trainers List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 animate-pulse rounded-2xl h-20" />
          ))}
        </div>
      ) : trainers.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <i className="ri-team-line text-4xl block mb-3"></i>
          <p>No trainers yet. Add your first trainer.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {trainers.map((trainer, i) => (
            <div
              key={trainer.id}
              className="flex items-center gap-4 bg-surface-100 border border-zinc-800/50 rounded-2xl p-4 hover:border-zinc-600 transition-all"
            >
              {/* Photo */}
              <img
                src={trainer.photoUrl || "/placeholder.png"}
                alt={trainer.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold truncate">{trainer.name}</p>
                <p className="text-gray-500 text-sm truncate">{trainer.specialization} · {trainer.experience}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleReorder(i, "up")}
                  disabled={i === 0}
                  className="w-8 h-8 rounded-lg text-gray-500 hover:text-white hover:bg-surface-300 transition-all disabled:opacity-30"
                >
                  <i className="ri-arrow-up-s-line text-lg"></i>
                </button>
                <button
                  onClick={() => handleReorder(i, "down")}
                  disabled={i === trainers.length - 1}
                  className="w-8 h-8 rounded-lg text-gray-500 hover:text-white hover:bg-surface-300 transition-all disabled:opacity-30"
                >
                  <i className="ri-arrow-down-s-line text-lg"></i>
                </button>
                <button
                  onClick={() => handleEdit(trainer)}
                  className="w-8 h-8 rounded-lg text-gray-500 hover:text-white hover:bg-surface-300 transition-all"
                >
                  <i className="ri-edit-line"></i>
                </button>
                <button
                  onClick={() => setDeleteTarget(trainer)}
                  className="w-8 h-8 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-500/5 transition-all"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingTrainer ? "Edit Trainer" : "Add Trainer"}
        size="md"
      >
        <TrainerForm
          trainer={editingTrainer}
          onSubmit={handleSubmit}
          loading={submitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Trainer"
        size="sm"
      >
        <p className="text-gray-400 mb-6">
          Are you sure you want to delete <span className="text-white font-bold">{deleteTarget?.name}</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            fullWidth
            loading={submitting}
            onClick={handleDelete}
            className="!from-red-700 !to-red-900"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
