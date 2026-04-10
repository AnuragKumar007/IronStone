"use client";
// ============================================
// SmoothScroll — Lenis smooth scrolling wrapper
// ============================================
import { ReactLenis } from "lenis/react";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
