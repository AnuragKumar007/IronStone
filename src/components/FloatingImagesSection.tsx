"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function FloatingImagesSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!sectionRef.current) return;

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

    }, []);

    return (
        <div className="relative min-h-[150vh] flex flex-col justify-center items-center overflow-hidden bg-black" id="parallaxSection" ref={sectionRef}>
            {/* Gradient blobs with scroll animation */}
            <div className="absolute top-[64%] left-1/2 md:left-[60%] -translate-x-1/2 -translate-y-1/2 w-[20rem] md:w-[60rem] h-[40rem] flex items-center justify-center transform scale-50 md:scale-100" id="gradientBlobs">
                <div className="absolute w-[19rem] h-[19rem] bg-[#ff0000] rounded-full blur-[170px] opacity-30 translate-x-[-18rem] translate-y-[-8rem]"></div>
                <div className="absolute w-[19rem] h-[19rem] bg-[#990000] rounded-full blur-[170px] opacity-30 translate-x-[3rem] translate-y-[-8rem]"></div>
            </div>

            {/* Content container */}
            <div className="absolute z-10 text-center flex flex-col justify-center items-center px-4" id="textContent">
                <h3 className="text-[#919399] text-[2rem] md:text-[3rem] font-poppins tracking-widest">Workout With</h3>
                <h2 className="text-[4rem] md:text-[11rem] mt-[-0.5rem] md:mt-[-1.5rem] leading-[4rem] md:leading-[11rem] tracking-tight font-bold bg-gradient-to-b from-[#ff3333] via-[#cc0000] to-[#660000] inline-block text-transparent bg-clip-text uppercase">Iron Stone</h2>
            </div>

            {/* Floating images with parallax effect */}
            <div className="container relative mx-auto h-[600px] w-full" id="floatingImages">
                <img
                    ref={(el) => { if (el) imagesRef.current[0] = el; }}
                    src="https://fitonist.com/wp-content/uploads/images/667fa6c733097c1516bb9798_watch-2441.webp"
                    className="absolute w-[10rem] md:w-[18rem] parallax-img z-20"
                    data-speed="1.2"
                    style={{ top: "5%", left: "10%" }}
                    alt=""
                />
                <img
                    ref={(el) => { if (el) imagesRef.current[1] = el; }}
                    src="https://fitonist.com/wp-content/uploads/images/667fa6c733097c1516bb979d_watch-2439.webp"
                    className="absolute w-[8rem] md:w-[16rem] parallax-img z-20"
                    data-speed="0.8"
                    style={{ top: "15%", right: "10%" }}
                    alt=""
                />
                <img
                    ref={(el) => { if (el) imagesRef.current[2] = el; }}
                    src="https://fitonist.com/wp-content/uploads/images/667fa6c733097c1516bb9794_watch-2440.webp"
                    className="absolute w-[8rem] md:w-[15rem] parallax-img z-20"
                    data-speed="1.4"
                    style={{ bottom: "10%", left: "5%" }}
                    alt=""
                />
                <img
                    ref={(el) => { if (el) imagesRef.current[3] = el; }}
                    src="https://fitonist.com/wp-content/uploads/images/667fa6c733097c1516bb9799_watch-2436.webp"
                    className="absolute w-[8rem] md:w-[14rem] parallax-img z-20"
                    data-speed="1.1"
                    style={{ bottom: "0%", right: "5%" }}
                    alt=""
                />
            </div>
        </div>
    );
}
