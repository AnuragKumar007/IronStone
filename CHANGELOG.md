# IronStone — Development Log

> Daily progress tracker. Updated at the end of each working session.

---

## Day 1 — 2026-04-10

### What was done
- Created separate Firebase project (`ironstone-91903`) — independent from ProgressTracker
- Configured `.env.local` with Firebase client SDK keys, Admin SDK service account key, and Razorpay/Resend placeholders
- Enabled Firebase Auth (Email/Password + Google OAuth) and Firestore (test mode, asia-south1)
- Fixed auth flow — login and signup now properly redirect to `/home`
- Added client-side route protection:
  - `(protected)` layout redirects unauthenticated users to `/login`
  - `(auth)` layout redirects authenticated users to `/home`
- Fixed COOP header in `next.config.ts` for Google popup auth
- Fixed Navbar — auth-aware links (Home only shows when logged in), logout button, removed dead `/house` route
- Deleted duplicate `house` page
- Wrapped `setSessionCookie` in try-catch so login doesn't break if admin SDK is unavailable
- Added debug logging to AuthContext (can be removed later)

### Phase 2 — Design System & Common Components
- Built 8 UI components in `src/components/ui/`:
  - `Badge` — status/category pill (success, warning, danger, info, neutral)
  - `Button` — 4 variants (primary/secondary/outline/ghost), 3 sizes, loading state
  - `Input` — form input with label, icon, error, uses `.auth-input` CSS
  - `Card` — 3 variants (default/featured/interactive), 3 padding sizes
  - `SectionHeader` — page section heading with label, title, subtitle
  - `Modal` — dialog overlay with GSAP animation, Escape key, scroll lock
  - `DataTable` — generic data table stub for admin (Phase 6)
  - `ImageUpload` — drag-and-drop uploader stub for admin (Phase 6)
- Created barrel export `src/components/ui/index.ts`
- Created `PageWrapper` shared layout component
- Moved `Navbar` and `Footer` to `src/components/shared/`
- Updated all import paths across layouts and pages

### Phase 3 — Content Pages & Firestore Integration
- Created `src/lib/firestore.ts` with typed fetch helpers (getTrainers, getEquipment, getGalleryImages, getPricingPlans)
- Created `scripts/seed.ts` — populates Firestore with dev data (6 trainers, 12 equipment, 12 gallery, 4 pricing plans)
- Refactored card components: TrainerCard (`image` → `photoUrl`), EquipmentCard (`image` → `imageUrl`), GalleryCard (`image` → `imageUrl`)
- Refactored Trainers page — Firestore fetch, loading skeletons, Button CTA
- Refactored Equipment page — Firestore fetch, Button filter pills, dynamic categories, loading skeletons
- Refactored Gallery page — Firestore fetch, replaced inline lightbox with Modal component, loading skeletons
- Refactored Pricing page — Firestore fetch, Badge for plan badges, Button for CTAs, kept Razorpay integration
- Refactored About page — swapped inline CTA with Button component
- Created Contact page — form with Input/Button components, contact info cards, embedded Google Maps
- Updated Navbar + Footer with Contact link
- Added `ContactMessage` type and `badge` field to `PricingPlan` type

### Phase 6 — Admin Panel
- Created admin layout with collapsible sidebar and isAdmin guard (`src/app/admin/layout.tsx`)
- Built AdminSidebar component with mobile drawer, active state, logout
- Created Firebase Storage helpers (`src/lib/storage.ts`) — uploadImage, deleteImage
- Extended Firestore helpers with full CRUD: getUsers, updateUserMembership, add/update/delete for trainers, equipment, gallery, pricing
- Built Dashboard page — 4 stat cards, expiring members table, recent signups table
- Built Members page — search, filter (all/active/expired/noPlan), view details modal, revoke membership
- Built Pricing page — inline editable cards with save per plan
- Built Trainers page — full CRUD, photo upload to Storage, up/down reorder
- Built Equipment page — full CRUD, image upload, category dropdown, reorder
- Built Gallery page — image upload, inline caption editing, delete with Storage cleanup
- Created TrainerForm and EquipmentForm reusable admin components
- Fixed DataTable generic types for admin usage

### Status
- **Phase 1 (Foundation & Auth):** Complete
- **Phase 2 (Design System & Components):** Complete
- **Phase 3 (Content Pages):** Complete (contact API route pending)
- **Phase 4 (Payments & Membership):** Skipped for now
- **Phase 5 (Email Notifications):** Skipped for now
- **Phase 6 (Admin Panel):** Complete

---

## Day 2 — 2026-04-11

### Pricing Page — Trainer Plans Feature
- Added "Gym Only" / "With Trainer" toggle on public pricing page
- Admin can enable/disable the trainer toggle via a switch on `/admin/pricing`
- When disabled, pricing page looks exactly as before — no toggle visible
- When enabled, users see a pill switcher to browse trainer-inclusive plans with different prices and features
- GSAP fade transition when switching between plan types

### Data Model Updates
- Extended `PricingPlan` type with `trainerPrice`, `trainerFeatures`, `trainerHighlighted`, `trainerBadge`
- Added `PricingSettings` interface (`showTrainerPlans: boolean`) backed by `settings/pricing` Firestore document
- Added `membershipType: "gym" | "trainer" | null` to `UserData` — tracks which plan type was purchased

### Admin Pricing Page Rebuild
- Added global toggle switch at top to control trainer plan visibility
- Each plan card now has two-column layout: Gym Only (left) and With Trainer (right)
- Both columns have independent price, features, badge, and highlighted fields
- Single "Save Changes" button per plan saves all fields together
- Fixed badge save logic — now saves empty string instead of `undefined` so Firestore always writes the field

### Firestore Helpers
- Added `getPricingSettings()` and `updatePricingSettings()` in `src/lib/firestore.ts`
- Added `membershipType` mapping in `getUsers()` for admin members display

### Payment Flow Updates
- `POST /api/payment/create-order` — accepts `planType`, includes it in Razorpay order notes/receipt
- `POST /api/payment/verify` — saves `membershipType` ("gym" or "trainer") to user document on successful payment
- Pricing page sends correct price based on active plan type through checkout

### Membership Type Display
- Profile page — shows "With Trainer" badge next to plan name when applicable
- Home dashboard — shows "With Trainer" badge on membership status card
- Admin Members page — plan column shows "+ Trainer" suffix, detail modal shows "Plan Type" row

### Coupon / Discount System
- Built full coupon system — admin creates coupons, users apply at checkout for discounted pricing
- Plan tier hierarchy: monthly(1) < quarterly(2) < halfYearly(3) < yearly(4)
- `minPlanTier` restriction prevents using premium coupons on cheaper plans
- One-time use per user — `usedBy` array tracks UIDs, blocks repeat usage
- Supports percentage and flat (₹) discount types
- Server-side validation in two places: `/api/coupon/validate` (preview) and `/api/payment/create-order` (enforced)
- After successful payment, coupon marked as used atomically via `FieldValue.increment` + `arrayUnion`

### Coupon Data Model
- Added `Coupon` interface: code, discountType, discountValue, minPlanTier, maxUses, currentUses, usedBy, expiresAt, isActive
- Added `PLAN_TIER_MAP` and `PLAN_TIER_LABELS` constants for plan hierarchy
- Firestore collection: `coupons/{couponId}`

### Admin Coupons Page (`/admin/coupons`) — NEW
- DataTable listing all coupons with code, discount, min plan, uses, expiry, status badges
- Create/Edit modal: code, discount type toggle (% / flat), value, min plan dropdown, max uses, expiry date, active toggle
- Delete per coupon with confirmation
- Added "Coupons" link to admin sidebar (between Pricing and Trainers)

### Checkout Confirmation Modal
- Clicking "Get Started" on pricing page now opens a confirmation modal instead of going straight to Razorpay
- Modal shows: plan summary, optional coupon input with "Apply" button
- Applied coupon: green success state, original price crossed out, discount amount, savings, final price
- "Proceed to Payment" button with final price sends to Razorpay
- User can skip coupon and pay full price, or remove an applied coupon

### API Routes (Coupon)
- `POST /api/coupon/validate` — NEW — validates coupon code against plan, returns discount preview
- `POST /api/payment/create-order` — updated — accepts `couponCode`, re-validates server-side, creates Razorpay order with discounted amount
- `POST /api/payment/verify` — updated — marks coupon as used after successful payment

### Planning
- Created `plans/PRICING_WITH_TRAINERS_PLAN.md` — full implementation plan for trainer pricing feature
- Created `plans/COUPON_SYSTEM_PLAN.md` — full implementation plan for coupon/discount system

### Files Created
- `src/app/admin/coupons/page.tsx` — admin coupon management page
- `src/app/api/coupon/validate/route.ts` — coupon validation endpoint

### Files Modified
- `src/types/index.ts` — PricingPlan, PricingSettings, UserData, Coupon, plan tier constants
- `src/lib/firestore.ts` — settings helpers, membershipType in getUsers, coupon CRUD helpers
- `src/app/(public)/pricing/page.tsx` — toggle + dual card rendering + checkout modal with coupon input
- `src/app/admin/pricing/page.tsx` — full rebuild with two-column layout + settings toggle
- `src/app/api/payment/create-order/route.ts` — planType + couponCode support with server-side validation
- `src/app/api/payment/verify/route.ts` — membershipType save + mark coupon as used
- `src/app/(public)/profile/page.tsx` — trainer badge
- `src/app/(protected)/home/page.tsx` — trainer badge
- `src/app/admin/members/page.tsx` — plan type column + modal field
- `src/components/admin/AdminSidebar.tsx` — added Coupons nav link

### Status
- **Phase 1 (Foundation & Auth):** Complete
- **Phase 2 (Design System & Components):** Complete
- **Phase 3 (Content Pages):** Complete (contact API route pending)
- **Phase 4 (Payments & Membership):** Skipped for now
- **Phase 5 (Email Notifications):** Skipped for now
- **Phase 6 (Admin Panel):** Complete
- **Trainer Pricing Feature:** Complete
- **Coupon System:** Complete

---

## Day 3 — 2026-04-11 (Anurag)

### Landing Page Responsiveness & UI Polishing
- Rebuilt `HeroSection` typography using a fluid scaling syntax (`text-[3.5rem]` to `7rem`) to handle all portrait/landscape mobile sizes seamlessly
- Fixed the stat bar overlap on Hero text by clamping bottom padding (`pb-32 h-full my-auto`)
- Converted the Hero section bottom statistics panel into a rigid CSS grid (`grid-cols-2 md:grid-cols-4`) for a perfect 2x2 mobile display mapping without weird wrapping
- Consolidated hardcoded padding into standard theme containers (`container mx-auto px-6 md:px-12`) across all addressed sections

### Smooth Scrolling & Animation Fixes
- Implemented dual-layer smooth scroll sync (`LenisScrollTriggerSync()`) in `SmoothScroll.tsx` to align React state and GSAP ticker synchrony, officially squashing the "black background on scroll down" rendering failure
- Fixed GSAP memory leaks inside `WorkoutPlansSection` by encasing the scroll timeline in a deterministic `gsap.context()` block
- Restored standard un-mounting teardown logic with `ctx.revert()` 
- Added Math clamping against the Lottie player `goToAndStop(Math.min(..., 162))` to prevent breaking frame execution bounds mapping
- Updated color theme variables to adhere strictly to `PROJECT_RULES.md` inside `WorkoutPlansSection`, purging invalid raw hex values

### Mobile Navigation Overhaul
- Migrated the mobile hamburger menu in `Navbar` from an awkward 280px side-drawer trick directly into a polished, sleek full-screen modal overlay matching the reference theme
- Instantly eliminated sluggish CSS transitions driving the mobile menu wrapper swapping them for immediate DOM block `flex/hidden` structural logic (giving instant visual tap feedback)
- Hard-injected the primary `IronStone` brand logo directly inside the expanded full-screen menu overlay's header alongside the close-out button
- Scaled up typography inside the menu layout substantially spanning down mobile screen height correctly (`text-lg md:text-xl`)
- Removed accidental horizontal scrollbars and text bleeding on iOS/Mobile by affixing strong `overflow-x-hidden` policies to `<body/>` element strings and `<main>` borders

### Navbar Hide-on-Scroll & Hamburger Fix
- Implemented hide-on-scroll behavior: navbar slides up (`translateY(-100%)`) when scrolling down past 80px, and returns on any scroll up.
- Fixed hamburger accessibility issue: extracted the hamburger button out of the scroll-hiding navbar wrapper into its own independent `fixed` element (`z-[110]`) so it remains always visible on mobile even when the navbar is hidden.
- The floating hamburger automatically hides when the full-screen mobile menu is open (X button inside the overlay replaces it).
- Does not interfere with desktop layout (hidden via `lg:hidden`).
- Renamed `FloatingImagesSection.tsx` to `WorkoutWithSection.tsx` for cleaner abstraction.
- Fixed the background red gradient glowing effect positioning on smaller viewports (`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2` map).
- Refined the red glow intensity on mobile: reduced the physical size of the blobs, dropped blur to `80px`, and lowered opacity to perfectly match the aesthetic contrast ratio of the laptop view.
- Adjusted the overall height bounding so it stays globally fixed at `min-h-[100vh]` across both mobile and desktop screens as requested.
- Switched hardcoded color values to global Tailwind variables matching the central theme.
- Fixed floating parallax layout on mobile elements logic by binding coordinates natively rather than static boxes.
- Added deterministic `gsap.context()` closure for flawless teardowns matching previous phase rules.

### Navbar UI Tweaks
- Removed social media icons from the desktop navbar (they remain inside the mobile hamburger menu drawer).
- Updated the desktop auth button label from "Login" to "Login / Signup" for clearer UX.

### Define Goals Section Responsiveness
- Traced the actual root cause of oversized text: the global `.text-area` CSS class in `globals.css` had a hardcoded `font-size: 10rem` which overrode all Tailwind responsive classes on the component.
- Fixed by replacing the static font-size with `12vw` for mobile viewport and adding `@media` breakpoints (`768px → 5rem`, `1024px → 7rem`) to restore full desktop sizing.
- Removed the now-redundant Tailwind font-size classes from the component since `globals.css` now handles responsiveness natively.

### Reviews Section Rebuild
- Completely rebuilt `ReviewsCarousel.tsx` from the ground up, replacing the broken 3D perspective carousel with a clean, responsive card grid layout.
- Designed the `Review` interface to mirror the Google Places API review object (`author_name`, `profile_photo_url`, `rating`, `relative_time_description`, `text`) for seamless future integration with real Google Reviews.
- Added 6 realistic mock reviews with Indian names and gym-specific content.
- Built a Google Rating Summary bar at the top showing the aggregate score, star visualization, and review count.
- Cards use `bg-surface-100 border-zinc-800 rounded-3xl` per PROJECT_RULES. Hover state follows `hover:border-zinc-700` rule.
- Avatar falls back to a red initials circle when no `profile_photo_url` is provided (matching future API behavior).
- Each card displays a Google icon to visually indicate review source.
- GSAP staggered scroll-triggered entrance animation wrapped in `gsap.context()` for safe cleanup.
- Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop with `gap-6 md:gap-8`.
- "View All Reviews" / "Show Less" toggle button with theme-consistent outline styling.
- Removed all external stock photo URLs and lorem ipsum placeholder text.

### Files Modified
- `src/app/page.tsx` — Updated component import maps.
- `src/components/WorkoutWithSection.tsx` — Overhauled component sizing parameters and background centering.
- `src/components/DefineGoalsSection.tsx` — Fixed font rendering constraints scaling typography via viewport constraints on smaller devices.
- `src/components/ReviewsCarousel.tsx` — Full rebuild with Google Reviews-ready data structure and responsive card grid.

### Status
- **Phase 1 (Foundation & Auth):** Complete
- **Phase 2 (Design System & Components):** Complete
- **Phase 3 (Content Pages):** Complete (contact API route pending)
- **Phase 4 (Payments & Membership):** Skipped for now
- **Phase 5 (Email Notifications):** Skipped for now
- **Phase 6 (Admin Panel):** Complete
- **Trainer Pricing Feature:** Complete
- **Coupon System:** Complete
- **Landing Page Responsiveness:** In Progress
