"use client";
// ============================================
// App Homepage — Post-Login Dashboard
// ============================================
import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useAuth } from "@/hooks/useAuth";
import { Button, Badge } from "@/components/ui";

const quickLinks = [
  {
    title: "Pricing Plans",
    description: "Choose your membership",
    icon: "ri-price-tag-3-line",
    href: "/pricing",
    color: "from-red-600 to-red-800",
  },
  {
    title: "Our Trainers",
    description: "Meet your coaches",
    icon: "ri-team-line",
    href: "/trainers",
    color: "from-orange-600 to-red-700",
  },
  {
    title: "Equipment",
    description: "World-class gear",
    icon: "ri-boxing-line",
    href: "/equipment",
    color: "from-yellow-600 to-orange-700",
  },
  {
    title: "Gallery",
    description: "See our facility",
    icon: "ri-image-line",
    href: "/gallery",
    color: "from-pink-600 to-red-700",
  },
  {
    title: "My Profile",
    description: "Manage your account",
    icon: "ri-user-settings-line",
    href: "/profile",
    color: "from-purple-600 to-pink-700",
  },
  {
    title: "About Us",
    description: "Our story & mission",
    icon: "ri-information-line",
    href: "/about",
    color: "from-blue-600 to-purple-700",
  },
];

export default function HomePage() {
  const { userData, loading, isAdmin } = useAuth();
  const greetRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const membershipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    gsap.set([greetRef.current, membershipRef.current, cardsRef.current], {
      opacity: 0,
      y: 40,
    });
    tl.to(greetRef.current, { opacity: 1, y: 0, duration: 0.7, delay: 0.3 })
      .to(membershipRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
      .to(cardsRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.3");
  }, [loading]);

  // Calculate days remaining
  const daysRemaining = userData?.membershipExpiry
    ? Math.max(
        0,
        Math.ceil(
          (new Date(userData.membershipExpiry).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-red-500 animate-spin"></i>
          <p className="text-gray-500 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-16 pb-20">
      {/* Greeting Section */}
      <div ref={greetRef} className="mb-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                {userData?.name || "Champion"}
              </span>
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Ready to crush your goals today? 💪
            </p>
          </div>
          {isAdmin && (
            <Link href="/admin">
              <Button variant="primary">
                <i className="ri-admin-line mr-1"></i>
                Admin Panel
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Membership Status Card */}
      <div ref={membershipRef} className="mb-12">
        <div className="relative overflow-hidden rounded-3xl bg-surface-200 border border-gray-800 p-8 md:p-10">
          {/* Background glow */}
          <div
            className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">
                Membership Status
              </h2>
              {userData?.membershipPlan ? (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="success" size="md">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1.5"></span>
                      Active
                    </Badge>
                    <span className="text-white font-bold text-lg capitalize">
                      {userData.membershipPlan} Plan
                    </span>
                  </div>
                  <p className="text-gray-400">
                    <i className="ri-calendar-line mr-1"></i>
                    {daysRemaining > 0
                      ? `${daysRemaining} days remaining`
                      : "Your membership has expired"}
                    {userData.membershipExpiry && (
                      <span className="text-gray-600 ml-2">
                        · Expires{" "}
                        {new Date(userData.membershipExpiry).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-white text-xl font-bold mb-1">
                    No Active Membership
                  </h3>
                  <p className="text-gray-400">
                    Get started with a plan and begin your transformation!
                  </p>
                </>
              )}
            </div>
            <Link href="/pricing">
              <Button variant="primary">
                {userData?.membershipPlan ? "Renew Plan" : "Get Started"}
                <i className="ri-arrow-right-line ml-1"></i>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div ref={cardsRef}>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative overflow-hidden rounded-2xl bg-surface-300 border border-gray-800
                         p-6 hover:border-gray-600 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl
                            bg-gradient-to-br ${link.color} mb-4 transition-transform
                            group-hover:scale-110 duration-300`}
              >
                <i className={`${link.icon} text-xl text-white`}></i>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{link.title}</h3>
              <p className="text-gray-500 text-sm">{link.description}</p>
              {/* Arrow */}
              <i className="ri-arrow-right-up-line absolute top-5 right-5 text-gray-700
                           group-hover:text-red-500 transition-colors duration-300 text-lg"></i>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
