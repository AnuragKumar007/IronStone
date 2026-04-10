"use client";
// ============================================
// Profile Page — User Membership & Account Details
// ============================================
import { Suspense, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { useAuth } from "@/hooks/useAuth";
import { Button, Badge, Card } from "@/components/ui";

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <i className="ri-loader-4-line text-4xl text-red-500 animate-spin"></i>
            <p className="text-gray-500 mt-4">Loading...</p>
          </div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const { user, userData, loading } = useAuth();
  const searchParams = useSearchParams();
  const paymentSuccess = searchParams.get("payment") === "success";

  const headerRef = useRef<HTMLDivElement>(null);
  const membershipRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    gsap.set(
      [headerRef.current, membershipRef.current, detailsRef.current].filter(Boolean),
      { opacity: 0, y: 40 }
    );
    if (successRef.current) {
      gsap.set(successRef.current, { opacity: 0, scale: 0.9 });
      tl.to(successRef.current, { opacity: 1, scale: 1, duration: 0.5, delay: 0.2 });
    }
    tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.6, delay: paymentSuccess ? 0 : 0.3 })
      .to(membershipRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
      .to(detailsRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");
  }, [loading, paymentSuccess]);

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

  // Calculate progress percentage
  const totalDays =
    userData?.membershipStart && userData?.membershipExpiry
      ? Math.ceil(
          (new Date(userData.membershipExpiry).getTime() -
            new Date(userData.membershipStart).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;
  const progressPercent =
    totalDays > 0 ? Math.max(0, Math.min(100, ((totalDays - daysRemaining) / totalDays) * 100)) : 0;

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

  // If not logged in, show prompt to login
  if (!user) {
    return (
      <div className="container mx-auto px-6 md:px-16 py-20">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6">
            <i className="ri-user-line text-3xl text-gray-600"></i>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Sign in to view your profile</h1>
          <p className="text-gray-500 mb-8">
            Log in to access your membership details, track your progress, and manage your account.
          </p>
          <Link href="/login">
            <Button variant="primary" size="lg">
              <i className="ri-login-box-line"></i>
              Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-16 pb-20">
      {/* Payment Success Banner */}
      {paymentSuccess && (
        <div ref={successRef} className="mb-8 mt-4">
          <div className="bg-green-900/30 border border-green-700 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-800/50 flex items-center justify-center shrink-0">
              <i className="ri-check-double-line text-green-400 text-xl"></i>
            </div>
            <div>
              <h3 className="text-green-400 font-bold">Payment Successful!</h3>
              <p className="text-green-500/70 text-sm">
                Your membership has been activated. Welcome to IronStone!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div ref={headerRef} className="mb-10 pt-4">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shrink-0">
            <span className="text-white text-2xl md:text-3xl font-black">
              {userData?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
              {userData?.name || "User"}
            </h1>
            <p className="text-gray-500 mt-1">
              <i className="ri-mail-line mr-1.5"></i>
              {userData?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Membership Card */}
      <div ref={membershipRef} className="mb-10">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
          Membership
        </h2>
        <Card variant="default" padding="lg" className="relative overflow-hidden">
          {/* Background glow */}
          <div
            className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
            style={{
              background: userData?.membershipPlan
                ? "radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(100,100,100,0.05) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10">
            {userData?.membershipPlan ? (
              <>
                {/* Active Plan */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="success" size="md">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1.5"></span>
                        Active
                      </Badge>
                      <span className="text-white font-bold text-xl capitalize">
                        {userData.membershipPlan} Plan
                      </span>
                    </div>
                    {userData.razorpayPaymentId && (
                      <p className="text-gray-600 text-xs">
                        Payment ID: {userData.razorpayPaymentId}
                      </p>
                    )}
                  </div>
                  <Link href="/pricing">
                    <Button variant="outline">
                      Renew / Upgrade
                    </Button>
                  </Link>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">
                      {daysRemaining > 0
                        ? `${daysRemaining} days remaining`
                        : "Membership expired"}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {Math.round(progressPercent)}% used
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        daysRemaining <= 7
                          ? "bg-gradient-to-r from-red-600 to-red-500"
                          : "bg-gradient-to-r from-green-600 to-green-500"
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900/50 rounded-xl p-4">
                    <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">Started</p>
                    <p className="text-white font-semibold">
                      {userData.membershipStart
                        ? new Date(userData.membershipStart).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                  <div className="bg-zinc-900/50 rounded-xl p-4">
                    <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">Expires</p>
                    <p className="text-white font-semibold">
                      {userData.membershipExpiry
                        ? new Date(userData.membershipExpiry).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Low days warning */}
                {daysRemaining > 0 && daysRemaining <= 7 && (
                  <div className="mt-6 bg-red-900/20 border border-red-800 rounded-xl p-4 flex items-center gap-3">
                    <i className="ri-alarm-warning-line text-red-500 text-xl"></i>
                    <div>
                      <p className="text-red-400 font-semibold text-sm">Expiring Soon!</p>
                      <p className="text-red-500/60 text-xs">
                        Renew now to avoid any interruption in your training.
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* No Plan */
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                  <i className="ri-price-tag-3-line text-gray-600 text-2xl"></i>
                </div>
                <h3 className="text-white text-xl font-bold mb-2">No Active Membership</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Choose a plan to unlock full gym access, personal training sessions, and more.
                </p>
                <Link href="/pricing">
                  <Button variant="primary" size="lg">
                    View Plans
                    <i className="ri-arrow-right-line ml-1"></i>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Account Details */}
      <div ref={detailsRef}>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
          Account Details
        </h2>
        <Card variant="default" padding="sm" className="overflow-hidden !p-0">
          {[
            { icon: "ri-user-line", label: "Name", value: userData?.name },
            { icon: "ri-mail-line", label: "Email", value: userData?.email },
            { icon: "ri-phone-line", label: "Phone", value: userData?.phone || "Not provided" },
            {
              icon: "ri-calendar-line",
              label: "Member Since",
              value: userData?.createdAt
                ? new Date(userData.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—",
            },
          ].map((item, i, arr) => (
            <div
              key={item.label}
              className={`flex items-center gap-4 px-8 py-5 ${
                i < arr.length - 1 ? "border-b border-zinc-800/50" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0">
                <i className={`${item.icon} text-gray-500`}></i>
              </div>
              <div>
                <p className="text-gray-600 text-xs uppercase tracking-wider">{item.label}</p>
                <p className="text-white font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
