// ============================================
// Session Cookie API Route
// POST: Set session cookie from Firebase ID token
// DELETE: Clear session cookie (logout)
// ============================================
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Force this route to be dynamic (never pre-rendered at build time)
export const dynamic = "force-dynamic";

const COOKIE_NAME = "ironstone-session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 5; // 5 days in seconds

export async function POST(request: NextRequest) {
  try {
    // Lazy import to avoid module-level initialization at build time
    const { adminAuth } = await import("@/lib/firebase-admin");

    if (!adminAuth) {
      return NextResponse.json(
        { error: "Firebase Admin SDK not configured. Please set up .env.local" },
        { status: 503 }
      );
    }

    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "Missing ID token" },
        { status: 400 }
      );
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    if (!decodedToken) {
      return NextResponse.json(
        { error: "Invalid ID token" },
        { status: 401 }
      );
    }

    // Create a session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: COOKIE_MAX_AGE * 1000, // milliseconds
    });

    // Set the cookie
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, sessionCookie, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Session deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
}
