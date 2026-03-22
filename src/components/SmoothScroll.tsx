// @ts-nocheck
"use client";
import { ReactLenis } from "@studio-freight/react-lenis";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
    }, []);

    return (
        // @ts-ignore - mismatch between local React 19 and Lenis ReactNode
        <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
            {children}
        </ReactLenis>
    );
}
