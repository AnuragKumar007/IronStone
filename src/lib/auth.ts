// ============================================
// Client-side Auth Helpers
// ============================================
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

const googleProvider = new GoogleAuthProvider();

// ── Sign Up with Email ──────────────────────
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
  phone: string
) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  // Create user document in Firestore
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email: user.email,
    phone,
    role: "user",
    membershipPlan: null,
    membershipStart: null,
    membershipExpiry: null,
    isActive: false,
    razorpayPaymentId: null,
    createdAt: serverTimestamp(),
  });

  // Set session cookie via API
  await setSessionCookie(user);

  return user;
}

// ── Sign In with Email ──────────────────────
export async function signInWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await setSessionCookie(credential.user);
  return credential.user;
}

// ── Sign In with Google ─────────────────────
export async function signInWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  const user = credential.user;

  // Check if user doc already exists
  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (!userDoc.exists()) {
    // First-time Google sign-in — create user doc
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email,
      phone: "",
      role: "user",
      membershipPlan: null,
      membershipStart: null,
      membershipExpiry: null,
      isActive: false,
      razorpayPaymentId: null,
      createdAt: serverTimestamp(),
    });
  }

  await setSessionCookie(user);
  return { user, isNewUser: !userDoc.exists() };
}

// ── Log Out ─────────────────────────────────
export async function logOut() {
  await signOut(auth);
  // Clear session cookie
  await fetch("/api/auth/session", { method: "DELETE" });
}

// ── Forgot Password ─────────────────────────
export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

// ── Set Session Cookie ──────────────────────
async function setSessionCookie(user: User) {
  try {
    const idToken = await user.getIdToken();
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
  } catch (error) {
    // Session cookie is optional — auth still works client-side via Firebase
    console.warn("Failed to set session cookie:", error);
  }
}
