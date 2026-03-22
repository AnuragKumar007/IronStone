// ============================================
// Firebase Admin SDK — runs on the server ONLY
// ============================================
import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp() {
  if (getApps().length) return getApps()[0];

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey || serviceAccountKey.includes("your_")) {
    // No real credentials — return null (build time or unconfigured)
    console.warn(
      "[firebase-admin] No valid service account key found. " +
      "Server-side Firebase features will not work until .env.local is configured."
    );
    return null;
  }

  try {
    const serviceAccount: ServiceAccount = JSON.parse(serviceAccountKey);
    return initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error) {
    console.error("[firebase-admin] Failed to parse service account key:", error);
    return null;
  }
}

const adminApp = getAdminApp();

// These will be null if admin app wasn't initialized
export const adminAuth = adminApp ? getAuth(adminApp) : null;
export const adminDb = adminApp ? getFirestore(adminApp) : null;
export default adminApp;
