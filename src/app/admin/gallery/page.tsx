"use client";
// ============================================
// Admin Gallery — Upload, edit captions, delete
// ============================================
import { useState, useEffect } from "react";
import { Button, Input, Modal, ImageUpload } from "@/components/ui";
import { getGalleryImages, addGalleryImage, updateGalleryImage, deleteGalleryImage } from "@/lib/firestore";
import { uploadImage, deleteImage } from "@/lib/storage";
import { useAuth } from "@/hooks/useAuth";
import type { GalleryImage } from "@/types";

export default function AdminGalleryPage() {
  const { user } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [newCaption, setNewCaption] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [captionValue, setCaptionValue] = useState("");

  const fetchImages = () => {
    setLoading(true);
    getGalleryImages().then(setImages).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchImages(); }, []);

  const handleUpload = async () => {
    if (!newFile) return;
    setSubmitting(true);
    try {
      const imageUrl = await uploadImage("gallery", newFile);
      await addGalleryImage({
        imageUrl,
        caption: newCaption,
        uploadedAt: new Date(),
        uploadedBy: user?.uid || "",
      });
      setUploadOpen(false);
      setNewFile(null);
      setNewCaption("");
      fetchImages();
    } catch (err) {
      console.error("Upload failed:", err);
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
      await deleteGalleryImage(deleteTarget.id);
      setDeleteTarget(null);
      fetchImages();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCaptionSave = async (id: string) => {
    try {
      await updateGalleryImage(id, { caption: captionValue });
      setEditingCaption(null);
      fetchImages();
    } catch (err) {
      console.error("Caption update failed:", err);
    }
  };

  const startEditCaption = (image: GalleryImage) => {
    setEditingCaption(image.id);
    setCaptionValue(image.caption);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Gallery</h1>
        <Button variant="primary" size="sm" onClick={() => setUploadOpen(true)}>
          <i className="ri-upload-cloud-2-line mr-1"></i>
          Upload Image
        </Button>
      </div>

      {/* Image Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 animate-pulse rounded-2xl h-48" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <i className="ri-image-line text-4xl block mb-3"></i>
          <p>No gallery images yet. Upload your first image.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative bg-surface-100 border border-zinc-800/50 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all"
            >
              <img
                src={img.imageUrl}
                alt={img.caption}
                className="w-full h-48 object-cover"
              />

              {/* Delete button */}
              <button
                onClick={() => setDeleteTarget(img)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/70 rounded-lg flex items-center justify-center
                           text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <i className="ri-delete-bin-line text-sm"></i>
              </button>

              {/* Caption */}
              <div className="p-3">
                {editingCaption === img.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={captionValue}
                      onChange={(e) => setCaptionValue(e.target.value)}
                      className="auth-input text-xs py-1.5 px-2 flex-1"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === "Enter") handleCaptionSave(img.id); }}
                    />
                    <button
                      onClick={() => handleCaptionSave(img.id)}
                      className="text-green-500 hover:text-green-400"
                    >
                      <i className="ri-check-line"></i>
                    </button>
                    <button
                      onClick={() => setEditingCaption(null)}
                      className="text-gray-500 hover:text-white"
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                ) : (
                  <p
                    onClick={() => startEditCaption(img)}
                    className="text-gray-400 text-sm truncate cursor-pointer hover:text-white transition-colors"
                    title="Click to edit"
                  >
                    {img.caption || "No caption"}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Image" size="md">
        <div className="space-y-4">
          <ImageUpload onChange={(f) => setNewFile(f)} />
          <Input
            label="Caption"
            icon="ri-text"
            placeholder="Image caption..."
            value={newCaption}
            onChange={(e) => setNewCaption(e.target.value)}
          />
          <Button
            variant="primary"
            fullWidth
            loading={submitting}
            disabled={!newFile}
            onClick={handleUpload}
          >
            Upload
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Image" size="sm">
        <p className="text-gray-400 mb-6">
          Are you sure you want to delete this image? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="primary" fullWidth loading={submitting} onClick={handleDelete} className="!from-red-700 !to-red-900">Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
