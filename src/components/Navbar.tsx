"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Trainers", href: "/trainers" },
  { label: "Equipment", href: "/equipment" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!navRef.current) return;
    const timer = setTimeout(() => {
      gsap.to(navRef.current, {
        scaleY: 1,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="fixed top-0 left-0 w-full z-40 navbar">
      <nav
        ref={navRef}
        className="bg-black/80 backdrop-blur-md w-full px-8 md:px-16 py-5 opacity-0 scale-y-0 origin-top"
      >
        <div className="flex items-center justify-between container mx-auto">
          {/* Logo */}
          <Link href="/" className="text-white flex items-center gap-3 shrink-0">
            <img
              src="/logo-light.png"
              alt="IronStone Logo"
              className="h-10 w-auto object-contain"
            />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">
              Iron
              <span className="bg-gradient-to-b from-[#ff3333] via-[#cc0000] to-[#660000] text-transparent bg-clip-text">
                Stone
              </span>
            </h1>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-bold text-sm tracking-widest uppercase transition-colors duration-300
                  ${pathname === link.href ? "text-red-500" : "text-white hover:text-red-500"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Auth + Socials + Hamburger */}
          <div className="flex items-center gap-4">
            {/* Social icons — desktop only */}
            <div className="hidden md:flex items-center gap-3 text-white mr-2">
              <a href="#" className="hover:text-red-500 transition-colors">
                <i className="ri-facebook-fill text-lg"></i>
              </a>
              <a href="#" className="hover:text-red-500 transition-colors">
                <i className="ri-twitter-x-line text-lg"></i>
              </a>
              <a href="#" className="hover:text-red-500 transition-colors">
                <i className="ri-instagram-line text-lg"></i>
              </a>
            </div>

            {/* Auth button */}
            {!loading && (
              <>
                {user ? (
                  <Link
                    href="/home"
                    className="hidden sm:flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-600 to-red-800
                               text-white text-sm font-bold uppercase tracking-wider rounded-full
                               hover:shadow-lg hover:shadow-red-900/30 transition-all duration-300"
                  >
                    <i className="ri-dashboard-line"></i>
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="hidden sm:flex items-center gap-2 px-5 py-2 border border-zinc-700
                               text-white text-sm font-bold uppercase tracking-wider rounded-full
                               hover:border-red-500 hover:text-red-500 transition-all duration-300"
                  >
                    <i className="ri-login-box-line"></i>
                    Login
                  </Link>
                )}
              </>
            )}

            {/* Hamburger button — mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-white text-2xl hover:text-red-500 transition-colors"
              aria-label="Toggle menu"
            >
              <i className={mobileOpen ? "ri-close-line" : "ri-menu-line"} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-30 transition-all duration-500
          ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-400
            ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />
        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-[280px] bg-[#0a0a0a] border-l border-zinc-800
            transform transition-transform duration-500 ease-out
            ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="pt-24 px-8 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-3 text-sm font-bold uppercase tracking-widest transition-colors
                  ${pathname === link.href ? "text-red-500" : "text-gray-400 hover:text-white"}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-zinc-800 my-4" />
            {!loading && (
              <>
                {user ? (
                  <Link
                    href="/home"
                    className="block py-3 text-sm font-bold uppercase tracking-widest text-red-500"
                  >
                    <i className="ri-dashboard-line mr-2"></i>
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block py-3 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white"
                    >
                      <i className="ri-login-box-line mr-2"></i>
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="block py-3 text-sm font-bold uppercase tracking-widest text-red-500"
                    >
                      <i className="ri-user-add-line mr-2"></i>
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

