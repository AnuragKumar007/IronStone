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

### Status
- **Phase 1 (Foundation & Auth):** Complete
- **Phase 2 (Design System & Components):** Complete
- **Phase 3 (Content Pages):** Not started
