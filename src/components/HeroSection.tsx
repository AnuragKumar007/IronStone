"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!heroRef.current) return;

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Initial states
        gsap.set([subtitleRef.current, titleRef.current, textRef.current, btnRef.current], {
            y: 50,
            opacity: 0
        });

        // Animation sequence
        tl.to(subtitleRef.current, { y: 0, opacity: 1, duration: 1, delay: 0.2 })
          .to(titleRef.current, { y: 0, opacity: 1, duration: 1 }, "-=0.8")
          .to(textRef.current, { y: 0, opacity: 1, duration: 1 }, "-=0.8")
          .to(btnRef.current, { y: 0, opacity: 1, duration: 1 }, "-=0.6");
          
    }, []);

    // High quality gym image from unsplash
    const bgImageUrl = "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2670&auto=format&fit=crop";

    return (
        <section 
            ref={heroRef} 
            className="relative w-full min-h-screen flex items-center justify-start overflow-hidden bg-black"
        >
            {/* Background Image with Dark Overlay */}
            <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-60 mix-blend-luminosity"
                style={{ backgroundImage: `url(${bgImageUrl})` }}
            />
            
            {/* Additional Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 flex flex-col items-start justify-center pt-24 pb-32 text-white h-full my-auto">
                
                {/* Motivational Subtitle */}
                <h3 
                    ref={subtitleRef} 
                    className="text-red-500 font-bold tracking-[0.2em] text-xs sm:text-sm md:text-lg uppercase mb-3 md:mb-4"
                >
                    Shape Your Body
                </h3>

                {/* Main Heavy Typography */}
                <h1 
                    ref={titleRef} 
                    className="text-[3.5rem] sm:text-[4rem] md:text-[6rem] lg:text-[7rem] leading-[1] md:leading-[1.1] font-black uppercase tracking-tight mb-4 md:mb-6"
                >
                    Be <span className="text-red-600">Strong</span><br />
                    Train Hard
                </h1>

                {/* Supporting Text */}
                <p 
                    ref={textRef} 
                    className="max-w-xs sm:max-w-md md:max-w-xl text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl font-light leading-relaxed mb-8 md:mb-10"
                >
                    At IronStone, we believe that fitness is not just a destination; it's a journey towards a healthier, better life. We will develop a programme that will meet your individual needs.
                </p>

                {/* Call to Action Button */}
                <button 
                    ref={btnRef} 
                    className="group relative px-6 py-3 md:px-10 md:py-5 bg-red-600 text-white font-bold text-sm md:text-lg uppercase tracking-wider overflow-hidden hover:bg-white hover:text-black transition-colors duration-300 rounded-sm md:rounded-none"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Get Info
                        <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                    </span>
                    {/* Hover internal overlay effect could go here if wanted */}
                </button>

            </div>
            
            {/* Optional Side Decorators / Socials matching reference */}
            <div className="hidden xl:flex absolute right-12 bottom-1/2 translate-y-1/2 flex-col gap-6 z-20">
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center border border-white/20 hover:bg-red-600 hover:border-red-600 transition-all text-white"><i className="ri-facebook-fill"></i></a>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center border border-white/20 hover:bg-red-600 hover:border-red-600 transition-all text-white"><i className="ri-twitter-x-fill"></i></a>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center border border-white/20 hover:bg-red-600 hover:border-red-600 transition-all text-white"><i className="ri-instagram-line"></i></a>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center border border-white/20 hover:bg-red-600 hover:border-red-600 transition-all text-white"><i className="ri-youtube-fill"></i></a>
            </div>

            {/* Bottom Stat Tickers matching reference */}
            <div className="absolute bottom-0 left-0 w-full border-t border-white/10 bg-black/50 backdrop-blur-sm z-20">
                 <div className="container mx-auto px-6 md:px-12 lg:px-20 py-4 md:py-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 justify-between items-center text-center">
                     <div>
                         <h4 className="text-red-600 text-2xl md:text-3xl font-black">9+</h4>
                         <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wider mt-1">Years Experience</p>
                     </div>
                     <div>
                         <h4 className="text-red-600 text-2xl md:text-3xl font-black">8+</h4>
                         <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wider mt-1">Expert Trainers</p>
                     </div>
                     <div>
                         <h4 className="text-red-600 text-2xl md:text-3xl font-black">1500+</h4>
                         <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wider mt-1">Happy Members</p>
                     </div>
                     <div>
                         <h4 className="text-red-600 text-2xl md:text-3xl font-black">95%</h4>
                         <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wider mt-1">Success Rate</p>
                     </div>
                 </div>
            </div>
        </section>
    );
}
