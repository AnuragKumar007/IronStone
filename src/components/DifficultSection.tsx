"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import animationData from "../../public/ElementsJson.json";

export default function DifficultSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const lottieContainerRef = useRef<HTMLDivElement>(null);
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const endImageRef = useRef<HTMLImageElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!sectionRef.current || !containerRef.current || !lottieContainerRef.current || !endImageRef.current || !textContainerRef.current) return;

        const textItems = gsap.utils.toArray(textContainerRef.current.children) as HTMLElement[];
        const premovableSection = document.querySelector('.premovable-section') as HTMLElement;

        const animations = [
            { start: 1, stable: 50, end: 64 },
            { start: 65, stable: 100, end: 120 },
            { start: 121, stable: 151, end: 200 }
        ];

        gsap.set(containerRef.current, { zIndex: 1 });
        if (premovableSection) gsap.set(premovableSection, { zIndex: 2, autoAlpha: 1 });
        gsap.set(textItems, { opacity: 1, rotateX: 0 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=300%",
                pin: true,
                scrub: 1.5,
                anticipatePin: 1,
                toggleActions: "play reverse play reverse",
                onEnter: () => {
                    gsap.to(containerRef.current, { zIndex: 10, duration: 0 });
                    if (premovableSection) gsap.to(premovableSection, { autoAlpha: 0, duration: 0.3 });
                },
                onLeave: () => {
                    gsap.to(containerRef.current, { zIndex: 1, duration: 0 });
                    if (premovableSection) gsap.to(premovableSection, { autoAlpha: 1, duration: 0.3 });
                },
                onEnterBack: () => {
                    gsap.to(containerRef.current, { zIndex: 10, duration: 0 });
                    if (premovableSection) gsap.to(premovableSection, { autoAlpha: 0, duration: 0.3 });
                },
                onLeaveBack: () => {
                    gsap.to(containerRef.current, { zIndex: 1, duration: 0 });
                    if (premovableSection) gsap.to(premovableSection, { autoAlpha: 1, duration: 0.3 });
                }
            }
        });

        // Stack items initially
        textItems.forEach((item, i) => {
            if (i > 0) {
                gsap.set(item, { y: i * 120 });
                const span = item.querySelector('h3 span');
                if (span) span.classList.remove('gradient-text');
            } else {
                const span = item.querySelector('h3 span');
                if (span) span.classList.add('gradient-text');
            }
        });

        if (lottieRef.current) {
            lottieRef.current.goToAndStop(1, true);
        }

        animations.forEach((frameSet, i) => {
            const currentText = textItems[i];
            const nextText = textItems[i + 1];

            if (nextText) {
                tl.to({}, {
                    duration: 1,
                    onUpdate: function () {
                        const progress = this.progress();
                        const frameRange = frameSet.end - frameSet.start;
                        const currentFrame = Math.round(frameSet.start + (frameRange * progress));

                        if (i === animations.length - 1 && progress > 0.99) {
                            if (!endImageRef.current!.classList.contains('active')) {
                                endImageRef.current!.classList.remove('hidden');
                                void endImageRef.current!.offsetWidth; // trigger reflow
                                endImageRef.current!.style.opacity = '1';
                                lottieContainerRef.current!.style.opacity = '0';
                                endImageRef.current!.classList.add('active');
                            }
                        } else {
                            if (endImageRef.current!.classList.contains('active')) {
                                lottieContainerRef.current!.style.opacity = '1';
                                endImageRef.current!.style.opacity = '0';
                                endImageRef.current!.classList.remove('active');
                                setTimeout(() => {
                                    if (!endImageRef.current!.classList.contains('active')) {
                                        endImageRef.current!.classList.add('hidden');
                                    }
                                }, 150);
                            }
                        }
                        if (lottieRef.current) {
                            lottieRef.current.goToAndStop(currentFrame, true);
                        }
                    }
                })
                    .to(currentText, {
                        rotateX: 90,
                        y: -30,
                        opacity: 0,
                        duration: 1.2,
                        ease: "power2.inOut",
                        onStart: () => {
                            const currentSpan = currentText.querySelector('h3 span');
                            if (currentSpan) currentSpan.classList.remove('gradient-text');
                        }
                    })
                    .to(nextText, {
                        y: 0,
                        duration: 1,
                        ease: "power2.inOut",
                        onStart: () => {
                            const nextSpan = nextText.querySelector('h3 span');
                            if (nextSpan) nextSpan.classList.add('gradient-text');
                        }
                    }, "<")
                    .to(textItems.slice(i + 2), {
                        y: "-=120",
                        duration: 1,
                        ease: "power2.inOut"
                    }, "<");
            }
        });

        // Reset animation when scrolling back up
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top bottom",
            onLeaveBack: () => {
                textItems.forEach((item, i) => {
                    gsap.set(item, {
                        y: i * 120,
                        rotateX: 0,
                        opacity: 1,
                        display: 'block'
                    });

                    const span = item.querySelector('h3 span');
                    if (span) {
                        if (i === 0) {
                            span.classList.add('gradient-text');
                        } else {
                            span.classList.remove('gradient-text');
                        }
                    }
                });

                if (lottieContainerRef.current && endImageRef.current) {
                    lottieContainerRef.current.style.opacity = '1';
                    endImageRef.current.style.opacity = '0';
                    endImageRef.current.classList.remove('active');
                    setTimeout(() => {
                        if (!endImageRef.current!.classList.contains('active')) {
                            endImageRef.current!.classList.add('hidden');
                        }
                    }, 150);
                }
            }
        });

    }, []);

    return (
        <div className="difficult-section-container min-h-screen bg-black" ref={containerRef}>
            <div className="text-white min-h-screen flex flex-col items-center relative perspective-1000 bg-black" id="difficult-section" ref={sectionRef}>

                <div id="lottie-container-difficult" ref={lottieContainerRef} className="w-[400px] h-[250px] absolute left-1/2 top-[15vh] -translate-x-1/2 z-1 transition-opacity duration-150 ease-out">
                    <Lottie
                        lottieRef={lottieRef}
                        animationData={animationData}
                        loop={false}
                        autoplay={false}
                    />
                </div>

                <img
                    src="/end.png"
                    id="end-image"
                    ref={endImageRef}
                    className="hidden w-[400px] h-[250px] absolute left-1/2 top-[15vh] -translate-x-1/2 z-1 transition-opacity duration-150 ease-out"
                    alt="End state"
                />

                <div className="flex flex-col text-center w-full mt-[20vh] relative h-[800px] z-2 [transform-style:preserve-3d] [perspective:1000px]" id="text-container" ref={textContainerRef}>
                    <div className="text-item absolute w-full left-0 opacity-1 [transform-origin:center_center_-50px] [backface-visibility:hidden] flex items-center justify-center h-[200px] transform translate-y-0 pointer-events-none lowercase tracking-tight z-2 will-change-transform opacity-100 transition-none">
                        <h3 className="text-[6rem] font-medium"><span>increase</span> muscle size</h3>
                    </div>
                    <div className="text-item absolute w-full left-0 opacity-1 [transform-origin:center_center_-50px] [backface-visibility:hidden] flex items-center justify-center h-[200px] transform translate-y-0 pointer-events-none lowercase tracking-tight z-2 will-change-transform opacity-100 transition-none">
                        <h3 className="text-[6rem] font-medium"><span>Lose</span> weight</h3>
                    </div>
                    <div className="text-item absolute w-full left-0 opacity-1 [transform-origin:center_center_-50px] [backface-visibility:hidden] flex items-center justify-center h-[200px] transform translate-y-0 pointer-events-none lowercase tracking-tight z-2 will-change-transform opacity-100 transition-none">
                        <h3 className="text-[6rem] font-medium"><span>Track</span> results</h3>
                    </div>
                    <div className="text-item absolute w-full left-0 opacity-1 [transform-origin:center_center_-50px] [backface-visibility:hidden] flex items-center justify-center h-[200px] transform translate-y-0 pointer-events-none lowercase tracking-tight z-2 will-change-transform opacity-100 transition-none">
                        <h3 className="text-[6rem] font-medium"><span>Stay</span> motivated</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
