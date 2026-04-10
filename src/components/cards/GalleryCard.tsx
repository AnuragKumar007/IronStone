"use client";
// ============================================
// GalleryCard — Reusable gallery image card
// ============================================
import { useState } from "react";

interface GalleryCardProps {
  imageUrl: string;
  caption?: string;
  index?: number;
  onClick?: () => void;
}

export default function GalleryCard({
  imageUrl,
  caption,
  index = 0,
  onClick,
}: GalleryCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer h-full
                 border border-zinc-800/30 hover:border-zinc-600
                 transition-all duration-500 hover:-translate-y-1"
      style={{
        animationDelay: `${index * 80}ms`,
        animation: "fadeInUp 0.6s ease-out forwards",
        opacity: 0,
      }}
    >
      {/* Skeleton loader */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-900 animate-pulse" />
      )}

      {/* Image */}
      <img
        src={imageUrl}
        alt={caption || "Gallery image"}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700
                    group-hover:scale-110 group-hover:brightness-75
                    ${isLoaded ? "opacity-100" : "opacity-0"}`}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-400
                      flex flex-col justify-end p-5">
        {caption && (
          <p className="text-white text-sm font-semibold translate-y-4
                        group-hover:translate-y-0 transition-transform duration-400">
            {caption}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2 translate-y-4
                        group-hover:translate-y-0 transition-transform duration-500 delay-75">
          <i className="ri-zoom-in-line text-red-500 text-lg"></i>
          <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
            View Full
          </span>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-red-600/0
                      border-l-[40px] border-l-transparent
                      group-hover:border-t-red-600/80 transition-all duration-500" />
    </div>
  );
}

