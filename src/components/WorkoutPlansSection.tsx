"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import animationData from "../../public/DSA.json";

export default function WorkoutPlansSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    const textBlock2Ref = useRef<HTMLDivElement>(null);
    const blurredSphereRef = useRef<HTMLDivElement>(null);
    const sphereDivRef = useRef<HTMLDivElement>(null);
    const leftSectionRef = useRef<HTMLDivElement>(null);
    const rightSectionRef = useRef<HTMLDivElement>(null);
    const lottieContainerRef = useRef<HTMLDivElement>(null);
    const lottieRef = useRef<LottieRefCurrentProps>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

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

        // Set initial states
        gsap.set([leftSectionRef.current, rightSectionRef.current], {
            opacity: 1,
            x: 0,
            y: 0
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
                    if (lottieRef.current) {
                        lottieRef.current.goToAndStop(Math.floor(progress * 163), true);
                    }
                }
            }, "-=0.5")

            .to({}, { duration: 0.2 }, ">=0")

            // Fade out Lottie container
            .to(lottieContainerRef.current, {
                opacity: 0.8,
                duration: 0.5,
                ease: "power2.inOut"
            })

            // Left section animation
            .to(leftSectionRef.current, {
                x: -300,
                y: -200,
                opacity: 0,
                duration: 1.5,
                ease: "power2.inOut"
            }, ">=0")

            // Right section animation
            .to(rightSectionRef.current, {
                x: 300,
                y: -200,
                opacity: 0,
                duration: 1.5,
                ease: "power2.inOut"
            }, "<")

            // Fade out blurred sphere
            .to(blurredSphereRef.current, {
                opacity: 0,
                duration: 1.5,
                ease: "power2.inOut"
            }, "<");

    }, []);

    return (
        <div
            className="flex flex-col md:flex-row items-center align-center justify-center h-screen px-5 gap-10 md:gap-[10rem] pt-28 pb-10 mx-4 md:mx-[8rem] relative"
            id="workout-section"
            ref={sectionRef}
        >
            {/* Blurred sphere */}
            <div
                ref={blurredSphereRef}
                className="absolute left-[-5rem] top-[16rem] transform -translate-y-1/2 -translate-x-1/4 z-0 opacity-0"
            >
                <div
                    ref={sphereDivRef}
                    className="w-[23rem] h-[23rem] rounded-full bg-gradient-to-r from-red-600/30 to-red-900/30 blur-[80px]"
                ></div>
            </div>

            {/* Left Side - Text Content */}
            <div ref={leftSectionRef} className="left-section w-full md:w-1/2 relative my-auto">
                {/* Text Block */}
                <div ref={textBlock2Ref}>
                    <p className="text-[#959597] text-xl">Achieve your Goals</p>
                    <h2 className="text-[#B5B5B6] text-[2.5rem] md:text-[4rem] leading-[3rem] md:leading-[3.5rem] font-bold">
                        Create unlimited custom-made workouts
                    </h2>
                </div>
            </div>

            {/* Right Side - Lottie Animation */}
            <div ref={rightSectionRef} className="right-section w-full md:w-1/2 flex items-center justify-center z-10 h-full">
                <div ref={lottieContainerRef} className="w-full h-full">
                    <Lottie
                        lottieRef={lottieRef}
                        animationData={animationData}
                        loop={false}
                        autoplay={false}
                    />
                </div>
            </div>
        </div>
    );
}
