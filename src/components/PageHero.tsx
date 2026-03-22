"use client";
// ============================================
// PageHero — Reusable hero section for content pages
// ============================================
import { useRef, useEffect } from "react";
import gsap from "gsap";

interface PageHeroProps {
  badge: string;
  badgeIcon: string;
  title: string;
  highlight?: string;
  description: string;
}

export default function PageHero({
  badge,
  badgeIcon,
  title,
  highlight,
  description,
}: PageHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".page-hero-badge",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.2 }
      )
        .fromTo(
          ".page-hero-title",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3"
        )
        .fromTo(
          ".page-hero-desc",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3"
        );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Split title around the highlight word
  const renderTitle = () => {
    if (!highlight) return title;
    const parts = title.split(highlight);
    return (
      <>
        {parts[0]}
        <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
          {highlight}
        </span>
        {parts[1] || ""}
      </>
    );
  };

  return (
    <div ref={containerRef} className="text-center mb-16 md:mb-20 pt-8">
      <div className="page-hero-badge inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 mb-6">
        <i className={`${badgeIcon} text-red-500 text-sm`}></i>
        <span className="text-white text-xs font-semibold tracking-widest uppercase">
          {badge}
        </span>
      </div>
      <h1 className="page-hero-title text-[2.5rem] md:text-[4rem] font-bold text-white leading-tight">
        {renderTitle()}
      </h1>
      <p className="page-hero-desc text-gray-400 max-w-2xl mx-auto mt-4 text-lg">
        {description}
      </p>
    </div>
  );
}
