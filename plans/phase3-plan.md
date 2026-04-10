# Phase 3: Content Pages — Firestore Integration + UI Refactor + Contact Page

> **Status:** Not started  
> **Depends on:** Phase 2 (complete)  
> **Blocks:** Phase 4 (Payments & Membership)

---

## Goal
Wire all content pages to Firestore, refactor to use Phase 2 UI components, and build the missing Contact page.

---

## Steps

### 1. Update Types (`src/types/index.ts`)
- Add `badge?: string` to `PricingPlan`
- Add `ContactMessage` interface

### 2. Firestore Helpers (`src/lib/firestore.ts`) — NEW
- `getTrainers()`, `getEquipment()`, `getGalleryImages()`, `getPricingPlans()`
- All typed, ordered queries using client SDK

### 3. Seed Script (`scripts/seed.ts`) — NEW
- Populate Firestore with dev data from existing hardcoded arrays
- Idempotent (safe to run multiple times)
- Run: `npx tsx scripts/seed.ts`

### 4. Refactor Card Components
- **TrainerCard:** `image` → `photoUrl`, use `Badge`
- **EquipmentCard:** `image` → `imageUrl`, use `Badge`
- **GalleryCard:** `image` → `imageUrl`

### 5. Refactor Content Pages
- **Trainers:** Firestore fetch + loading skeletons + `Button` for CTA
- **Equipment:** Firestore fetch + `Button` for filters + loading skeletons
- **Gallery:** Firestore fetch + `Modal` for lightbox + loading skeletons
- **Pricing:** Firestore fetch + `Badge` + `Button` (keep Razorpay)
- **About:** Light touch — swap inline CTA with `Button`

### 6. Contact Page — NEW
- **Page:** `Input` form + `Button` + `PageHero` + contact info + map
- **API:** `POST /api/contact` → write to Firestore `contactMessages`

### 7. Update Navigation
- Add "Contact" to Navbar + Footer links

---

## Files (15 total)
- 2 new files: `src/lib/firestore.ts`, `scripts/seed.ts`
- 2 new pages: `src/app/(public)/contact/page.tsx`, `src/app/api/contact/route.ts`
- 11 edits: types, 3 cards, 5 pages, Navbar, Footer
