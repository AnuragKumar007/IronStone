"use client";
import { useRef, useState } from "react";

// Structure mirrors Google Places API review object for future integration
interface Review {
    author_name: string;
    profile_photo_url: string;
    rating: number;
    relative_time_description: string;
    text: string;
}

// Mock reviews — replace with real Google Reviews API data later
const mockReviews: Review[] = [
    {
        author_name: "Rahul Sharma",
        profile_photo_url: "",
        rating: 5,
        relative_time_description: "2 weeks ago",
        text: "Best gym in the city! The trainers are incredibly knowledgeable and the equipment is top-notch. Been a member for 6 months and the transformation has been amazing.",
    },
    {
        author_name: "Priya Patel",
        profile_photo_url: "",
        rating: 5,
        relative_time_description: "1 month ago",
        text: "IronStone completely changed my fitness journey. The environment is motivating, staff is supportive, and the facility is always clean. Highly recommend!",
    },
    {
        author_name: "Arjun Mehta",
        profile_photo_url: "",
        rating: 4,
        relative_time_description: "3 weeks ago",
        text: "Great equipment variety and spacious workout area. The personal training sessions are worth every penny. Only wish they had extended weekend hours.",
    },
    {
        author_name: "Sneha Reddy",
        profile_photo_url: "",
        rating: 5,
        relative_time_description: "1 week ago",
        text: "The best decision I made this year was joining IronStone. From the atmosphere to the trainers to the community — everything is perfect. 10/10!",
    },
    {
        author_name: "Vikram Singh",
        profile_photo_url: "",
        rating: 5,
        relative_time_description: "2 months ago",
        text: "Fantastic gym with world-class facilities. The trainers push you hard but in the right way. I've seen incredible results in just 3 months.",
    },
    {
        author_name: "Ananya Kapoor",
        profile_photo_url: "",
        rating: 4,
        relative_time_description: "3 weeks ago",
        text: "Love the vibe here! Clean, well-maintained, and the strength training section is massive. The community events are a great touch too.",
    },
];

function getInitials(name: string) {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase();
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <i
                    key={star}
                    className={`ri-star-fill text-sm ${
                        star <= rating ? "text-yellow-500" : "text-zinc-700"
                    }`}
                />
            ))}
        </div>
    );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
    return (
        <div className="review-card-item group bg-surface-100 border border-zinc-800 rounded-3xl p-6 flex flex-col gap-4 hover:border-zinc-700 transition-all duration-300">
            {/* Header: Avatar + Name + Google icon */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {review.profile_photo_url ? (
                        <img
                            src={review.profile_photo_url}
                            alt={review.author_name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold">
                            {getInitials(review.author_name)}
                        </div>
                    )}
                    <div>
                        <h4 className="text-white text-sm font-bold">
                            {review.author_name}
                        </h4>
                        <p className="text-gray-500 text-xs">
                            {review.relative_time_description}
                        </p>
                    </div>
                </div>
                <i className="ri-google-fill text-lg text-gray-500" />
            </div>

            {/* Rating */}
            <StarRating rating={review.rating} />

            {/* Review text */}
            <p className="text-gray-300 text-sm leading-relaxed flex-1">
                {review.text}
            </p>
        </div>
    );
}

export default function ReviewsCarousel() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [showAll, setShowAll] = useState(false);

    const displayedReviews = showAll ? mockReviews : mockReviews.slice(0, 3);

    const averageRating = (
        mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length
    ).toFixed(1);

    return (
        <section
            ref={sectionRef}
            className="py-16 md:py-24 bg-black relative z-10"
        >
            <div className="container mx-auto px-6 md:px-12 lg:px-20">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    <p className="text-red-500 text-xs font-semibold uppercase tracking-widest mb-3">
                        Testimonials
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
                        What Our Members Say
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Real experiences from our community
                    </p>

                    {/* Google Rating Summary */}
                    <div className="flex items-center justify-center gap-3 mt-6">
                        <i className="ri-google-fill text-2xl text-white" />
                        <span className="text-white text-2xl font-black">{averageRating}</span>
                        <StarRating rating={Math.round(Number(averageRating))} />
                        <span className="text-gray-500 text-sm">
                            ({mockReviews.length} reviews)
                        </span>
                    </div>
                </div>

                {/* Review Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {displayedReviews.map((review, i) => (
                        <ReviewCard key={i} review={review} index={i} />
                    ))}
                </div>

                {/* See More / See Less */}
                {mockReviews.length > 3 && (
                    <div className="flex justify-center mt-10">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="px-6 py-2.5 border border-zinc-700 text-white text-sm font-bold uppercase tracking-wider rounded-full hover:border-red-500 hover:text-red-500 transition-all duration-300"
                        >
                            {showAll ? "Show Less" : "See More Reviews"}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
