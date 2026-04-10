// ============================================
// Firestore Seed Script — Populates dev data
// Run: npx tsx scripts/seed.ts
// ============================================
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJUGgCmpXOMW55rjysLAGmrF0eM71EPSg",
  authDomain: "ironstone-91903.firebaseapp.com",
  projectId: "ironstone-91903",
  storageBucket: "ironstone-91903.firebasestorage.app",
  messagingSenderId: "473721951087",
  appId: "1:473721951087:web:5cd10104cde38663ba8e9a",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── Trainers ────────────────────────────────
const trainers = [
  {
    name: "Arjun Mehta",
    specialization: "Strength Training",
    bio: "NSCA-certified strength coach with 8+ years of experience. Specializes in powerlifting, Olympic lifts, and building raw functional strength.",
    photoUrl: "/trainers/trainer-1.png",
    experience: "8+ Years",
    order: 1,
  },
  {
    name: "Priya Sharma",
    specialization: "Yoga & Flexibility",
    bio: "Internationally certified yoga instructor combining traditional Hatha and power Vinyasa flows. Focuses on mobility, injury rehab, and mindfulness.",
    photoUrl: "/trainers/trainer-2.png",
    experience: "6+ Years",
    order: 2,
  },
  {
    name: "Vikram Singh",
    specialization: "HIIT & CrossFit",
    bio: "Former national-level athlete turned CrossFit coach. Designs high-intensity metabolic conditioning programs that torch fat and build endurance.",
    photoUrl: "/trainers/trainer-1.png",
    experience: "10+ Years",
    order: 3,
  },
  {
    name: "Sneha Patel",
    specialization: "Nutrition & Weight Loss",
    bio: "Certified sports nutritionist and weight management specialist. Creates personalized diet plans backed by macro tracking.",
    photoUrl: "/trainers/trainer-2.png",
    experience: "5+ Years",
    order: 4,
  },
  {
    name: "Rahul Kapoor",
    specialization: "Boxing & MMA",
    bio: "Professional MMA fighter and boxing coach. Teaches striking technique, footwork, and combat conditioning.",
    photoUrl: "/trainers/trainer-1.png",
    experience: "7+ Years",
    order: 5,
  },
  {
    name: "Ananya Desai",
    specialization: "Calisthenics",
    bio: "Bodyweight training specialist who helps clients master pull-ups, muscle-ups, handstands, and advanced progressions.",
    photoUrl: "/trainers/trainer-2.png",
    experience: "4+ Years",
    order: 6,
  },
];

// ── Equipment ───────────────────────────────
const equipment = [
  { name: "Olympic Barbell Set", description: "Competition-grade 20kg Olympic barbell with calibrated Eleiko plates.", imageUrl: "/equipment/equipment-1.png", category: "Strength", order: 1 },
  { name: "Adjustable Dumbbells", description: "Premium rubber-coated hex dumbbells ranging from 2.5kg to 50kg.", imageUrl: "/equipment/equipment-1.png", category: "Strength", order: 2 },
  { name: "Cable Crossover Machine", description: "Dual-stack cable machine with 200lbs per side. Infinite angle adjustments.", imageUrl: "/equipment/equipment-1.png", category: "Strength", order: 3 },
  { name: "Assault Air Bike", description: "Fan-resistance air bike with unlimited resistance scaling for HIIT.", imageUrl: "/equipment/equipment-1.png", category: "Cardio", order: 4 },
  { name: "Concept2 Rowing Machine", description: "The gold standard in indoor rowing with PM5 monitor.", imageUrl: "/equipment/equipment-1.png", category: "Cardio", order: 5 },
  { name: "Commercial Treadmill", description: "Life Fitness commercial treadmill with 15% incline and cushioned deck.", imageUrl: "/equipment/equipment-1.png", category: "Cardio", order: 6 },
  { name: "Battle Ropes", description: "50ft heavy-duty polyester battle ropes for full-body power training.", imageUrl: "/equipment/equipment-1.png", category: "Functional", order: 7 },
  { name: "TRX Suspension Trainer", description: "Military-grade suspension system for 300+ bodyweight exercises.", imageUrl: "/equipment/equipment-1.png", category: "Functional", order: 8 },
  { name: "Theragun Pro", description: "Professional-grade percussive therapy device for accelerated recovery.", imageUrl: "/equipment/equipment-1.png", category: "Recovery", order: 9 },
  { name: "Foam Rollers & Lacrosse Balls", description: "High-density rollers and trigger-point balls for myofascial release.", imageUrl: "/equipment/equipment-1.png", category: "Recovery", order: 10 },
  { name: "Leg Press Machine", description: "Plate-loaded 45-degree leg press with 1000lb capacity.", imageUrl: "/equipment/equipment-1.png", category: "Strength", order: 11 },
  { name: "Kettlebell Collection", description: "Competition kettlebells from 8kg to 48kg. Powder-coated for chalk grip.", imageUrl: "/equipment/equipment-1.png", category: "Functional", order: 12 },
];

// ── Gallery ─────────────────────────────────
const gallery = [
  { imageUrl: "/equipment/equipment-1.png", caption: "Free Weights Zone" },
  { imageUrl: "/trainers/trainer-1.png", caption: "Personal Training Session" },
  { imageUrl: "/trainers/trainer-2.png", caption: "Yoga & Flexibility Class" },
  { imageUrl: "/equipment/equipment-1.png", caption: "Cardio Floor" },
  { imageUrl: "/trainers/trainer-1.png", caption: "Boxing Ring" },
  { imageUrl: "/equipment/equipment-1.png", caption: "CrossFit Area" },
  { imageUrl: "/trainers/trainer-2.png", caption: "Group Classes" },
  { imageUrl: "/equipment/equipment-1.png", caption: "Recovery Lounge" },
  { imageUrl: "/trainers/trainer-1.png", caption: "Strength Zone" },
  { imageUrl: "/equipment/equipment-1.png", caption: "Olympic Lifting Platform" },
  { imageUrl: "/trainers/trainer-2.png", caption: "Stretching Area" },
  { imageUrl: "/equipment/equipment-1.png", caption: "Battle Ropes Station" },
];

// ── Pricing Plans ───────────────────────────
const pricing = [
  {
    name: "Monthly",
    price: 1499,
    duration: 30,
    features: ["Full gym access", "Locker facility", "Basic fitness assessment", "Access to all equipment", "Open gym hours (6 AM – 10 PM)"],
    highlighted: false,
  },
  {
    name: "Quarterly",
    price: 3999,
    duration: 90,
    features: ["Everything in Monthly", "1 personal training session / month", "Diet consultation", "Progress tracking", "Guest pass (1 / month)"],
    highlighted: false,
  },
  {
    name: "Half-Yearly",
    price: 6999,
    duration: 180,
    features: ["Everything in Quarterly", "2 personal training sessions / month", "Custom workout plan", "Body composition analysis", "Priority booking for classes"],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Yearly",
    price: 11999,
    duration: 365,
    features: ["Everything in Half-Yearly", "4 personal training sessions / month", "Unlimited guest passes", "Exclusive member events", "Free merchandise kit", "Freeze membership (up to 30 days)"],
    highlighted: false,
    badge: "Best Value",
  },
];

// ── Seed Functions ──────────────────────────
async function seed() {
  console.log("🌱 Seeding Firestore...\n");

  // Trainers
  for (let i = 0; i < trainers.length; i++) {
    const id = `trainer-${i + 1}`;
    await setDoc(doc(db, "trainers", id), trainers[i]);
    console.log(`  ✓ trainers/${id}`);
  }

  // Equipment
  for (let i = 0; i < equipment.length; i++) {
    const id = `equipment-${i + 1}`;
    await setDoc(doc(db, "equipment", id), equipment[i]);
    console.log(`  ✓ equipment/${id}`);
  }

  // Gallery
  for (let i = 0; i < gallery.length; i++) {
    const id = `gallery-${i + 1}`;
    await setDoc(doc(db, "gallery", id), {
      ...gallery[i],
      uploadedAt: Timestamp.now(),
      uploadedBy: "seed-script",
    });
    console.log(`  ✓ gallery/${id}`);
  }

  // Pricing
  const planIds = ["monthly", "quarterly", "halfYearly", "yearly"];
  for (let i = 0; i < pricing.length; i++) {
    await setDoc(doc(db, "pricing", planIds[i]), pricing[i]);
    console.log(`  ✓ pricing/${planIds[i]}`);
  }

  console.log("\n✅ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
