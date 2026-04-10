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
