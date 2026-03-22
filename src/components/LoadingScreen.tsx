"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function LoadingScreen() {
    const [loadingComplete, setLoadingComplete] = useState(false);
    const loadingScreenRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const loadingPercentageRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!loadingScreenRef.current || !logoRef.current || !loadingPercentageRef.current) return;

        const mainTl = gsap.timeline({
            onComplete: () => {
                setLoadingComplete(true);
            }
        });

        // Animate percentage
        mainTl.to({ value: 0 }, {
            value: 100,
            duration: 2.5,
            ease: "power2.inOut",
            onUpdate: function () {
                if (loadingPercentageRef.current) {
                    loadingPercentageRef.current.textContent = `${Math.round(this.targets()[0].value)}%`;
                }
            }
        });

        // Loading screen exit animations
        mainTl.to(logoRef.current, {
            y: -50,
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            ease: "power2.inOut",
        }, "-=0.5");

        mainTl.to(loadingScreenRef.current, {
            yPercent: -100,
            duration: 1,
            ease: "power3.inOut"
        }, "-=0.2");

    }, []);

    if (loadingComplete) return null;

    return (
        <div
            ref={loadingScreenRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#A2C7FF] via-[#B0BDFF] to-[#D2AEF9] origin-center"
        >
            <div
                ref={logoRef}
                className="w-28 h-28 bg-black rounded-xl flex items-center justify-center"
            >
                <span className="text-white text-[4rem] font-bold">IS</span>
            </div>

            <div className="absolute bottom-10 flex gap-2">
                <span className="text-black text-lg font-semibold">Loading</span>
                <span ref={loadingPercentageRef} className="text-black text-lg font-semibold">
                    0%
                </span>
            </div>
        </div>
    );
}
