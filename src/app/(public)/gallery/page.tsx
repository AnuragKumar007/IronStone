"use client";
// ============================================
// Gallery Page — Gym Photo Gallery
// ============================================
import { useState } from "react";
import PageHero from "@/components/PageHero";
import GalleryCard from "@/components/cards/GalleryCard";

const galleryImages = [
  { image: "/equipment/equipment-1.png", caption: "Free Weights Zone" },
  { image: "/trainers/trainer-1.png", caption: "Personal Training Session" },
  { image: "/trainers/trainer-2.png", caption: "Yoga & Flexibility Class" },
  { image: "/equipment/equipment-1.png", caption: "Cardio Floor" },
  { image: "/trainers/trainer-1.png", caption: "Boxing Ring" },
  { image: "/equipment/equipment-1.png", caption: "CrossFit Area" },
  { image: "/trainers/trainer-2.png", caption: "Group Classes" },
  { image: "/equipment/equipment-1.png", caption: "Recovery Lounge" },
  { image: "/trainers/trainer-1.png", caption: "Strength Zone" },
  { image: "/equipment/equipment-1.png", caption: "Olympic Lifting Platform" },
  { image: "/trainers/trainer-2.png", caption: "Stretching Area" },
  { image: "/equipment/equipment-1.png", caption: "Battle Ropes Station" },
];

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<string | null>(null);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`${
                i % 5 === 0 ? "sm:row-span-2 h-[28rem]" :
                i % 3 === 1 ? "h-72" :
                "h-64"
              }`}
            >
              <GalleryCard
                image={img.image}
                caption={img.caption}
                index={i}
                onClick={() => setLightbox(img.image)}
              />
            </div>
          ))}
        </div>

        {/* Note for admin */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 text-sm">
            <i className="ri-admin-line mr-1"></i>
            Admins can upload and manage gallery images from the admin panel.
          </p>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-white text-3xl hover:text-red-500 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <i className="ri-close-line"></i>
          </button>
          <img
            src={lightbox}
            alt="Gallery full view"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl
                       shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
