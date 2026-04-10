"use client";
// ============================================
// Gallery Page — Gym Photo Gallery
// ============================================
import { useState, useEffect } from "react";
import PageHero from "@/components/PageHero";
import GalleryCard from "@/components/cards/GalleryCard";
import { Modal } from "@/components/ui";
import { getGalleryImages } from "@/lib/firestore";
import type { GalleryImage } from "@/types";

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    getGalleryImages()
      .then(setImages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 md:px-16 py-16">
        <PageHero
          badge="Gallery"
          badgeIcon="ri-gallery-fill"
          title="Inside IronStone"
          highlight="IronStone"
          description="Step inside our 10,000 sq. ft. premium facility. Every corner is designed to inspire your next rep."
        />

        {/* Photo Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={`bg-zinc-900 animate-pulse rounded-2xl ${
                  i % 5 === 0 ? "sm:row-span-2 h-[28rem]" : i % 3 === 1 ? "h-72" : "h-64"
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {images.map((img, i) => (
              <div
                key={img.id}
                className={`${
                  i % 5 === 0
                    ? "sm:row-span-2 h-[28rem]"
                    : i % 3 === 1
                    ? "h-72"
                    : "h-64"
                }`}
              >
                <GalleryCard
                  imageUrl={img.imageUrl}
                  caption={img.caption}
                  index={i}
                  onClick={() => setLightbox(img.imageUrl)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Note for admin */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 text-sm">
            <i className="ri-admin-line mr-1"></i>
            Admins can upload and manage gallery images from the admin panel.
          </p>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Modal isOpen={!!lightbox} onClose={() => setLightbox(null)} size="lg">
        {lightbox && (
          <img
            src={lightbox}
            alt="Gallery full view"
            className="w-full max-h-[75vh] object-contain rounded-xl"
          />
        )}
      </Modal>
    </div>
  );
}
