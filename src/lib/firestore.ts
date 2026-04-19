// ============================================
// Firestore — Typed data fetch helpers
// ============================================
import {
  collection, getDocs, query, orderBy, where,
  doc, addDoc, updateDoc, deleteDoc, writeBatch, Timestamp,
  getDoc, setDoc, limit, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { UserData, Trainer, Equipment, GalleryImage, PricingPlan, PricingSettings, Coupon, ContactMessage } from "@/types";

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

// ============================================
// Admin — Members
// ============================================
export async function getUsers(filter?: "all" | "active" | "expired" | "noPlan"): Promise<UserData[]> {
  const q = query(collection(db, "users"), where("role", "==", "user"));
  const snap = await getDocs(q);
  const now = new Date();

  const users = snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: data.uid,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      membershipPlan: data.membershipPlan,
      membershipType: data.membershipType || null,
      membershipStart: data.membershipStart?.toDate() || null,
      membershipExpiry: data.membershipExpiry?.toDate() || null,
      isActive: data.isActive,
      razorpayPaymentId: data.razorpayPaymentId,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as UserData;
  });

  if (!filter || filter === "all") return users;
  if (filter === "active") return users.filter((u) => u.isActive && u.membershipExpiry && u.membershipExpiry > now);
  if (filter === "expired") return users.filter((u) => u.membershipExpiry && u.membershipExpiry <= now);
  if (filter === "noPlan") return users.filter((u) => !u.membershipPlan);
  return users;
}

export async function updateUserMembership(uid: string, updates: Partial<UserData>): Promise<void> {
  await updateDoc(doc(db, "users", uid), updates);
}

// ============================================
// Admin — Pricing
// ============================================
export async function updatePricingPlan(planId: string, data: Partial<PricingPlan>): Promise<void> {
  const { id, ...rest } = data as PricingPlan & { id?: string };
  void id;
  await updateDoc(doc(db, "pricing", planId), rest);
}

// ============================================
// Pricing Settings
// ============================================
export async function getPricingSettings(): Promise<PricingSettings> {
  const snap = await getDoc(doc(db, "settings", "pricing"));
  if (!snap.exists()) return { showTrainerPlans: false };
  return snap.data() as PricingSettings;
}

export async function updatePricingSettings(data: Partial<PricingSettings>): Promise<void> {
  await setDoc(doc(db, "settings", "pricing"), data, { merge: true });
}

// ============================================
// Admin — Trainers
// ============================================
export async function addTrainer(data: Omit<Trainer, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "trainers"), data);
  return ref.id;
}

export async function updateTrainer(id: string, data: Partial<Trainer>): Promise<void> {
  const { id: _, ...rest } = data as Trainer;
  void _;
  await updateDoc(doc(db, "trainers", id), rest);
}

export async function deleteTrainer(id: string): Promise<void> {
  await deleteDoc(doc(db, "trainers", id));
}

export async function reorderTrainers(items: { id: string; order: number }[]): Promise<void> {
  const batch = writeBatch(db);
  items.forEach((item) => batch.update(doc(db, "trainers", item.id), { order: item.order }));
  await batch.commit();
}

// ============================================
// Admin — Equipment
// ============================================
export async function addEquipment(data: Omit<Equipment, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "equipment"), data);
  return ref.id;
}

export async function updateEquipment(id: string, data: Partial<Equipment>): Promise<void> {
  const { id: _, ...rest } = data as Equipment;
  void _;
  await updateDoc(doc(db, "equipment", id), rest);
}

export async function deleteEquipment(id: string): Promise<void> {
  await deleteDoc(doc(db, "equipment", id));
}

export async function reorderEquipment(items: { id: string; order: number }[]): Promise<void> {
  const batch = writeBatch(db);
  items.forEach((item) => batch.update(doc(db, "equipment", item.id), { order: item.order }));
  await batch.commit();
}

// ============================================
// Admin — Gallery
// ============================================
export async function addGalleryImage(data: Omit<GalleryImage, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "gallery"), {
    ...data,
    uploadedAt: Timestamp.fromDate(data.uploadedAt),
  });
  return ref.id;
}

export async function updateGalleryImage(id: string, data: Partial<GalleryImage>): Promise<void> {
  await updateDoc(doc(db, "gallery", id), data);
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await deleteDoc(doc(db, "gallery", id));
}

// ============================================
// Coupons
// ============================================
export async function getCoupons(): Promise<Coupon[]> {
  const q = query(collection(db, "coupons"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      expiresAt: data.expiresAt?.toDate() || null,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Coupon;
  });
}

export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const q = query(
    collection(db, "coupons"),
    where("code", "==", code.toUpperCase()),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  const data = d.data();
  return {
    id: d.id,
    ...data,
    expiresAt: data.expiresAt?.toDate() || null,
    createdAt: data.createdAt?.toDate() || new Date(),
  } as Coupon;
}

export async function createCoupon(
  data: Omit<Coupon, "id" | "currentUses" | "usedBy" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "coupons"), {
    ...data,
    code: data.code.toUpperCase(),
    currentUses: 0,
    usedBy: [],
    expiresAt: data.expiresAt ? Timestamp.fromDate(new Date(data.expiresAt)) : null,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateCoupon(id: string, data: Partial<Coupon>): Promise<void> {
  const { id: _, createdAt: __, ...rest } = data as Coupon & { id?: string };
  void _;
  void __;
  if (rest.expiresAt) {
    (rest as Record<string, unknown>).expiresAt = Timestamp.fromDate(new Date(rest.expiresAt));
  }
  await updateDoc(doc(db, "coupons", id), rest);
}

export async function deleteCoupon(id: string): Promise<void> {
  await deleteDoc(doc(db, "coupons", id));
}

// ============================================
// Admin — Contact Messages
// ============================================
export async function getContactMessages(): Promise<ContactMessage[]> {
  const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      read: data.read ?? false,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as ContactMessage;
  });
}

export async function addContactMessage(data: Omit<ContactMessage, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "messages"), {
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    read: false,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateContactMessage(id: string, data: Partial<ContactMessage>): Promise<void> {
  const { id: _, createdAt: __, ...rest } = data as ContactMessage & { id?: string };
  void _;
  void __;
  await updateDoc(doc(db, "messages", id), rest);
}

export async function deleteContactMessage(id: string): Promise<void> {
  await deleteDoc(doc(db, "messages", id));
}
