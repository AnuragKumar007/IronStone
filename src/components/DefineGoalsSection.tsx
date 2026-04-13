"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function DefineGoalsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLDivElement>(null);

    const word1 = "Define".split("");
    const word2 = "your".split("");
    const word3 = "goals".split("");

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!sectionRef.current || !textAreaRef.current) return;

        const chars = Array.from(document.querySelectorAll(".goal-char")) as HTMLElement[];
        
        // Initial state - hidden and pushed down
        gsap.set(chars, { 
            opacity: 0.1, // So it's slightly visible as a shadow text
            y: 50,
            scale: 0.9,
            color: '#1a1a1a' // Dark gray initial color
        });

        // The animation that triggers when scrolling into view
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 60%", // Start animating when the section is 60% down the viewport
                end: "center center", 
                toggleActions: "play none none reverse", // Play on scroll down, reverse on scroll back up
            }
        });

        tl.to(chars, {
            opacity: 1,
            y: 0,
            scale: 1,
            color: '#ffffff',
            duration: 0.8,
            stagger: 0.05, // Stagger letter by letter reveal
            ease: "power3.out"
        });

    }, []);

    return (
        <div ref={sectionRef} className="flex justify-center items-center py-16 md:py-24 min-h-[50vh] md:h-[30rem] mt-[-10vh] md:mt-[0vh] bg-transparent z-0 relative overflow-hidden">
            <div ref={textAreaRef} className="text-area flex flex-col md:flex-row flex-wrap items-center justify-center gap-y-2 md:gap-x-4 lg:gap-x-12 px-6 text-[5rem] sm:text-[4rem] md:text-[5rem] lg:text-[7rem] leading-tight font-bold text-center w-full">
                <div className="flex">
                    {word1.map((char, i) => (
                        <span key={`w1-${i}`} className="goal-char">
                            {char}
                        </span>
                    ))}
                </div>
                <div className="flex">
                    {word2.map((char, i) => (
                        <span key={`w2-${i}`} className="goal-char">
                            {char}
                        </span>
                    ))}
                </div>
                <div className="flex">
                    {word3.map((char, i) => (
                        <span key={`w3-${i}`} className="goal-char">
                            {char}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
