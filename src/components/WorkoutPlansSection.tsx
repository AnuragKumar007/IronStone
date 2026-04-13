"use client";
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { DotLottie } from "@lottiefiles/dotlottie-react";

export default function WorkoutPlansSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    const textBlock2Ref = useRef<HTMLDivElement>(null);
    const blurredSphereRef = useRef<HTMLDivElement>(null);
    const sphereDivRef = useRef<HTMLDivElement>(null);
    const leftSectionRef = useRef<HTMLDivElement>(null);
    const rightSectionRef = useRef<HTMLDivElement>(null);
    const lottieContainerRef = useRef<HTMLDivElement>(null);
    const dotLottieRef = useRef<DotLottie | null>(null);

    const dotLottieRefCallback = useCallback((instance: DotLottie | null) => {
        dotLottieRef.current = instance;
    }, []);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 768px)",
            isMobile: "(max-width: 767px)"
        }, (context) => {
            const { isDesktop } = context.conditions!;

            // Set initial states
            // gsap.set([leftSectionRef.current, rightSectionRef.current], {
            //     opacity: 1,
            //     x: 0,
            //     y: 0
            // });

            const mainTl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=200%",
                    scrub: 1,
                    pin: true,
                    pinSpacing: true,
                }
            });

            mainTl
                // Blurred sphere fade in
                .fromTo(blurredSphereRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.8, ease: "power2.inOut" })

                .fromTo(sphereDivRef.current,
                    { filter: 'blur(0px)', opacity: 0.3 },
                    { filter: 'blur(130px)', opacity: 1, duration: 0.8, ease: "power2.inOut" }, "<")

                // Lottie animation progress
                .to({}, {
                    duration: 2.0,
                    onUpdate: function () {
                        const progress = this.progress();
                        const lottie = dotLottieRef.current;
                        if (lottie && lottie.totalFrames > 0) {
                            const total = lottie.totalFrames;
                            lottie.setFrame(Math.min(Math.floor(progress * total), total - 1));
                        }
                    }
                }, "-=0.5")

                .to({}, { duration: 0.2 }, ">=0")

                // Fade out Lottie container
                .to(lottieContainerRef.current, {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.inOut"
                });

            if (isDesktop) {
                // Desktop only: fly away left/right sections + fade sphere
                mainTl
                    .to(leftSectionRef.current, {
                        x: -300,
                        y: -200,
                        opacity: 0,
                        duration: 1.5,
                        ease: "power2.inOut"
                    }, ">=0")
                    .to(rightSectionRef.current, {
                        x: 300,
                        y: -200,
                        opacity: 0,
                        duration: 1.5,
                        ease: "power2.inOut"
                    }, "<")
                    .to(blurredSphereRef.current, {
                        opacity: 0,
                        duration: 1.5,
                        ease: "power2.inOut"
                    }, "<");
            } else {
                // Mobile: just fade out sphere, text stays static
                mainTl
                    .to(blurredSphereRef.current, {
                        opacity: 0,
                        duration: 1.5,
                        ease: "power2.inOut"
                    });
            }
        });

        return () => mm.revert();
    }, []);

    return (
        <div
            className="min-h-screen relative overflow-hidden"
            id="workout-section"
            ref={sectionRef}
            style={{ width: '100vw', maxWidth: '100%' }}
        >
            <div className="flex flex-col md:flex-row items-center justify-center min-h-screen max-w-7xl mx-auto px-4 md:px-12 lg:px-20 gap-10 md:gap-16 pt-24 pb-16 relative"
                style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                {/* Blurred sphere */}
                <div
                    ref={blurredSphereRef}
                    className="absolute -left-20 top-64 transform -translate-y-1/2 -translate-x-1/4 z-0 opacity-0"
                >
                    <div
                        ref={sphereDivRef}
                        className="size-96 rounded-full bg-gradient-to-r from-red-600/30 to-red-900/30"
                        style={{ filter: 'blur(80px)' }}
                    ></div>
                </div>

                {/* Left Side - Text Content */}
                <div  className="md:w-1/2 min-w-0 relative my-auto z-10 text-center md:text-left  "
                    style={{ width: '100%', maxWidth: '100%' }}>
                    {/* Text Block */}
                    <div ref={textBlock2Ref} className="space-y-4 border-blue">
                        <p className="uppercase tracking-widest text-xs md:text-sm font-semibold text-red-500">Train With Purpose</p>
                        <h2 className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight font-bold tracking-tight break-words">
                            Structured plans to push your limits every session
                        </h2>
                    </div>
                </div>

                {/* Right Side - Lottie Animation */}
                <div ref={rightSectionRef} className="right-section md:w-1/2 min-w-0 overflow-hidden flex items-center justify-center z-10"
                    style={{ width: '100%', maxWidth: '100%' }}>
                    <div ref={lottieContainerRef} className="w-full h-full">
                        <DotLottieReact
                            src="https://lottie.host/8b1342d2-9500-41d7-b6e7-3303379e0828/PJfITWks6v.lottie"
                            loop={false}
                            autoplay={false}
                            dotLottieRefCallback={dotLottieRefCallback}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
