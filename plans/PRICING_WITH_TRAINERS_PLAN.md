# Pricing Page Update — Plans with Trainers

> **Goal:** Let users choose between "Gym Only" plans and "Gym + Trainer" plans on the pricing page. Admin controls whether the trainer toggle is visible. When trainers are hidden, the page looks exactly as it does today.

---

## 1. How It Works (User-Facing)

### Pricing Page (`/pricing`)

- A **toggle/tab switcher** appears at the top: **"Gym Only"** | **"With Trainer"**
- Default selection: **Gym Only** (current behavior)
- Clicking **"With Trainer"** shows a different set of pricing cards — same plan durations (Monthly, Quarterly, Half-Yearly, Yearly) but with higher prices and trainer-specific features
- The toggle is only visible if admin has enabled `showTrainerPlans: true` in settings
- If `showTrainerPlans: false` → no toggle, no trainer plans — page looks exactly as it does now

### Toggle UI

```
┌─────────────────────────────────────────┐
│  [ Gym Only ]  [ With Trainer ]         │  ← pill toggle, red active state
└─────────────────────────────────────────┘
```

- Active pill: `bg-red-600 text-white`
- Inactive pill: `bg-zinc-800 text-gray-400 hover:text-white`
- Container: `bg-zinc-900 rounded-full p-1 inline-flex`
- Smooth transition when switching (GSAP fade or CSS transition)

### Card Differences (With Trainer)

Same card layout as Gym Only, but:
- Different price (higher)
- Different features list (includes trainer sessions, diet consultations, etc.)
- Badge can differ (e.g., "Trainer Included")
- The `plan.id` sent to Razorpay will be different (e.g., `monthly_trainer` vs `monthly`)

---

## 2. Data Model Changes

### Option A — Separate fields on existing `pricing` documents (Recommended)

Extend each `pricing/{planId}` document with trainer-specific fields:

```typescript
// Updated PricingPlan interface in src/types/index.ts
export interface PricingPlan {
  id: string;
  name: "Monthly" | "Quarterly" | "Half-Yearly" | "Yearly";
  price: number;                    // Gym Only price (INR)
  duration: number;                 // days
  features: string[];               // Gym Only features
  highlighted: boolean;
  badge?: string;

  // NEW — Trainer plan fields
  trainerPrice: number;             // Gym + Trainer price (INR)
  trainerFeatures: string[];        // Features for trainer plan
  trainerBadge?: string;            // Badge for trainer plan card
  trainerHighlighted: boolean;      // Whether trainer card is featured
}
```

**Why this approach:**
- Keeps it simple — no new collections
- 1:1 mapping: each duration has exactly one gym-only price and one trainer price
- Admin edits both on the same card in `/admin/pricing`
- No complex joins or lookups

### Settings Document — `settings/pricing` (New)

```typescript
// New Firestore document: settings/pricing
{
  showTrainerPlans: boolean;   // true = show toggle on pricing page
}
```

Add to types:
```typescript
export interface PricingSettings {
  showTrainerPlans: boolean;
}
```

### Updated UserData (for membership tracking)

```typescript
// Add to UserData interface
export interface UserData {
  // ... existing fields ...
  membershipPlan: "monthly" | "quarterly" | "halfYearly" | "yearly" | null;
  membershipType: "gym" | "trainer" | null;   // NEW — which plan type user purchased
  // ... rest of fields ...
}
```

This way the system knows if the user bought a gym-only or gym+trainer plan.

---

## 3. Admin Changes

### Admin Pricing Page (`/admin/pricing`)

#### 3a. Global Toggle at Top

```
┌────────────────────────────────────────────────────────────┐
│  Pricing Plans                                             │
│                                                            │
│  ┌─ Show Trainer Plans on Pricing Page ──────────────┐    │
│  │  [ Toggle Switch ]  Enabled / Disabled             │    │
│  │  When enabled, users can switch between             │    │
│  │  "Gym Only" and "With Trainer" on the pricing page  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                            │
│  ┌──── Monthly ────────────────────────────────────────┐   │
│  │  GYM ONLY              │  WITH TRAINER              │   │
│  │  Price: ₹1,499         │  Price: ₹2,999             │   │
│  │  Badge: (empty)        │  Badge: Trainer Included   │   │
│  │  Features:             │  Features:                  │   │
│  │  - Full gym access     │  - Full gym access          │   │
│  │  - Locker room         │  - Locker room              │   │
│  │                        │  - Personal trainer 3x/week │   │
│  │  [ ] Highlighted       │  [ ] Highlighted            │   │
│  │                        │                             │   │
│  │  [ Save Changes ]                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

#### 3b. Admin Card Layout

Each plan card now has **two columns** (or two tabs within the card):
- **Left: Gym Only** — current fields (price, features, badge, highlighted)
- **Right: With Trainer** — new fields (trainerPrice, trainerFeatures, trainerBadge, trainerHighlighted)

Both save together with a single "Save Changes" button per plan.

#### 3c. Admin Firestore Helpers (New/Updated)

```typescript
// In src/lib/firestore.ts

// Fetch pricing settings
export async function getPricingSettings(): Promise<PricingSettings> {
  const snap = await getDoc(doc(db, "settings", "pricing"));
  if (!snap.exists()) return { showTrainerPlans: false };
  return snap.data() as PricingSettings;
}

// Update pricing settings
export async function updatePricingSettings(data: Partial<PricingSettings>): Promise<void> {
  await setDoc(doc(db, "settings", "pricing"), data, { merge: true });
}

// updatePricingPlan already exists — just needs to handle new fields
```

---

## 4. Payment Flow Changes

### Create Order (`POST /api/payment/create-order`)

Update request body:
```typescript
{
  planId: string;       // "monthly", "quarterly", etc.
  planType: "gym" | "trainer";  // NEW
  amount: number;       // price * 100 (paise) — use trainerPrice if type is "trainer"
}
```

### Verify Payment (`POST /api/payment/verify`)

Update to also save `membershipType`:
```typescript
// On success, update user doc:
{
  membershipPlan: planId,
  membershipType: planType,    // NEW — "gym" or "trainer"
  membershipStart: now,
  membershipExpiry: now + duration,
  isActive: true,
  razorpayPaymentId: paymentId
}
```

### Pricing Page Checkout Handler

```typescript
const handleCheckout = async (plan: PricingPlan, type: "gym" | "trainer") => {
  const price = type === "trainer" ? plan.trainerPrice : plan.price;
  const pricePaise = price * 100;

  const res = await fetch("/api/payment/create-order", {
    method: "POST",
    body: JSON.stringify({
      planId: plan.id,
      planType: type,
      amount: pricePaise,
    }),
  });
  // ... rest of Razorpay flow
};
```

---

## 5. Firestore Security Rules

Add rules for the new `settings` collection:

```javascript
// Settings — admin write, public read (needed for toggle visibility)
match /settings/{docId} {
  allow read: if true;
  allow write: if isAdmin();
}
```

---

## 6. Implementation Steps (Ordered)

### Step 1: Update Types
- Add `trainerPrice`, `trainerFeatures`, `trainerBadge`, `trainerHighlighted` to `PricingPlan`
- Add `PricingSettings` interface
- Add `membershipType` to `UserData`

### Step 2: Update Firestore Helpers
- Add `getPricingSettings()` and `updatePricingSettings()`
- Ensure `updatePricingPlan()` handles new trainer fields

### Step 3: Seed/Migrate Firestore Data
- Update existing pricing documents to include trainer fields
- Create `settings/pricing` document with `showTrainerPlans: false` (disabled by default)

### Step 4: Update Admin Pricing Page
- Add the global toggle for `showTrainerPlans`
- Split each plan card into two sections (Gym Only | With Trainer)
- Wire up save to include trainer fields

### Step 5: Update Public Pricing Page
- Fetch `PricingSettings` alongside plans
- Conditionally render the toggle
- Track active tab state (`gym` | `trainer`)
- Render correct price/features/badge based on active tab
- Pass `planType` through to checkout handler

### Step 6: Update Payment APIs
- `create-order`: accept `planType`, validate amount matches Firestore
- `verify`: save `membershipType` to user doc

### Step 7: Update Profile/Home Pages
- Display membership type (Gym Only vs Gym + Trainer) on profile
- Show appropriate info on home dashboard

### Step 8: Update Admin Members Page
- Show membership type column in members table

---

## 7. Edge Cases

| Scenario | Behavior |
|----------|----------|
| Admin disables trainer toggle while user is on pricing page | Toggle disappears on next page load; no impact on existing memberships |
| User has trainer plan, admin disables trainer plans | Existing membership stays unchanged — they just can't buy a new trainer plan |
| Trainer fields are empty/missing in Firestore | Fall back gracefully — treat as no trainer plan available for that duration |
| Admin sets trainerPrice to 0 | Validation: don't allow price of 0 — show error on admin save |

---

## 8. Files to Create/Modify

| File | Action |
|------|--------|
| `src/types/index.ts` | Modify — add trainer fields to PricingPlan, add PricingSettings, add membershipType to UserData |
| `src/lib/firestore.ts` | Modify — add getPricingSettings, updatePricingSettings |
| `src/app/(public)/pricing/page.tsx` | Modify — add toggle, dual card rendering, pass planType to checkout |
| `src/app/admin/pricing/page.tsx` | Modify — add global toggle, two-column edit per plan |
| `src/app/api/payment/create-order/route.ts` | Modify — accept planType |
| `src/app/api/payment/verify/route.ts` | Modify — save membershipType |
| `src/app/(public)/profile/page.tsx` | Modify — show membership type |
| `src/app/(protected)/home/page.tsx` | Modify — show membership type |
| `src/app/admin/members/page.tsx` | Modify — show membership type column |
| `scripts/seed.ts` | Modify — add trainer pricing seed data |
