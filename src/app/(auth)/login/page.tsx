"use client";
// ============================================
// Login Page — with animated MuscleMan
// ============================================
import { useState, useMemo, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import MuscleMan from "@/components/auth/MuscleMan2";
import { signInWithEmail, signInWithGoogle, resetPassword } from "@/lib/auth";
import { Input, Button } from "@/components/ui";

// Wrapper with Suspense for useSearchParams
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/home";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // GSAP refs
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);

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

  // Muscle progress: 2 fields, each = 50%
  const progress = useMemo(() => {
    let filled = 0;
    if (form.email.includes("@")) filled++;
    if (form.password.length >= 4) filled++;
    return filled / 2;
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setResetSent(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmail(form.email, form.password);
      router.replace(redirectTo);
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      if (
        firebaseError.code === "auth/wrong-password" ||
        firebaseError.code === "auth/user-not-found" ||
        firebaseError.code === "auth/invalid-credential"
      ) {
        setError("Invalid email or password. Please try again.");
      } else if (firebaseError.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError(firebaseError.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace(redirectTo);
    } catch (err: unknown) {
      const firebaseError = err as { message?: string };
      setError(firebaseError.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) {
      setError("Please enter your email address first.");
      return;
    }
    try {
      await resetPassword(form.email);
      setResetSent(true);
      setError("");
    } catch {
      setError("Could not send reset email. Check your email address.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 py-8 lg:py-0">
      {/* Left — Character Section */}
      <div
        ref={characterRef}
        className="w-full lg:w-1/2 flex flex-col items-center justify-center lg:min-h-screen relative"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, rgba(220, 38, 38, ${0.05 + progress * 0.12}) 0%, transparent 70%)`,
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
            ? "Enter your credentials to power up!"
            : progress < 1
            ? "One more to go..."
            : "Let's roll! 💪"}
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

          {/* Error / Success messages */}
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-800 rounded-xl text-red-400 text-sm">
              <i className="ri-error-warning-line mr-2"></i>
              {error}
            </div>
          )}
          {resetSent && (
            <div className="p-3 bg-green-900/30 border border-green-800 rounded-xl text-green-400 text-sm">
              <i className="ri-check-line mr-2"></i>
              Password reset email sent! Check your inbox.
            </div>
          )}

          {/* Email */}
          <Input
            label="Email"
            icon="ri-mail-line"
            id="login-email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <div className="relative">
            <Input
              label="Password"
              icon="ri-lock-line"
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="!pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 bottom-3 text-gray-500 hover:text-white transition-colors"
              aria-label="Toggle password visibility"
            >
              <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"} />
            </button>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-gray-500 text-sm hover:text-red-500 transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          >
            {progress >= 1 ? "Let's Roll! 💪" : "Login"}
          </Button>

          {/* Divider */}
          <div className="auth-divider">
            <span className="text-gray-500 text-sm whitespace-nowrap">Or login with</span>
          </div>

          {/* Google SSO */}
          <button
            id="login-google"
            type="button"
            onClick={handleGoogleLogin}
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

          {/* Signup Link */}
          <p className="text-center text-gray-500 text-sm pt-2">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-red-500 font-bold hover:text-red-400 transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
