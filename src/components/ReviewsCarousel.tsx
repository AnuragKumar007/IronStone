"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function ReviewsCarousel() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const reviews = [
        {
            name: "Emily Doe",
            color: "bg-zinc-900 border border-zinc-800",
            img: "https://media.istockphoto.com/id/1218975799/photo/bad-skin-days-are-a-thing-of-the-past.jpg?s=2048x2048&w=is&k=20&c=DQNo0EdTL3OViL9pWxWq_ik7PhHnXb1WU3Pr_kYBwUc=",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante. Lorem ipsum dolor sit amet."
        },
        {
            name: "Jane Smith",
            color: "bg-zinc-800 border border-zinc-700",
            img: "https://media.istockphoto.com/id/1329665103/photo/shot-of-a-young-women-using-mobile-phone-standing-isolated-over-yellow-background.jpg?s=2048x2048&w=is&k=20&c=Xl00zMUp1UH0aCACdgxVkBO54KULAqSK1QnHUV9kSWc=",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante. Lorem ipsum dolor sit amet."
        },
        {
            name: "Alice Johnson",
            color: "bg-black border border-zinc-900",
            img: "https://media.istockphoto.com/id/1399193450/photo/portrait-of-attractive-cheerful-groomed-wavy-haired-girl-demonstrating-contour-skin-uplift.jpg?s=2048x2048&w=is&k=20&c=Md_7LemOoNkc_0qMBI2oagulm90ucyN1ncMElxIB4Pc=",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante. Lorem ipsum dolor sit amet."
        }
    ];

    useEffect(() => {
        if (cardsRef.current.length === 0) return;

        cardsRef.current.forEach((card, i) => {
            let offset = i - currentIndex;
            if (offset < 0) offset += reviews.length; // wrap around

            let x = 0;
            let scale = 1;
            let zIndex = 3 - offset;
            let opacity = 1;

            if (offset === 0) {
                x = 0;
                scale = 1;
                opacity = 1;
            } else if (offset === 1) {
                x = 50;
                scale = 0.9;
                opacity = 0.7;
            } else if (offset === 2) {
                x = -50;
                scale = 0.9;
                opacity = 0.7;
            }

            gsap.to(card, {
                x: x,
                scale: scale,
                zIndex: zIndex,
                opacity: opacity,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    }, [currentIndex, reviews.length]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    return (
        <div className="reviews-section py-16 bg-black z-10 relative">
            <div className="text-center mb-12">
                <h4 className="text-lg text-gray-300">Ratings & Reviews</h4>
                <h2 className="text-4xl md:text-6xl font-bold text-white">What people are saying</h2>
            </div>

            <div className="flex justify-center items-center space-x-10 relative" ref={containerRef}>
                <div
                    onClick={handlePrev}
                    className="cursor-pointer absolute left-4 md:left-[14.5rem] z-10 border-2 border-white hover:bg-white/20 transition-all rounded-full px-4 py-3"
                >
                    <i className="ri-arrow-left-s-line text-2xl text-white"></i>
                </div>

                <div className="relative w-full md:w-[80%] h-[400px] overflow-hidden perspective-1000">
                    <div className="absolute inset-0 flex items-center justify-center">
                        {reviews.map((review, i) => (
                            <div
                                key={i}
                                ref={(el) => {
                                    if (el) cardsRef.current[i] = el;
                                }}
                                className={`review-card ${review.color} w-[20rem] md:w-[24rem] h-[17rem] p-6 rounded-lg shadow-lg absolute origin-center`}
                            >
                                <div className="flex items-center mb-4">
                                    <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
                                    <div>
                                        <h4 className="text-lg text-white font-bold">{review.name}</h4>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="flex items-center mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <i key={star} className={`ri-star-fill text-2xl ${i === 1 ? 'text-red-500' : 'text-yellow-500'}`}></i>
                                        ))}
                                    </div>
                                    <p className="text-white text-sm">{review.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    onClick={handleNext}
                    className="absolute right-4 md:right-[14.5rem] z-10 cursor-pointer border-2 border-white hover:bg-white/20 transition-all rounded-full px-4 py-3"
                >
                    <i className="ri-arrow-right-s-line text-2xl text-white"></i>
                </div>
            </div>
        </div>
    );
}
