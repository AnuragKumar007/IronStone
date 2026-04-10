// ============================================
// Firestore — Typed data fetch helpers
// ============================================
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import type { Trainer, Equipment, GalleryImage, PricingPlan } from "@/types";

export async function getTrainers(): Promise<Trainer[]> {
  const q = query(collection(db, "trainers"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Trainer));
}

export async function getEquipment(): Promise<Equipment[]> {
  const q = query(collection(db, "equipment"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Equipment));
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const q = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      imageUrl: data.imageUrl,
      caption: data.caption,
      uploadedAt: data.uploadedAt?.toDate() || new Date(),
      uploadedBy: data.uploadedBy || "",
    } as GalleryImage;
  });
}

export async function getPricingPlans(): Promise<PricingPlan[]> {
  const q = query(collection(db, "pricing"), orderBy("price", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PricingPlan));
}
