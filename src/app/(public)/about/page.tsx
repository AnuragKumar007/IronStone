"use client";
// ============================================
// About Page — Our Story & Mission
// ============================================
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui";

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    icon: "ri-fire-fill",
    title: "Relentless Discipline",
    description: "We believe consistency beats motivation. Our programs are designed to build iron-clad habits that last a lifetime.",
  },
  {
    icon: "ri-heart-pulse-fill",
    title: "Science-Backed Training",
    description: "Every workout, nutrition plan, and recovery protocol is grounded in sports science and evidence-based research.",
  },
  {
    icon: "ri-group-fill",
    title: "Community First",
    description: "IronStone is more than a gym — it's a brotherhood. We push each other, celebrate wins, and never let anyone give up.",
  },
  {
    icon: "ri-shield-check-fill",
    title: "World-Class Facility",
    description: "From Eleiko plates to Rogue rigs, we invest in the best equipment so you can train like an elite athlete.",
  },
];

const timeline = [
  { year: "2018", event: "Founded in a 500 sq. ft. garage with 3 members and a dream." },
  { year: "2020", event: "Expanded to 5,000 sq. ft. facility with full equipment lineup." },
  { year: "2022", event: "Launched personal training programs and group classes." },
  { year: "2024", event: "Grew to 10,000 sq. ft. with 500+ active members and a full trainer team." },
  { year: "2025", event: "Launched IronStone digital platform with online coaching and membership management." },
];

export default function AboutPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stats counter animation
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.querySelectorAll(".stat-item"),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Values cards
      if (valuesRef.current) {
        gsap.fromTo(
          valuesRef.current.querySelectorAll(".value-card"),
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: valuesRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Timeline items
      if (timelineRef.current) {
        gsap.fromTo(
          timelineRef.current.querySelectorAll(".timeline-item"),
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 80%",
            },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 md:px-16 py-16">
        <PageHero
          badge="About Us"
          badgeIcon="ri-information-fill"
          title="Forged in Iron"
          highlight="Iron"
          description="IronStone was born from a simple belief: that every person deserves access to world-class training, equipment, and community."
        />

        {/* Brand Story */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="relative bg-[#0d0d0d] border border-zinc-800/50 rounded-3xl p-8 md:p-12">
            {/* Red accent line */}
            <div className="absolute left-0 top-8 bottom-8 w-1 bg-gradient-to-b from-red-600 to-red-900 rounded-full" />
            <div className="pl-6 md:pl-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-400 leading-relaxed text-lg">
                <p>
                  We started in 2018 — a cramped garage gym with rusty plates and a fire that
                  couldn&apos;t be contained. What began as a passion project between friends quickly
                  became a movement.
                </p>
                <p>
                  Today, IronStone is a <span className="text-white font-semibold">10,000 sq. ft.
                  premium training facility</span> serving 500+ members with a roster of
                  certified personal trainers, group classes, and state-of-the-art equipment.
                </p>
                <p>
                  We don&apos;t do shortcuts. We don&apos;t do gimmicks. We do <span className="text-red-500 font-bold">iron discipline</span>,
                  backed by science, fueled by community.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { value: "500+", label: "Active Members" },
            { value: "10,000", label: "Sq. Ft. Facility" },
            { value: "12+", label: "Certified Trainers" },
            { value: "6+", label: "Years Strong" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="stat-item text-center py-8 bg-[#0d0d0d] border border-zinc-800/50
                         rounded-2xl hover:border-zinc-600 transition-all duration-300"
            >
              <p className="text-4xl md:text-5xl font-black text-white mb-1">{stat.value}</p>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              What We <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">Stand For</span>
            </h2>
          </div>
          <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((val) => (
              <div
                key={val.title}
                className="value-card group bg-[#0d0d0d] border border-zinc-800/50 rounded-2xl p-8
                           hover:border-zinc-600 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-800
                                flex items-center justify-center mb-5
                                group-hover:scale-110 transition-transform duration-300">
                  <i className={`${val.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{val.title}</h3>
                <p className="text-gray-400 leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Our <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">Journey</span>
            </h2>
          </div>
          <div ref={timelineRef} className="max-w-3xl mx-auto relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-red-600 via-red-800 to-zinc-800" />

            <div className="space-y-8">
              {timeline.map((item) => (
                <div key={item.year} className="timeline-item flex items-start gap-6 relative">
                  {/* Dot */}
                  <div className="relative z-10 w-10 h-10 rounded-full bg-[#0d0d0d] border-2 border-red-600
                                  flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                  </div>
                  {/* Content */}
                  <div className="bg-[#0d0d0d] border border-zinc-800/50 rounded-2xl p-6 flex-1
                                  hover:border-zinc-600 transition-all duration-300">
                    <span className="text-red-500 font-black text-lg">{item.year}</span>
                    <p className="text-gray-300 mt-1">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center bg-surface-100 border border-zinc-800 rounded-3xl p-10 md:p-14 max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to Write Your Chapter?
            </h3>
            <p className="text-gray-400 mb-6 max-w-lg">
              Join the IronStone family and start your transformation today.
            </p>
            <Link href="/signup">
              <Button variant="primary" size="lg">
                Join IronStone
                <i className="ri-arrow-right-line ml-2"></i>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
