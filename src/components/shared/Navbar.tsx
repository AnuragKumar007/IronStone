"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { useAuth } from "@/hooks/useAuth";
import { logOut } from "@/lib/auth";

const publicLinks = [
  { label: "Trainers", href: "/trainers" },
  { label: "Equipment", href: "/equipment" },
  { label: "Gallery", href: "/gallery" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logOut();
    router.push("/");
  };

  useEffect(() => {
    if (!navRef.current) return;
    gsap.to(navRef.current, {
      scaleY: 1,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  // Hide/show navbar based on scroll direction (using Lenis)
  const onLenisScroll = useCallback(
    (e: { scroll: number; direction: number }) => {
      if (mobileOpen || !wrapperRef.current) return;
      const currentY = e.scroll;

      if (e.direction === 1 && currentY > 80) {
        // Scrolling down & past navbar height — hide
        wrapperRef.current.style.transform = "translateY(-100%)";
      } else {
        // Scrolling up or at top — show
        wrapperRef.current.style.transform = "translateY(0)";
      }
    },
    [mobileOpen]
  );

  useLenis(onLenisScroll);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
    {/* Floating hamburger — always visible on mobile regardless of navbar state */}
    <button
      onClick={() => setMobileOpen(!mobileOpen)}
      className={`lg:hidden fixed top-4 right-6 z-[110] text-white text-2xl hover:text-red-500 transition-colors ${mobileOpen ? "hidden" : "flex"}`}
      aria-label="Toggle menu"
    >
      <i className="ri-menu-line" />
    </button>

    <div ref={wrapperRef} className="fixed top-0 left-0 w-full z-40 navbar transition-transform duration-300">
      <nav
        ref={navRef}
        className="bg-black/80 backdrop-blur-md w-full px-6 md:px-12 lg:px-20 py-4 md:py-5 opacity-0 scale-y-0 origin-top"
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
            {user && (
              <Link
                href="/home"
                className={`font-bold text-sm tracking-widest uppercase transition-colors duration-300
                  ${pathname === "/home" ? "text-red-500" : "text-white hover:text-red-500"}`}
              >
                Home
              </Link>
            )}
            {publicLinks.map((link) => (
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

          {/* Right side: Auth */}
          <div className="flex items-center gap-4 z-50">
            {/* Auth button */}
            {!loading && (
              <>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="hidden sm:flex items-center gap-2 px-5 py-2 border border-zinc-700
                               text-white text-sm font-bold uppercase tracking-wider rounded-full
                               hover:border-red-500 hover:text-red-500 transition-all duration-300"
                  >
                    <i className="ri-logout-box-r-line"></i>
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="hidden sm:flex items-center gap-2 px-5 py-2 border border-zinc-700
                               text-white text-sm font-bold uppercase tracking-wider rounded-full
                               hover:border-red-500 hover:text-red-500 transition-all duration-300"
                  >
                    <i className="ri-login-box-line"></i>
                    Login / Signup
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </div>

    {/* Mobile Menu Drawer — outside wrapperRef so it's never affected by scroll-hide */}
    <div
      className={`lg:hidden fixed inset-0 z-[100]
        ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
    >
        {/* Backdrop (Solid Dark Background for full screen) */}
        <div
          className={`absolute inset-0 bg-[#0a0a0a] backdrop-blur-xl
            ${mobileOpen ? "flex" : "hidden"}`}
        />
        {/* Full Screen Content Wrapper */}
        <div
          className={`absolute inset-0 h-full w-full flex flex-col pt-[18px] px-6 md:px-12
            ${mobileOpen ? "flex" : "hidden"}`}
        >
          {/* Header inside Menu */}
          <div className="flex items-center justify-between z-50 relative w-full mb-12">
            <Link href="/" className="text-white flex items-center gap-3 shrink-0" onClick={() => setMobileOpen(false)}>
              <img
                src="/logo-light.png"
                alt="IronStone Logo"
                className="h-10 w-auto object-contain"
              />
              <h1 className="text-2xl font-bold tracking-tight uppercase">
                Iron
                <span className="bg-gradient-to-b from-[#ff3333] via-[#cc0000] to-[#660000] text-transparent bg-clip-text">
                  Stone
                </span>
              </h1>
            </Link>
            
            {/* Close button inside full screen menu to replace the one covered underneath */}
            <button
              onClick={() => setMobileOpen(false)}
              className="text-white text-2xl hover:text-red-500 transition-colors"
              aria-label="Close menu"
            >
              <i className="ri-close-line" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 relative z-40 w-full pl-2">
            {user && (
              <Link
                href="/home"
                className={`block py-3 text-lg md:text-xl font-bold uppercase tracking-widest transition-colors
                  ${pathname === "/home" ? "text-red-500" : "text-gray-400 hover:text-white"}`}
              >
                <i className="ri-dashboard-line mr-3"></i>
                Home
              </Link>
            )}
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-3 text-lg md:text-xl font-bold uppercase tracking-widest transition-colors
                  ${pathname === link.href ? "text-red-500" : "text-gray-400 hover:text-white"}`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="h-px bg-zinc-800 w-3/4 max-w-[300px] my-6" />
            
            {!loading && (
              <>
                {user ? (
                  <Link
                    href="/profile"
                    className="block py-3 text-lg md:text-xl font-bold uppercase tracking-widest text-gray-400 hover:text-white"
                  >
                    <i className="ri-user-line mr-3"></i>
                    Profile
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block py-3 text-lg md:text-xl font-bold uppercase tracking-widest text-gray-400 hover:text-white"
                    >
                      <i className="ri-login-box-line mr-3"></i>
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="block py-3 text-lg md:text-xl font-bold uppercase tracking-widest text-red-500"
                    >
                      <i className="ri-user-add-line mr-3"></i>
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            )}
            
            {/* Social Icons inside mobile menu */}
            <div className="flex items-center gap-6 mt-8 pt-8 pb-12">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <i className="ri-facebook-fill text-2xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <i className="ri-twitter-x-line text-2xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <i className="ri-instagram-line text-2xl"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

