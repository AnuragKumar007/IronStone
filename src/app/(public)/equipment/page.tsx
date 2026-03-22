"use client";
// ============================================
// Equipment Page — Our World-Class Equipment
// ============================================
import { useState } from "react";
import PageHero from "@/components/PageHero";
import EquipmentCard from "@/components/cards/EquipmentCard";

const categories = ["All", "Strength", "Cardio", "Functional", "Recovery"];

const equipment = [
  {
    name: "Olympic Barbell Set",
    description: "Competition-grade 20kg Olympic barbell with calibrated Eleiko plates. Perfect for deadlifts, squats, and bench press at any level.",
    image: "/equipment/equipment-1.png",
    category: "Strength",
  },
  {
    name: "Adjustable Dumbbells",
    description: "Premium rubber-coated hex dumbbells ranging from 2.5kg to 50kg. Ergonomic knurled grip for comfortable, sweat-proof training sessions.",
    image: "/equipment/equipment-1.png",
    category: "Strength",
  },
  {
    name: "Cable Crossover Machine",
    description: "Dual-stack cable machine with 200lbs per side. Infinite angle adjustments for flyes, tricep pushdowns, face pulls, and more.",
    image: "/equipment/equipment-1.png",
    category: "Strength",
  },
  {
    name: "Assault Air Bike",
    description: "Fan-resistance air bike with unlimited resistance scaling. Built for brutal HIIT intervals, warm-ups, and metabolic conditioning.",
    image: "/equipment/equipment-1.png",
    category: "Cardio",
  },
  {
    name: "Concept2 Rowing Machine",
    description: "The gold standard in indoor rowing. PM5 monitor for accurate pacing, damper control, and Bluetooth connectivity for tracking.",
    image: "/equipment/equipment-1.png",
    category: "Cardio",
  },
  {
    name: "Commercial Treadmill",
    description: "Life Fitness commercial treadmill with 15% incline, cushioned deck, and top speed of 22 km/h. Integrated heart rate monitoring.",
    image: "/equipment/equipment-1.png",
    category: "Cardio",
  },
  {
    name: "Battle Ropes",
    description: "50ft heavy-duty polyester battle ropes with anchor. Build grip strength, shoulder endurance, and explosive full-body power.",
    image: "/equipment/equipment-1.png",
    category: "Functional",
  },
  {
    name: "TRX Suspension Trainer",
    description: "Military-grade suspension system for bodyweight training. 300+ exercises targeting every muscle group using your own body.",
    image: "/equipment/equipment-1.png",
    category: "Functional",
  },
  {
    name: "Theragun Pro",
    description: "Professional-grade percussive therapy device with 5 speed settings. Accelerate recovery, reduce soreness, and improve circulation.",
    image: "/equipment/equipment-1.png",
    category: "Recovery",
  },
  {
    name: "Foam Rollers & Lacrosse Balls",
    description: "High-density foam rollers and trigger-point lacrosse balls for myofascial release. Essential for pre and post-workout mobility.",
    image: "/equipment/equipment-1.png",
    category: "Recovery",
  },
  {
    name: "Leg Press Machine",
    description: "Plate-loaded 45-degree leg press with 1000lb capacity. Wide foot platform for quad, glute, and hamstring isolation work.",
    image: "/equipment/equipment-1.png",
    category: "Strength",
  },
  {
    name: "Kettlebell Collection",
    description: "Competition kettlebells from 8kg to 48kg in uniform sizing. Powder-coated for chalk grip. Essential for swings, cleans, and snatches.",
    image: "/equipment/equipment-1.png",
    category: "Functional",
  },
];

export default function EquipmentPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? equipment
      : equipment.filter((e) => e.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 md:px-16 py-16">
        <PageHero
          badge="Equipment"
          badgeIcon="ri-boxing-fill"
          title="World-Class Equipment"
          highlight="Equipment"
          description="From Olympic barbells to the latest cardio tech — our facility is stocked with premium gear to fuel every workout."
        />

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider
                         border transition-all duration-300
                         ${
                           activeCategory === cat
                             ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/20"
                             : "bg-transparent border-zinc-700 text-gray-400 hover:border-zinc-500 hover:text-white"
                         }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item, i) => (
            <EquipmentCard key={item.name} {...item} index={i} />
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "150+", label: "Machines", icon: "ri-settings-3-line" },
            { value: "500+", label: "Free Weights", icon: "ri-scales-3-line" },
            { value: "10,000", label: "Sq. Ft.", icon: "ri-building-2-line" },
            { value: "24/7", label: "Access", icon: "ri-time-line" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#0d0d0d] border border-zinc-800/50 rounded-2xl p-6 text-center
                         hover:border-zinc-600 transition-all duration-300"
            >
              <i className={`${stat.icon} text-red-500 text-2xl mb-3 block`}></i>
              <p className="text-3xl font-black text-white">{stat.value}</p>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
