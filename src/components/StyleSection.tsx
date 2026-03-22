"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function StyleSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const iconContainersRef = useRef<HTMLDivElement>(null);
    const contentItemsRef = useRef<HTMLDivElement>(null);
    const imageContainersRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!sectionRef.current || !iconContainersRef.current || !contentItemsRef.current || !imageContainersRef.current) return;

        const iconContainers = Array.from(iconContainersRef.current.children) as HTMLElement[];
        const contentItems = Array.from(contentItemsRef.current.children) as HTMLElement[];
        const imageContainers = Array.from(imageContainersRef.current.children) as HTMLElement[];

        const radius = 150;

        function initializeImages() {
            imageContainers.forEach((container, index) => {
                const angle = ((index * 90) + 270) * (Math.PI / 180);
                gsap.set(container, {
                    xPercent: -50,
                    yPercent: -50,
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius,
                    opacity: index === 0 ? 1 : 0,
                    scale: index === 0 ? 1 : 0.3,
                    zIndex: index === 0 ? 2 : 1,
                    transformOrigin: "center center"
                });
            });

            contentItems.forEach((item, index) => {
                gsap.set(item, {
                    opacity: index === 0 ? 1 : 0,
                    y: index === 0 ? 0 : 20,
                    display: index === 0 ? 'block' : 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                });
            });
        }

        function updateImagesPosition(rotation: number) {
            imageContainers.forEach((container, index) => {
                const baseAngle = index * 90;
                const currentAngle = ((baseAngle - rotation + 270) % 360) * (Math.PI / 180);

                const x = Math.cos(currentAngle) * radius;
                const y = Math.sin(currentAngle) * radius;

                const normalizedAngle = ((baseAngle - rotation) % 360 + 360) % 360;
                const isActive = normalizedAngle > 225 && normalizedAngle < 315;

                gsap.to(container, {
                    x: x,
                    y: y,
                    opacity: isActive ? 1 : 0,
                    scale: isActive ? 1 : 0.3,
                    zIndex: isActive ? 2 : 1,
                    duration: 0.5,
                    ease: "power2.out",
                    immediateRender: false
                });
            });
        }

        let isAnimating = false;
        let lastIndex = 0;

        function updateContent(progress: number) {
            const currentIndex = Math.min(3, Math.floor(progress * 4));

            if (currentIndex !== lastIndex && currentIndex >= 0 && currentIndex < 4 && !isAnimating) {
                isAnimating = true;

                contentItems.forEach(item => gsap.killTweensOf(item));

                contentItems.forEach((item, i) => {
                    if (i !== currentIndex) {
                        gsap.to(item, {
                            opacity: 0,
                            y: -20,
                            duration: 0.2,
                            ease: "power2.in",
                            onComplete: () => {
                                item.style.display = 'none';
                            }
                        });
                    }
                });

                contentItems[currentIndex].style.display = 'block';
                contentItems[currentIndex].style.position = 'absolute';
                contentItems[currentIndex].style.top = '0';
                contentItems[currentIndex].style.left = '0';
                contentItems[currentIndex].style.width = '100%';

                gsap.fromTo(contentItems[currentIndex],
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out",
                        onComplete: () => { isAnimating = false; }
                    }
                );

                iconContainers.forEach((icon, i) => {
                    const iconBg = icon.querySelector('div');
                    if (iconBg) {
                        if (i === currentIndex) {
                            iconBg.classList.add('bg-black', 'text-white');
                            iconBg.classList.remove('bg-gray-100');
                        } else {
                            iconBg.classList.remove('bg-black', 'text-white');
                            iconBg.classList.add('bg-gray-100');
                        }
                    }
                });

                lastIndex = currentIndex;
            }
        }

        const st = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "+=300%",
            pin: true,
            pinSpacing: true,
            scrub: 1,
            onUpdate: self => {
                const progress = self.progress;
                const rotation = progress * 360;
                updateImagesPosition(rotation);
                updateContent(progress);
            }
        });

        iconContainers.forEach((icon, index) => {
            icon.addEventListener('click', () => {
                const progress = index / 3;
                const scrollOffset = st.start + (st.end - st.start) * progress;
                window.scrollTo({ top: scrollOffset, behavior: "smooth" });
            });
        });

        initializeImages();

        return () => {
            st.kill();
        }
    }, []);

    return (
        <>
            <div className="h-screen bg-zinc-900 mt-[100vh] mb-[100vh]"></div>

            {/* Premovable Section */}
            <div className="premovable-section h-screen py-auto bg-white opacity-50 relative z-2 transition-opacity duration-300">
                <div className="bg-white py-20 px-10">
                    <div className="container mx-auto px-4">
                        <p className="text-black text-xl">What's your preferred workout style?</p>
                        <div className="relative inline-block mt-3">
                            <h2 className="text-[10rem] font-semibold text-black mb-8 leading-[8.5rem]">Choose <br /> your style</h2>

                            <div className="absolute bottom-[1rem] left-[41.5rem] z-10 ">
                                <span className="inline-block bg-[#C8ACF0] text-black font-bold px-8 py-3 rounded-full transform -rotate-12 text-2xl">
                                    HOME
                                </span>
                            </div>

                            <div className="absolute bottom-[-1.9rem] left-[41.5rem]">
                                <span className="inline-block bg-[#84E3FF] text-black font-bold px-8 py-3 rounded-full transform rotate-12 text-2xl">
                                    OUTDOOR
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Movable Section */}
            <div className="movable-section h-screen py-14 px-2 relative z-2 bg-white" ref={sectionRef}>
                <div className="bg-white">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row">
                            {/* Left Column */}
                            <div className="w-full md:w-1/2 px-10 py-[4.5rem] h-[40rem] flex flex-col">
                                {/* Icons Section */}
                                <div className="flex space-x-8 mb-16" ref={iconContainersRef}>
                                    <div className="icon-container cursor-pointer relative z-10" data-index="0">
                                        <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center transition-all duration-300">
                                            <i className="ri-home-line text-3xl"></i>
                                        </div>
                                        <p className="text-center mt-2 text-sm text-black">Home Workout</p>
                                    </div>
                                    <div className="icon-container cursor-pointer relative z-10" data-index="1">
                                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300">
                                            <i className="ri-run-line text-3xl text-black"></i>
                                        </div>
                                        <p className="text-center mt-2 text-sm text-black">Outdoor</p>
                                    </div>
                                    <div className="icon-container cursor-pointer relative z-10" data-index="2">
                                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300">
                                            <i className="ri-heart-pulse-line text-3xl text-black"></i>
                                        </div>
                                        <p className="text-center mt-2 text-sm text-black">Cardio</p>
                                    </div>
                                    <div className="icon-container cursor-pointer relative z-10" data-index="3">
                                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300">
                                            <i className="ri-boxing-line text-3xl text-black"></i>
                                        </div>
                                        <p className="text-center mt-2 text-sm text-black">Strength</p>
                                    </div>
                                </div>

                                {/* Text Content Section */}
                                <div className="content-container relative w-full h-[200px] overflow-hidden text-black">
                                    <div className="content-wrapper absolute top-0 left-0 w-full" ref={contentItemsRef}>
                                        <div className="content-item absolute top-0 left-0 w-full opacity-100 transform translate-y-0 active">
                                            <h2 className="text-[3.2rem] font-bold mb-6">Home Workout</h2>
                                            <p className="text-gray-600 text-[1.35rem]">Achieve your goals from the comfort of your home with our dynamic and convenient home workout plans.</p>
                                        </div>
                                        <div className="content-item absolute top-0 left-0 w-full opacity-0 transform translate-y-5 hidden">
                                            <h2 className="text-[3.2rem] font-bold mb-6">Outdoor Training</h2>
                                            <p className="text-gray-600 text-[1.35rem]">Elevate your fitness experience and embrace the vitality of the great outdoor with invigorating outdoor workouts, where every session becomes a breath of fresh air for your body and mind.</p>
                                        </div>
                                        <div className="content-item absolute top-0 left-0 w-full opacity-0 transform translate-y-5 hidden">
                                            <h2 className="text-[3.2rem] font-bold mb-6">Cardio Excellence</h2>
                                            <p className="text-gray-600 text-[1.35rem]">Unleash your full potential with our cardio sessions, blending strength, agility, and endurance training for a transformative fitness experiance like never before.</p>
                                        </div>
                                        <div className="content-item absolute top-0 left-0 w-full opacity-0 transform translate-y-5 hidden">
                                            <h2 className="text-[3.2rem] font-bold mb-6">Strength Training</h2>
                                            <p className="text-gray-600 text-[1.35rem]">Transorm your body and amplify your strength with our state-of-the-art gym workouts, where every workout is a step closer to your fitness goals.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="w-full md:w-1/2 md:pl-12 mt-[5rem]">
                                <div className="image-container absolute w-full md:w-1/2 h-full flex justify-center items-center pointer-events-none">
                                    <div className="image-wrapper relative w-[500px] h-[300px] [transform-style:preserve-3d]" ref={imageContainersRef}>
                                        <div className="image-container-wrapper absolute w-full h-full bg-black rounded-[2rem] p-2 will-change-transform transform-origin-center">
                                            <img src="https://fitonist.com/wp-content/uploads/images/6697919ea972b47410a630d1_widget-422435.webp" className="image-item w-full h-full object-cover rounded-[1.5rem]" alt="Home Workout" />
                                        </div>
                                        <div className="image-container-wrapper absolute w-full h-full bg-black rounded-[2rem] p-2 will-change-transform transform-origin-center">
                                            <img src="https://fitonist.com/wp-content/uploads/images/6697919d79a461cb42253339_widget-422438.png" className="image-item w-full h-full object-cover rounded-[1.5rem]" alt="Outdoor Training" />
                                        </div>
                                        <div className="image-container-wrapper absolute w-full h-full bg-black rounded-[2rem] p-2 will-change-transform transform-origin-center">
                                            <img src="https://fitonist.com/wp-content/uploads/images/6697919d5f853e53e3850d46_widget-422436.webp" className="image-item w-full h-full object-cover rounded-[1.5rem]" alt="Cardio" />
                                        </div>
                                        <div className="image-container-wrapper absolute w-full h-full bg-black rounded-[2rem] p-2 will-change-transform transform-origin-center">
                                            <img src="https://fitonist.com/wp-content/uploads/images/6697919e1ca53411f52784ab_widget-422437.webp" className="image-item w-full h-full object-cover rounded-[1.5rem]" alt="Strength" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
