"use client";
// ============================================
// Equipment Page — Our World-Class Equipment
// ============================================
import { useState, useEffect } from "react";
import PageHero from "@/components/PageHero";
import EquipmentCard from "@/components/cards/EquipmentCard";
import { Button } from "@/components/ui";
import { getEquipment } from "@/lib/firestore";
import type { Equipment } from "@/types";

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    getEquipment()
      .then(setEquipment)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(equipment.map((e) => e.category))];

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
            <Button
              key={cat}
              variant={activeCategory === cat ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Equipment Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-zinc-900 animate-pulse rounded-2xl h-80"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item, i) => (
              <EquipmentCard
                key={item.id}
                name={item.name}
                description={item.description}
                imageUrl={item.imageUrl}
                category={item.category}
                index={i}
              />
            ))}
          </div>
        )}

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
              className="bg-surface-100 border border-zinc-800/50 rounded-2xl p-6 text-center
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
