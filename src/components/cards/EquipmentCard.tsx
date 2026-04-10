"use client";
// ============================================
// EquipmentCard — Reusable equipment card
// ============================================
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface EquipmentCardProps {
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  index?: number;
}

export default function EquipmentCard({
  name,
  description,
  imageUrl,
  category,
  index = 0,
}: EquipmentCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="group relative bg-[#0d0d0d] rounded-2xl border border-zinc-800/50
                 overflow-hidden hover:border-zinc-600 transition-all duration-500
                 hover:-translate-y-2"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700
                     group-hover:scale-105"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent
                        opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700 text-gray-300
                           text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            {category}
          </span>
        </div>

        {/* Detail icon on hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100
                        translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center
                          shadow-lg shadow-red-900/30">
            <i className="ri-arrow-right-up-line text-white text-lg"></i>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-red-500
                       transition-colors duration-300">
          {name}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}
