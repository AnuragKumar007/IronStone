"use client";
// ============================================
// Admin Equipment — CRUD + reorder
// ============================================
import { useState, useEffect } from "react";
import { Button, Badge, Modal } from "@/components/ui";
import EquipmentForm from "@/components/admin/EquipmentForm";
import { getEquipment, addEquipment, updateEquipment, deleteEquipment, reorderEquipment } from "@/lib/firestore";
import { uploadImage, deleteImage } from "@/lib/storage";
import type { Equipment } from "@/types";

export default function AdminEquipmentPage() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = () => {
    setLoading(true);
    getEquipment().then(setItems).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = () => {
    setEditingItem(undefined);
    setFormOpen(true);
  };

  const handleEdit = (item: Equipment) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleSubmit = async (data: Omit<Equipment, "id"> & { file?: File }) => {
    setSubmitting(true);
    try {
      let imageUrl = data.imageUrl;
      if (data.file) {
        imageUrl = await uploadImage("equipment", data.file);
        if (editingItem?.imageUrl && editingItem.imageUrl.startsWith("http")) {
          await deleteImage(editingItem.imageUrl);
        }
      }

      const itemData = {
        name: data.name,
        description: data.description,
        category: data.category,
        imageUrl,
        order: data.order || items.length + 1,
      };

      if (editingItem) {
        await updateEquipment(editingItem.id, itemData);
      } else {
        await addEquipment(itemData);
      }

      setFormOpen(false);
      fetchItems();
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
      if (deleteTarget.imageUrl.startsWith("http")) {
        await deleteImage(deleteTarget.imageUrl);
      }
      await deleteEquipment(deleteTarget.id);
      setDeleteTarget(null);
      fetchItems();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return;

    const updated = [...items];
    const tempOrder = updated[index].order;
    updated[index].order = updated[swapIndex].order;
    updated[swapIndex].order = tempOrder;
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    setItems(updated);

    await reorderEquipment([
      { id: updated[index].id, order: updated[index].order },
      { id: updated[swapIndex].id, order: updated[swapIndex].order },
    ]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Equipment</h1>
        <Button variant="primary" size="sm" onClick={handleAdd}>
          <i className="ri-add-line mr-1"></i>
          Add Equipment
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 animate-pulse rounded-2xl h-20" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <i className="ri-boxing-line text-4xl block mb-3"></i>
          <p>No equipment yet. Add your first item.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-surface-100 border border-zinc-800/50 rounded-2xl p-4 hover:border-zinc-600 transition-all"
            >
              <img
                src={item.imageUrl || "/placeholder.png"}
                alt={item.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold truncate">{item.name}</p>
                <p className="text-gray-500 text-sm truncate">{item.description}</p>
              </div>
              <Badge variant="neutral" size="sm">{item.category}</Badge>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleReorder(i, "up")} disabled={i === 0} className="w-8 h-8 rounded-lg text-gray-500 hover:text-white hover:bg-surface-300 transition-all disabled:opacity-30">
                  <i className="ri-arrow-up-s-line text-lg"></i>
                </button>
                <button onClick={() => handleReorder(i, "down")} disabled={i === items.length - 1} className="w-8 h-8 rounded-lg text-gray-500 hover:text-white hover:bg-surface-300 transition-all disabled:opacity-30">
                  <i className="ri-arrow-down-s-line text-lg"></i>
                </button>
                <button onClick={() => handleEdit(item)} className="w-8 h-8 rounded-lg text-gray-500 hover:text-white hover:bg-surface-300 transition-all">
                  <i className="ri-edit-line"></i>
                </button>
                <button onClick={() => setDeleteTarget(item)} className="w-8 h-8 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-500/5 transition-all">
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editingItem ? "Edit Equipment" : "Add Equipment"} size="md">
        <EquipmentForm equipment={editingItem} onSubmit={handleSubmit} loading={submitting} />
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Equipment" size="sm">
        <p className="text-gray-400 mb-6">
          Are you sure you want to delete <span className="text-white font-bold">{deleteTarget?.name}</span>?
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="primary" fullWidth loading={submitting} onClick={handleDelete} className="!from-red-700 !to-red-900">Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
