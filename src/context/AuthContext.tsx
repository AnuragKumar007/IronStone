"use client";
// ============================================
// Auth Context — provides auth state to the app
// ============================================
import { createContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { UserData } from "@/types";

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setUserData(null);
        setLoading(false);
        return;
      }

      // Listen to Firestore user document in real-time
      const unsubDoc = onSnapshot(
        doc(db, "users", firebaseUser.uid),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setUserData({
              uid: data.uid,
              name: data.name,
              email: data.email,
              phone: data.phone,
              role: data.role,
              membershipPlan: data.membershipPlan,
              membershipStart: data.membershipStart?.toDate() || null,
              membershipExpiry: data.membershipExpiry?.toDate() || null,
              isActive: data.isActive,
              razorpayPaymentId: data.razorpayPaymentId,
              createdAt: data.createdAt?.toDate() || new Date(),
            } as UserData);
          }
          setLoading(false);
        },
        () => {
          // Error handler
          setLoading(false);
        }
      );

      return () => unsubDoc();
    });

    return () => unsubAuth();
  }, []);

  const isAdmin = userData?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, userData, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
