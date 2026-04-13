"use client";
// ============================================
// SmoothScroll — Lenis smooth scrolling wrapper
// ============================================
import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Keeps GSAP ScrollTrigger in sync with Lenis scroll position
function LenisScrollTriggerSync() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Drive Lenis via GSAP ticker so pinning + scrub are frame-accurate
    const update = (time: number) => {
      // lenis.raf is driven by ReactLenis internally, 
      // but we ensure ScrollTrigger always gets the latest scroll
      ScrollTrigger.update();
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <LenisScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
