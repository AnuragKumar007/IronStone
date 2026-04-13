"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function WorkoutWithSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Parallax floating images
            imagesRef.current.forEach((img, i) => {
                const speed = parseFloat(img.getAttribute("data-speed") || "1");
                gsap.to(img, {
                    y: -100 * speed,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5,
                    }
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="relative min-h-[100vh] flex flex-col justify-center items-center overflow-hidden bg-black" id="parallaxSection" ref={sectionRef}>
            {/* Gradient blobs with scroll animation */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[60rem] h-[40rem] flex items-center justify-center pointer-events-none" id="gradientBlobs">
                <div className="absolute w-[10rem] md:w-[19rem] h-[10rem] md:h-[19rem] bg-red-600 rounded-full blur-[80px] md:blur-[170px] opacity-25 md:opacity-30 -translate-x-[2rem] md:-translate-x-[9rem] -translate-y-[1rem] md:-translate-y-[2rem]"></div>
                <div className="absolute w-[10rem] md:w-[19rem] h-[10rem] md:h-[19rem] bg-red-900 rounded-full blur-[80px] md:blur-[170px] opacity-25 md:opacity-30 translate-x-[2rem] md:translate-x-[9rem] translate-y-[1rem] md:translate-y-[2rem]"></div>
            </div>

            {/* Content container */}
            <div className="relative z-10 text-center flex flex-col justify-center items-center px-4" id="textContent">
                <h3 className="text-gray-400 text-[2rem] md:text-[3rem] font-sans tracking-widest uppercase">Workout With</h3>
                <h2 className="text-[4rem] md:text-[11rem] mt-[-0.5rem] md:mt-[-1.5rem] leading-[4rem] md:leading-[11rem] tracking-tight font-bold bg-gradient-to-b from-red-500 via-red-600 to-red-950 inline-block text-transparent bg-clip-text uppercase">Iron Stone</h2>
            </div>

            {/* Floating images with parallax effect */}
            <div className="absolute inset-0 container mx-auto" id="floatingImages">
                <img
                    ref={(el) => { if (el) imagesRef.current[0] = el; }}
                    src="https://fitonist.com/wp-content/uploads/images/667fa6c733097c1516bb9798_watch-2441.webp"
                    className="absolute w-[8rem] md:w-[18rem] parallax-img z-20 top-[10%] md:top-[15%] left-[5%] md:left-[10%]"
                    data-speed="1.2"
                    alt=""
                />
                <img
                    ref={(el) => { if (el) imagesRef.current[1] = el; }}
                    src="https://fitonist.com/wp-content/uploads/images/667fa6c733097c1516bb979d_watch-2439.webp"
                    className="absolute w-[7rem] md:w-[16rem] parallax-img z-20 top-[20%] md:top-[25%] right-[5%] md:right-[10%]"
                    data-speed="0.8"
                    alt=""
                />
                <img
                    ref={(el) => { if (el) imagesRef.current[2] = el; }}
                    src="https://fitonist.com/wp-content/uploads/images/667fa6c733097c1516bb9794_watch-2440.webp"
                    className="absolute w-[7rem] md:w-[15rem] parallax-img z-20 bottom-[15%] md:bottom-[20%] left-[2%] md:left-[5%]"
                    data-speed="1.4"
                    alt=""
                />
                <img
                    ref={(el) => { if (el) imagesRef.current[3] = el; }}
                    src="https://fitonist.com/wp-content/uploads/images/667fa6c733097c1516bb9799_watch-2436.webp"
                    className="absolute w-[6rem] md:w-[14rem] parallax-img z-20 bottom-[5%] md:bottom-[10%] right-[2%] md:right-[5%]"
                    data-speed="1.1"
                    alt=""
                />
            </div>
        </div>
    );
}
