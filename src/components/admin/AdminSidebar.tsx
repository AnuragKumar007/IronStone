"use client";
// ============================================
// AdminSidebar — Collapsible sidebar navigation
// ============================================
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { logOut } from "@/lib/auth";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "ri-dashboard-3-line" },
  { label: "Members", href: "/admin/members", icon: "ri-group-line" },
  { label: "Pricing", href: "/admin/pricing", icon: "ri-price-tag-3-line" },
  { label: "Trainers", href: "/admin/trainers", icon: "ri-team-line" },
  { label: "Equipment", href: "/admin/equipment", icon: "ri-boxing-line" },
  { label: "Gallery", href: "/admin/gallery", icon: "ri-image-line" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userData } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin-sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("admin-sidebar-collapsed", String(next));
  };

  const handleLogout = async () => {
    await logOut();
    router.push("/");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-6 border-b border-zinc-800">
        <Link href="/home" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-black">IS</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-white text-sm font-bold uppercase tracking-tight">
                Iron<span className="text-red-500">Stone</span>
              </h1>
              <p className="text-gray-600 text-[10px] uppercase tracking-widest">Admin Panel</p>
            </div>
          )}
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
              ${
                isActive(item.href)
                  ? "bg-red-600/10 text-red-500 border-l-2 border-red-500"
                  : "text-gray-400 hover:text-white hover:bg-surface-300"
              }`}
          >
            <i className={`${item.icon} text-lg`}></i>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t border-zinc-800 space-y-2">
        {/* User Info */}
        {!collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-white text-sm font-semibold truncate">{userData?.name}</p>
            <p className="text-gray-600 text-xs truncate">{userData?.email}</p>
          </div>
        )}

        {/* Back to Site */}
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-surface-300 transition-all"
        >
          <i className="ri-arrow-left-line text-lg"></i>
          {!collapsed && <span>Back to Site</span>}
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-500 hover:bg-red-500/5 transition-all w-full"
        >
          <i className="ri-logout-box-r-line text-lg"></i>
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={toggleCollapse}
          className="hidden lg:flex items-center justify-center w-full py-2 text-gray-600 hover:text-gray-400 transition-colors"
        >
          <i className={`${collapsed ? "ri-arrow-right-s-line" : "ri-arrow-left-s-line"} text-lg`}></i>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-surface-100 border-r border-zinc-800 h-screen sticky top-0 transition-all duration-300
          ${collapsed ? "w-16" : "w-64"}`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 bg-surface-200 border border-zinc-800 rounded-xl flex items-center justify-center text-white"
      >
        <i className="ri-menu-line text-lg"></i>
      </button>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300
          ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300
            ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full w-64 bg-surface-100 border-r border-zinc-800 transform transition-transform duration-300
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
