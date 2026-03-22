// ============================================
// Proxy — Route protection & redirects (Next.js 16)
// ============================================
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "ironstone-session";

// Routes that require authentication
const protectedRoutes = ["/home", "/profile"];
const adminRoutes = ["/admin"];

// Routes only for unauthenticated users
const authRoutes = ["/login", "/signup"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;
  const isAuthenticated = !!sessionCookie;

  // ── Protected routes: redirect to /login if not authenticated
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if ((isProtectedRoute || isAdminRoute) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Auth routes: redirect to /home if already authenticated
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // ── Landing page: redirect authenticated users to /home
  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and API routes
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|css|js)$).*)",
  ],
};

