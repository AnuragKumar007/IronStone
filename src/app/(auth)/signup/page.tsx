"use client";
// ============================================
// Signup Page — with animated MuscleMan
// ============================================
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import MuscleMan from "@/components/auth/MuscleMan2";
import { signUpWithEmail, signInWithGoogle } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Refs for GSAP entrance animations
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    gsap.set([headingRef.current, formRef.current, characterRef.current], {
      opacity: 0,
      y: 30,
    });
    tl.to(characterRef.current, { opacity: 1, y: 0, duration: 0.8, delay: 0.2 })
      .to(headingRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
      .to(formRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.3");
  }, []);

  // Calculate muscle progress (0–1) based on filled fields
  const progress = useMemo(() => {
    let filled = 0;
    if (form.username.length >= 2) filled++;
    if (form.email.includes("@")) filled++;
    if (form.phone.length >= 6) filled++;
    if (form.password.length >= 4) filled++;
    return filled / 4;
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUpWithEmail(form.email, form.password, form.username, form.phone);
      router.push("/home");
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === "auth/email-already-in-use") {
        setError("This email is already registered. Try logging in instead.");
      } else if (firebaseError.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (firebaseError.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(firebaseError.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push("/home");
    } catch (err: unknown) {
      const firebaseError = err as { message?: string };
      setError(firebaseError.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 py-8 lg:py-0">
      {/* Left — Character Section */}
      <div
        ref={characterRef}
        className="w-full lg:w-1/2 flex flex-col items-center justify-center lg:min-h-screen relative"
      >
        {/* Subtle radial glow behind character */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, rgba(220, 38, 38, ${0.05 + progress * 0.1}) 0%, transparent 70%)`,
          }}
        />

        <h1
          ref={headingRef}
          className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-2 z-10"
        >
          Ready to{" "}
          <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            lift
          </span>
          ?
        </h1>
        <p className="text-gray-500 text-sm mb-4 z-10">
          {progress < 0.5
            ? "Fill in your details to power up!"
            : progress < 1
            ? "Almost there... keep going!"
            : "You're all set! LET'S GO! 💪"}
        </p>

        <MuscleMan progress={progress} />
      </div>

      {/* Right — Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-5"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="IronStone" className="h-8 w-auto" />
            <span className="text-xl font-bold text-white uppercase tracking-tight">
              Iron
              <span className="bg-gradient-to-b from-[#ff3333] via-[#cc0000] to-[#660000] text-transparent bg-clip-text">
                Stone
              </span>
            </span>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-800 rounded-xl text-red-400 text-sm">
              <i className="ri-error-warning-line mr-2"></i>
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
              Username
            </label>
            <div className="relative">
              <i className="ri-user-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
              <input
                id="signup-username"
                type="text"
                name="username"
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
                className="auth-input pl-11"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
              Email
            </label>
            <div className="relative">
              <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
              <input
                id="signup-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="auth-input pl-11"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
              Phone Number
            </label>
            <div className="relative">
              <i className="ri-phone-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
              <input
                id="signup-phone"
                type="tel"
                name="phone"
                placeholder="+91 XXXXX XXXXX"
                value={form.phone}
                onChange={handleChange}
                className="auth-input pl-11"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
              Password
            </label>
            <div className="relative">
              <i className="ri-lock-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                className="auth-input pl-11 pr-12"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                aria-label="Toggle password visibility"
              >
                <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"} />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="signup-submit"
            type="submit"
            disabled={loading}
            className="auth-btn-primary"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="ri-loader-4-line animate-spin"></i>
                Creating account...
              </span>
            ) : progress >= 1 ? (
              "Let's Roll! 💪"
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Divider */}
          <div className="auth-divider">
            <span className="text-gray-500 text-sm whitespace-nowrap">Or sign up with</span>
          </div>

          {/* Google SSO */}
          <button
            id="signup-google"
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="auth-btn-google"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Login Link */}
          <p className="text-center text-gray-500 text-sm pt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-red-500 font-bold hover:text-red-400 transition-colors"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
