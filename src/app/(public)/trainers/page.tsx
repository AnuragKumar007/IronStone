"use client";
// ============================================
// Trainers Page — Our Personal Trainers
// ============================================
import PageHero from "@/components/PageHero";
import TrainerCard from "@/components/cards/TrainerCard";

const trainers = [
  {
    name: "Arjun Mehta",
    specialization: "Strength Training",
    bio: "NSCA-certified strength coach with 8+ years of experience. Specializes in powerlifting, Olympic lifts, and building raw functional strength for athletes and beginners alike.",
    image: "/trainers/trainer-1.png",
    experience: "8+ Years",
  },
  {
    name: "Priya Sharma",
    specialization: "Yoga & Flexibility",
    bio: "Internationally certified yoga instructor combining traditional Hatha and power Vinyasa flows. Focuses on mobility, injury rehab, and mindfulness for peak performance.",
    image: "/trainers/trainer-2.png",
    experience: "6+ Years",
  },
  {
    name: "Vikram Singh",
    specialization: "HIIT & CrossFit",
    bio: "Former national-level athlete turned CrossFit coach. Designs high-intensity metabolic conditioning programs that torch fat and build explosive endurance.",
    image: "/trainers/trainer-1.png",
    experience: "10+ Years",
  },
  {
    name: "Sneha Patel",
    specialization: "Nutrition & Weight Loss",
    bio: "Certified sports nutritionist and weight management specialist. Creates personalized diet plans backed by macro tracking and lifestyle optimization.",
    image: "/trainers/trainer-2.png",
    experience: "5+ Years",
  },
  {
    name: "Rahul Kapoor",
    specialization: "Boxing & MMA",
    bio: "Professional MMA fighter and boxing coach. Teaches striking technique, footwork, and combat conditioning for self-defense and competition prep.",
    image: "/trainers/trainer-1.png",
    experience: "7+ Years",
  },
  {
    name: "Ananya Desai",
    specialization: "Calisthenics",
    bio: "Bodyweight training specialist who helps clients master pull-ups, muscle-ups, handstands, and advanced calisthenics progressions from scratch.",
    image: "/trainers/trainer-2.png",
    experience: "4+ Years",
  },
];

export default function TrainersPage() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 md:px-16 py-16">
        <PageHero
          badge="Our Team"
          badgeIcon="ri-team-fill"
          title="Meet Our Trainers"
          highlight="Trainers"
          description="Our certified personal trainers bring world-class expertise, passion, and dedication to help you achieve your fitness goals."
        />

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers.map((trainer, i) => (
            <TrainerCard key={trainer.name} {...trainer} index={i} />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col items-center bg-[#0d0d0d] border border-zinc-800 rounded-3xl p-10 md:p-14 max-w-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800
                            flex items-center justify-center mb-6">
              <i className="ri-calendar-schedule-line text-white text-2xl"></i>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Want a Free Trial Session?
            </h3>
            <p className="text-gray-400 mb-6 max-w-lg">
              Book a complimentary session with any of our trainers and experience
              the IronStone difference firsthand.
            </p>
            <button className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-800 text-white
                               font-bold rounded-xl text-sm uppercase tracking-wider
                               hover:shadow-lg hover:shadow-red-900/30 transition-all duration-300
                               hover:-translate-y-1">
              Book Free Session
              <i className="ri-arrow-right-line ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
