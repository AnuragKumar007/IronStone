# Coupon System Plan

> **Goal:** Admin can create discount coupons with plan-level restrictions. Users can apply a coupon at checkout for a one-time discount. Each coupon can only be used once per user, and coupons are restricted to plans at or above a minimum tier.

---

## 1. How It Works

### User Flow

1. User is on `/pricing` and clicks "Get Started" on a plan
2. Before Razorpay opens, a **coupon input field** appears (inline on the card or in a small checkout step/modal)
3. User types a coupon code and clicks "Apply"
4. System validates the coupon:
   - Does the code exist?
   - Is it active and not expired?
   - Has this user already used it?
   - Is the selected plan eligible (meets minimum plan tier)?
   - Has the coupon reached its usage limit?
5. If valid: show the discounted price (original price crossed out, new price shown)
6. User proceeds to Razorpay with the discounted amount
7. After payment, the coupon is marked as used by this user

### Admin Flow

1. Admin goes to `/admin/coupons` (new page)
2. Sees a table of all coupons with stats
3. Can create new coupons, edit existing ones, or deactivate them
4. When creating a coupon, admin sets:
   - Code (e.g., "NEWYEAR25")
   - Discount type (percentage or flat amount)
   - Discount value (e.g., 25% or ₹500)
   - Minimum plan tier (the lowest plan this coupon works on)
   - Max uses (total, across all users — 0 = unlimited)
   - Expiry date (optional)
   - Active/inactive toggle

---

## 2. Plan Tier System

Plans have a natural hierarchy based on duration/value:

| Tier | Plan ID | Duration |
|------|---------|----------|
| 1 | `monthly` | 30 days |
| 2 | `quarterly` | 90 days |
| 3 | `halfYearly` | 180 days |
| 4 | `yearly` | 365 days |

**Minimum plan restriction logic:**
- If a coupon has `minPlanTier: 2` (quarterly), it works on quarterly, half-yearly, and yearly — but NOT monthly
- This prevents users from using high-value coupons on cheap plans

Example scenarios:
- Coupon "BIGDISCOUNT50" → 50% off, minPlanTier: 3 (half-yearly+) → user can't use on monthly or quarterly
- Coupon "WELCOME10" → 10% off, minPlanTier: 1 (all plans) → works on everything

---

## 3. Data Model

### New Firestore Collection: `coupons/{couponId}`

```typescript
export interface Coupon {
  id: string;                    // Auto-generated doc ID
  code: string;                  // Unique coupon code, uppercase (e.g., "NEWYEAR25")
  discountType: "percentage" | "flat";  // Type of discount
  discountValue: number;         // If percentage: 10 = 10%. If flat: 500 = ₹500 off
  minPlanTier: number;           // 1 = monthly+, 2 = quarterly+, 3 = halfYearly+, 4 = yearly only
  maxUses: number;               // 0 = unlimited, otherwise total uses allowed
  currentUses: number;           // How many times it has been used so far
  usedBy: string[];              // Array of user UIDs who have used this coupon
  expiresAt: Date | null;        // Null = never expires
  isActive: boolean;             // Admin can manually deactivate
  createdAt: Date;
  createdBy: string;             // Admin UID who created it
}
```

### Plan Tier Mapping (constant in code)

```typescript
// src/lib/constants.ts or src/types/index.ts
export const PLAN_TIER_MAP: Record<string, number> = {
  monthly: 1,
  quarterly: 2,
  halfYearly: 3,
  yearly: 4,
};

export const PLAN_TIER_LABELS: Record<number, string> = {
  1: "Monthly & above",
  2: "Quarterly & above",
  3: "Half-Yearly & above",
  4: "Yearly only",
};
```

---

## 4. Coupon Validation Logic

### Validation Function (Server-Side — in API route)

```typescript
// Used in POST /api/payment/create-order (or a new /api/coupon/validate)

interface CouponValidation {
  valid: boolean;
  error?: string;
  discount?: number;       // Calculated discount amount in INR
  finalPrice?: number;     // Price after discount
}

function validateCoupon(
  coupon: Coupon,
  userId: string,
  planId: string,
  planPrice: number
): CouponValidation {

  // 1. Is the coupon active?
  if (!coupon.isActive) {
    return { valid: false, error: "This coupon is no longer active" };
  }

  // 2. Has it expired?
  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return { valid: false, error: "This coupon has expired" };
  }

  // 3. Has the user already used it?
  if (coupon.usedBy.includes(userId)) {
    return { valid: false, error: "You have already used this coupon" };
  }

  // 4. Has it reached max uses?
  if (coupon.maxUses > 0 && coupon.currentUses >= coupon.maxUses) {
    return { valid: false, error: "This coupon has reached its usage limit" };
  }

  // 5. Is the plan eligible?
  const planTier = PLAN_TIER_MAP[planId];
  if (!planTier || planTier < coupon.minPlanTier) {
    const minLabel = PLAN_TIER_LABELS[coupon.minPlanTier];
    return { valid: false, error: `This coupon is only valid for ${minLabel} plans` };
  }

  // 6. Calculate discount
  let discount: number;
  if (coupon.discountType === "percentage") {
    discount = Math.round(planPrice * (coupon.discountValue / 100));
  } else {
    discount = coupon.discountValue;
  }

  // Don't let discount exceed plan price
  discount = Math.min(discount, planPrice);

  return {
    valid: true,
    discount,
    finalPrice: planPrice - discount,
  };
}
```

### Important: Server-Side Validation is Mandatory

The coupon MUST be re-validated on the server during `create-order`. Never trust the client-calculated discount. Flow:

1. Client sends: `{ planId, planType, couponCode }` to `/api/payment/create-order`
2. Server fetches plan from Firestore, fetches coupon by code, validates
3. Server calculates the final price and creates Razorpay order with that amount
4. After payment verification, server marks coupon as used

---

## 5. API Routes

### New: `POST /api/coupon/validate` (Optional — for client-side preview)

```typescript
// Request
{ code: string; planId: string }

// Response (success)
{
  valid: true,
  discountType: "percentage" | "flat",
  discountValue: number,
  discount: number,         // Calculated discount for this plan
  finalPrice: number
}

// Response (error)
{ valid: false, error: string }
```

This is purely for UI feedback (showing crossed-out price). The real validation happens in `create-order`.

### Updated: `POST /api/payment/create-order`

```typescript
// Request — add optional couponCode
{
  planId: string;
  planType: "gym" | "trainer";
  couponCode?: string;        // NEW
}

// Server logic:
// 1. Fetch plan from Firestore
// 2. Determine price based on planType (price or trainerPrice)
// 3. If couponCode provided:
//    a. Fetch coupon by code from Firestore
//    b. Get userId from session cookie
//    c. Validate coupon (validateCoupon function)
//    d. If invalid, return 400 with error
//    e. If valid, use finalPrice for Razorpay order
// 4. Create Razorpay order with correct amount
// 5. Return orderId + original amount + discount + finalAmount
```

### Updated: `POST /api/payment/verify`

```typescript
// Request — add optional couponCode
{
  orderId: string;
  paymentId: string;
  signature: string;
  planId: string;
  planType: "gym" | "trainer";
  duration: number;
  couponCode?: string;        // NEW
}

// Server logic (after signature verification):
// 1. Update user membership (existing)
// 2. If couponCode was used:
//    a. Fetch coupon doc
//    b. Atomically update: increment currentUses, add userId to usedBy array
//    c. Use Firestore transaction or arrayUnion + increment
```

Marking coupon as used after payment:
```typescript
import { arrayUnion, increment } from "firebase/firestore";

await updateDoc(doc(db, "coupons", couponId), {
  currentUses: increment(1),
  usedBy: arrayUnion(userId),
});
```

---

## 6. Admin Coupon Page (`/admin/coupons`)

### Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Coupons                              [ + Create Coupon ]    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ Code      │ Discount   │ Min Plan    │ Uses   │ Status│   │
│  ├───────────┼────────────┼─────────────┼────────┼───────┤   │
│  │ NEWYEAR25 │ 25%        │ Quarterly+  │ 12/50  │ Active│   │
│  │ FLAT500   │ ₹500 off   │ Half-Yearly+│ 3/10   │ Active│   │
│  │ WELCOME10 │ 10%        │ All plans   │ 45/0   │ Active│   │
│  │ EXPIRED01 │ 20%        │ Yearly only │ 8/20   │ Exprd │   │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  (click row to edit / view details)                          │
└──────────────────────────────────────────────────────────────┘
```

### Create/Edit Coupon Modal

```
┌─────────────────────────────────────────────┐
│  Create Coupon                         [X]  │
│                                             │
│  Code:          [ NEWYEAR25        ]        │
│                                             │
│  Discount Type: ( ) Percentage  ( ) Flat ₹  │
│                                             │
│  Discount Value: [ 25 ]  (% or ₹ amount)   │
│                                             │
│  Minimum Plan:  [ Quarterly & above  v ]    │
│    (dropdown: All plans, Quarterly+,        │
│     Half-Yearly+, Yearly only)              │
│                                             │
│  Max Uses:      [ 50 ]  (0 = unlimited)     │
│                                             │
│  Expires:       [ 2026-06-30 ]  (optional)  │
│                                             │
│  [x] Active                                 │
│                                             │
│  [ Create Coupon ]                          │
└─────────────────────────────────────────────┘
```

### Admin Sidebar Update

Add "Coupons" link to admin sidebar navigation (after "Pricing"):
```
Dashboard
Members
Pricing
Coupons    ← NEW
Trainers
Equipment
Gallery
```

---

## 7. Pricing Page Coupon UI

### Where the Coupon Input Goes

**Option: Inline on card** — When user clicks "Get Started", the button area expands to show a coupon input before proceeding to Razorpay:

```
┌───────────────────────────────┐
│  QUARTERLY                    │
│  ₹3,999                      │
│  ...features...               │
│                               │
│  ┌───────────────────────────┐│
│  │ Coupon: [        ] [Apply]││
│  │                           ││
│  │ ✓ NEWYEAR25 applied!     ││
│  │   ₹3,999  →  ₹2,999     ││
│  │   You save ₹1,000        ││
│  └───────────────────────────┘│
│                               │
│  [ Proceed to Payment ]      │
└───────────────────────────────┘
```

**States:**
- Default: just the coupon input + "Apply" button
- Loading: spinner on Apply button while validating
- Success: green checkmark, original price crossed out, new price shown, savings amount
- Error: red text below input with specific error message (e.g., "This coupon is only valid for Quarterly & above plans")
- After applying: "Get Started" text changes to "Proceed to Payment" with the discounted price

### Removing a Coupon

Small "x" next to the applied coupon to remove it and revert to original price.

---

## 8. Firestore Security Rules

```javascript
// Coupons — public can read (for client-side validation preview),
// only admin can create/update/delete
match /coupons/{couponId} {
  allow read: if true;
  allow create, update, delete: if isAdmin();
}
```

**Note:** Even though coupons are publicly readable, the actual discount is always calculated server-side. A user can see coupon codes, but they can't fake a discount because the server re-validates everything during order creation.

If you want to hide coupon codes from public reads (so users can't enumerate them), change to:
```javascript
match /coupons/{couponId} {
  allow read: if request.auth != null;   // Logged-in users only
  allow create, update, delete: if isAdmin();
}
```

And handle the validation entirely via the `/api/coupon/validate` route (which reads Firestore server-side using admin SDK).

---

## 9. Firestore Helpers

```typescript
// src/lib/firestore.ts — new functions

// Get all coupons (admin)
export async function getCoupons(): Promise<Coupon[]> {
  const q = query(collection(db, "coupons"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Coupon));
}

// Get coupon by code (for validation)
export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const q = query(
    collection(db, "coupons"),
    where("code", "==", code.toUpperCase()),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Coupon;
}

// Create coupon (admin)
export async function createCoupon(data: Omit<Coupon, "id" | "currentUses" | "usedBy" | "createdAt">): Promise<string> {
  const docRef = await addDoc(collection(db, "coupons"), {
    ...data,
    code: data.code.toUpperCase(),
    currentUses: 0,
    usedBy: [],
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// Update coupon (admin)
export async function updateCoupon(couponId: string, data: Partial<Coupon>): Promise<void> {
  const { id, ...rest } = data as Coupon & { id?: string };
  await updateDoc(doc(db, "coupons", couponId), rest);
}

// Mark coupon as used (after successful payment — server-side)
export async function markCouponUsed(couponId: string, userId: string): Promise<void> {
  await updateDoc(doc(db, "coupons", couponId), {
    currentUses: increment(1),
    usedBy: arrayUnion(userId),
  });
}
```

---

## 10. Implementation Steps (Ordered)

### Step 1: Update Types
- Add `Coupon` interface to `src/types/index.ts`
- Add `PLAN_TIER_MAP` and `PLAN_TIER_LABELS` constants

### Step 2: Firestore Helpers
- Add all coupon CRUD functions to `src/lib/firestore.ts`
- Add `getCouponByCode`, `createCoupon`, `updateCoupon`, `markCouponUsed`

### Step 3: Admin Coupon Page
- Create `/admin/coupons/page.tsx`
- Build the coupon table with DataTable component
- Build Create/Edit coupon modal with form
- Add "Coupons" to admin sidebar

### Step 4: Coupon Validation API
- Create `POST /api/coupon/validate` for client-side preview
- Implement `validateCoupon` logic (server-side utility)

### Step 5: Update Payment APIs
- Update `POST /api/payment/create-order` to accept and validate `couponCode`
- Update `POST /api/payment/verify` to mark coupon as used after success

### Step 6: Update Pricing Page
- Add coupon input UI to pricing cards (appears after clicking "Get Started")
- Wire up validation preview (call `/api/coupon/validate`)
- Show discounted price with original crossed out
- Pass couponCode through the payment flow

### Step 7: Firestore Security Rules
- Add rules for `coupons` collection

### Step 8: Seed Data (Optional)
- Add sample coupons for testing

---

## 11. Edge Cases

| Scenario | Behavior |
|----------|----------|
| User applies coupon, then switches plan | Re-validate the coupon for the new plan — may become invalid if plan tier is too low |
| Coupon gives 100% discount (free plan) | Razorpay minimum is ₹1. Either: skip Razorpay and directly activate, or set floor to ₹1 |
| Two users try to use the last remaining coupon simultaneously | Firestore increment is atomic — one will succeed, the other will fail on next validation |
| Coupon code with mixed case | Always convert to uppercase on both input and storage |
| Admin edits coupon while user has it applied | Server re-validates on create-order — will catch any changes |
| Flat discount exceeds plan price | Cap discount at plan price (finalPrice = 0, handle as free plan) |
| User refreshes page after applying coupon | Coupon state is lost (client-side only until payment). User needs to re-apply. This is fine. |

---

## 12. Files to Create/Modify

| File | Action |
|------|--------|
| `src/types/index.ts` | Modify — add Coupon interface, plan tier constants |
| `src/lib/firestore.ts` | Modify — add coupon CRUD helpers |
| `src/app/admin/coupons/page.tsx` | **Create** — admin coupon management page |
| `src/app/admin/layout.tsx` | Modify — add Coupons link to sidebar |
| `src/app/api/coupon/validate/route.ts` | **Create** — coupon validation endpoint |
| `src/app/api/payment/create-order/route.ts` | Modify — accept couponCode, validate, adjust amount |
| `src/app/api/payment/verify/route.ts` | Modify — mark coupon as used after success |
| `src/app/(public)/pricing/page.tsx` | Modify — add coupon input UI, discounted price display |
| `scripts/seed.ts` | Modify — add sample coupons |

---

## 13. Future Enhancements (Not in Scope Now)

- **Coupon analytics:** Dashboard showing redemption rates, revenue impact
- **Auto-generated codes:** Bulk generate unique codes (e.g., for a campaign)
- **User-specific coupons:** Assign coupon to a specific user (birthday discount)
- **First-purchase-only coupons:** Only valid if user has never bought a plan before
- **Stackable coupons:** Allow multiple coupons (complex — avoid for now)
