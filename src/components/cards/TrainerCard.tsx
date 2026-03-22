"use client";
// ============================================
// TrainerCard — Reusable personal trainer card
// ============================================
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TrainerCardProps {
  name: string;
  specialization: string;
  bio: string;
  image: string;
  experience: string;
  index?: number;
}

export default function TrainerCard({
  name,
  specialization,
  bio,
  image,
  experience,
  index = 0,
}: TrainerCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
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
      className="group relative bg-[#0d0d0d] rounded-3xl border border-zinc-800/50
                 overflow-hidden hover:border-zinc-600 transition-all duration-500"
    >
      {/* Image container with overlay */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700
                     group-hover:scale-110"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/40 to-transparent" />

        {/* Experience badge */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-zinc-700
                        rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <i className="ri-medal-line text-red-500 text-sm"></i>
          <span className="text-white text-xs font-bold">{experience}</span>
        </div>

        {/* Specialization badge */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold
                           uppercase tracking-wider px-3 py-1.5 rounded-full">
            {specialization}
          </span>
        </div>
      </div>

      {/* Info section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500
                       transition-colors duration-300">
          {name}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
          {bio}
        </p>

        {/* Social icons row */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-zinc-800">
          <button className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800
                             flex items-center justify-center text-gray-500
                             hover:text-red-500 hover:border-red-500/50 transition-all duration-300">
            <i className="ri-instagram-line text-sm"></i>
          </button>
          <button className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800
                             flex items-center justify-center text-gray-500
                             hover:text-red-500 hover:border-red-500/50 transition-all duration-300">
            <i className="ri-twitter-x-line text-sm"></i>
          </button>
          <button className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800
                             flex items-center justify-center text-gray-500
                             hover:text-red-500 hover:border-red-500/50 transition-all duration-300">
            <i className="ri-linkedin-line text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
