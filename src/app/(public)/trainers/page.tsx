"use client";
// ============================================
// Trainers Page — Our Personal Trainers
// ============================================
import { useState, useEffect } from "react";
import PageHero from "@/components/PageHero";
import TrainerCard from "@/components/cards/TrainerCard";
import { Button } from "@/components/ui";
import { getTrainers } from "@/lib/firestore";
import type { Trainer } from "@/types";

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrainers()
      .then(setTrainers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-zinc-900 animate-pulse rounded-3xl h-[28rem]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((trainer, i) => (
              <TrainerCard
                key={trainer.id}
                name={trainer.name}
                specialization={trainer.specialization}
                bio={trainer.bio}
                photoUrl={trainer.photoUrl}
                experience={trainer.experience}
                index={i}
              />
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col items-center bg-surface-100 border border-zinc-800 rounded-3xl p-10 md:p-14 max-w-2xl">
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
            <Button variant="primary" size="lg">
              Book Free Session
              <i className="ri-arrow-right-line ml-2"></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
