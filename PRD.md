# IronStone — Product Requirements Document (PRD)

> **Version:** 1.0  
> **Last Updated:** 2026-04-02  
> **Status:** Draft  
> **Owner:** Abhinav Singh

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [User Personas](#3-user-personas)
4. [Design System](#4-design-system)
5. [Common Components Library](#5-common-components-library)
6. [Page-by-Page Specifications](#6-page-by-page-specifications)
7. [API Routes & Contracts](#7-api-routes--contracts)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [Database Schema](#9-database-schema)
10. [Payment Flow](#10-payment-flow)
11. [Email Notifications](#11-email-notifications)
12. [Admin Panel](#12-admin-panel)
13. [Performance & SEO](#13-performance--seo)
14. [Security Requirements](#14-security-requirements)
15. [Implementation Phases](#15-implementation-phases)

---

## 1. Product Overview

### What is IronStone?

IronStone is a full-stack gym membership website for a fitness center. It serves as both a **marketing site** (attracting new members) and a **member portal** (managing memberships, payments, profiles).

### Core Problems Solved

| For | Problem | Solution |
|-----|---------|----------|
| Gym Owner | Manual membership tracking, no online presence | Admin dashboard, automated payments, member management |
| Potential Members | No way to explore gym online before visiting | Public pages: trainers, equipment, gallery, pricing |
| Existing Members | No self-service for membership renewal | Profile page with plan status, online payment via Razorpay |

### Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 16 (App Router) | SSR, API routes, middleware, route groups |
| Language | TypeScript | Type safety across frontend + backend |
| Styling | Tailwind CSS v4 | Design tokens via `@theme`, utility-first |
| Animations | GSAP + Lenis | Scroll-driven animations, smooth scrolling  |
| Database | Firebase Firestore | Real-time sync, no server to manage |
| Auth | Firebase Auth | Email/password + Google OAuth out of the box |
| Storage | Firebase Storage | Trainer photos, equipment images, gallery |
| Payments | Razorpay | India-focused, supports UPI/cards/netbanking |
| Email | Resend | Transactional emails with React templates |
| Icons | Lucide Icon (CDN) | Consistent icon set across the app |
| Fonts | Geist Sans + Geist Mono | Clean, modern typography via `next/font` |

---

## 2. Goals & Success Metrics

### Primary Goals

1. **Convert visitors to members** — Clear pricing, compelling gallery/trainer pages, frictionless signup-to-payment flow
2. **Self-service membership management** — Members can view status, renew, update profile without calling the gym
3. **Reduce admin workload** — Dashboard for member management, automated expiry tracking, revenue visibility

### Success Metrics

| Metric | Target |
|--------|--------|
| Signup-to-payment conversion | > 30% of signups complete a purchase within 7 days |
| Page load (LCP) | < 2.5s on 4G mobile |
| Mobile responsiveness | All pages usable on 360px width |
| Admin task time | Member lookup < 10 seconds |

---

## 3. User Personas

### Persona 1: Visitor (Not Logged In)

- **Goal:** Explore the gym — see trainers, equipment, pricing — and decide whether to join
- **Access:** All public pages (`/`, `/about`, `/trainers`, `/equipment`, `/gallery`, `/pricing`, `/contact`)
- **Key action:** Click "Join Now" on pricing page → redirected to `/signup`

### Persona 2: Member (Logged In, role = "user")

- **Goal:** Manage membership, check expiry, renew plan, update profile
- **Access:** All public pages + `/home`, `/profile`
- **Key action:** View membership status on `/home`, renew on `/pricing`, edit info on `/profile`

### Persona 3: Admin (Logged In, role = "admin")

- **Goal:** Manage gym content (trainers, equipment, gallery) and monitor members/revenue
- **Access:** Everything + `/admin/*` routes
- **Key action:** Add trainers, view expiring memberships, edit pricing plans

---

## 4. Design System

### 4.1 Color Palette

All colors are defined as CSS custom properties in `globals.css` via `@theme inline`. **Never use raw hex values in components — always reference these tokens.**

#### Primary — Brand Red (Energy, CTAs, Accents)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#ff0000` | Blob glows, wave borders, primary accents |
| `--color-primary-vivid` | `#ff3333` | Hover highlights |
| `--color-primary-mid` | `#cc0000` | Logo gradient mid, button hovers |
| `--color-primary-dark` | `#660000` | Logo gradient end, deep shadows |

#### Surfaces — Dark Backgrounds
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#000000` | Page background |
| `--color-surface-100` | `#0d0d0d` | Standard cards (Basic/Advance pricing) |
| `--color-surface-200` | `#111111` | Featured cards (Pro pricing) |
| `--color-surface-300` | `#1a1a1a` | Container panels, glass layers, form inputs |

#### Text — Gray Hierarchy
| Token | Value | Usage |
|-------|-------|-------|
| `--color-foreground` | `#ffffff` | Primary headings, labels |
| `--color-muted-bright` | `#B5B5B6` | Section main headings |
| `--color-muted` | `#959597` | Subtitles |
| `--color-muted-dim` | `#919399` | Section supporting text |
| Tailwind `text-gray-300` | `#d1d5db` | Card body text |
| Tailwind `text-gray-400` | `#9ca3af` | Section paragraphs |
| Tailwind `text-gray-500` | `#6b7280` | Footer links, timestamps |

#### Accent — Blue-Violet Gradient (Premium)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-accent-blue` | `#A2C7FF` | Gradient start |
| `--color-accent-indigo` | `#B0BDFF` | Gradient mid |
| `--color-accent-violet` | `#D2AEF9` | Gradient end |

### 4.2 Typography

| Property | Value |
|----------|-------|
| Primary font | Geist Sans (`--font-sans`) |
| Mono font | Geist Mono (`--font-mono`) |
| Loading | `next/font/google` (self-hosted, no CLS) |

#### Type Scale (use Tailwind classes)

| Element | Class | Weight | Tracking |
|---------|-------|--------|----------|
| Page hero heading | `text-5xl md:text-7xl lg:text-8xl` | `font-bold` | `tracking-tight` |
| Section heading | `text-3xl md:text-5xl` | `font-bold` | `tracking-tight` |
| Section subheading | `text-lg md:text-xl` | `font-normal` | default |
| Card title | `text-xl md:text-2xl` | `font-bold` | default |
| Card body | `text-sm md:text-base` | `font-normal` | default |
| Nav links | `text-sm` | `font-bold` | `tracking-widest uppercase` |
| Button text | `text-sm` | `font-bold` | `tracking-wider uppercase` |
| Small labels | `text-xs` | `font-medium` | `tracking-wide uppercase` |

### 4.3 Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-section` | `6rem` (96px) | Vertical padding between page sections |
| Page horizontal padding | `px-6 md:px-12 lg:px-20` | Consistent side margins |
| Container | `container mx-auto` | Max-width content wrapper |
| Card gap | `gap-6 md:gap-8` | Space between card grid items |

### 4.4 Border Radius

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `--radius-card` | `1.5rem` | `rounded-3xl` | Cards, panels |
| `--radius-btn` | `9999px` | `rounded-full` | CTA buttons |
| `--radius-sm` | `0.75rem` | `rounded-xl` | Form inputs, inner buttons |

### 4.5 Transitions

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | `150ms` | Hover color changes |
| `--duration-normal` | `300ms` | Card hover lifts, general transitions |
| `--duration-slow` | `500ms` | Page/drawer animations |

### 4.6 Existing CSS Utility Classes

These are already defined in `globals.css`. Use them instead of writing inline styles:

| Class | Effect |
|-------|--------|
| `.gradient-text` / `.text-gradient-primary` | Blue-violet gradient text |
| `.gradient-border-effect` | Glowing gradient border on hover (use on cards) |
| `.card-hover` | translateY(-5px) + shadow on hover |
| `.review-card` | Same as card-hover with rotation reset |
| `.auth-input` | Dark input field with red focus ring |
| `.auth-btn-primary` | Red gradient CTA button (full width) |
| `.auth-btn-google` | Dark Google SSO button |
| `.auth-divider` | Line — "or" — Line divider |
| `.password-toggle` | Absolute-positioned eye icon button |
| `.perspective-1000` | 3D transform container |
| `.wave-1` / `.wave-2` / `.wave-3` | Pulsing wave animations (staggered) |

### 4.7 Animation Guidelines

| Library | When to Use |
|---------|-------------|
| **GSAP** | Entry animations (elements sliding/fading in on scroll), complex timelines, staggered reveals |
| **Lenis** | Smooth scroll behavior (already wrapped in `SmoothScroll` component) |
| **CSS** | Hover effects, simple transitions, looping animations (waves, sparks) |

**GSAP patterns to follow:**
```tsx
// Scroll-triggered fade-in (use in useEffect or useLayoutEffect)
gsap.from(element, {
  y: 50,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out",
  scrollTrigger: { trigger: element, start: "top 85%" }
});

// Staggered children reveal
gsap.from(children, {
  y: 30,
  opacity: 0,
  duration: 0.6,
  stagger: 0.1,
  ease: "power2.out",
  scrollTrigger: { trigger: container, start: "top 80%" }
});
```

---

## 5. Common Components Library

### 5.1 Components to Build (`src/components/ui/`)

Every shared UI component lives here. They must be **theme-aware** (use design tokens), **responsive**, and **accessible**.

#### Button (`Button.tsx`)

```
Props:
  variant: "primary" | "secondary" | "outline" | "ghost"
  size: "sm" | "md" | "lg"
  fullWidth?: boolean
  loading?: boolean
  icon?: ReactNode (left icon)
  children: ReactNode
  ...native button props

Variants:
  primary   → Red gradient bg (like .auth-btn-primary), white text
  secondary → surface-300 bg, white text, subtle border
  outline   → Transparent bg, zinc-700 border, white text, hover: red border
  ghost     → No bg/border, text only, hover: surface-300 bg

Sizes:
  sm → py-2 px-4 text-xs
  md → py-2.5 px-6 text-sm
  lg → py-3.5 px-8 text-base

Loading state → Spinner icon replacing text, disabled styling
```

#### Card (`Card.tsx`)

```
Props:
  variant: "default" | "featured" | "interactive"
  padding?: "sm" | "md" | "lg"
  children: ReactNode
  className?: string

Variants:
  default     → bg-surface-100, rounded-3xl, standard padding
  featured    → bg-surface-200, gradient-border-effect on hover
  interactive → default + card-hover class (lift on hover)
```

#### Input (`Input.tsx`)

```
Props:
  label: string
  error?: string
  icon?: ReactNode (left icon inside input)
  ...native input props

Structure:
  <label> above input
  .auth-input styling
  Error message in text-red-500 text-xs below
  Icon positioned absolute left
```

#### Modal (`Modal.tsx`)

```
Props:
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: "sm" | "md" | "lg"
  children: ReactNode

Behavior:
  Dark backdrop (bg-black/60 backdrop-blur-sm)
  Centered panel (bg-surface-100, rounded-3xl)
  Close on backdrop click + Escape key
  GSAP scale-in animation on open
  Focus trap for accessibility
```

#### Badge (`Badge.tsx`)

```
Props:
  variant: "success" | "warning" | "danger" | "info" | "neutral"
  size?: "sm" | "md"
  children: ReactNode

Colors:
  success → green-500 bg/text
  warning → amber-500 bg/text
  danger  → red-500 bg/text
  info    → blue-500 bg/text
  neutral → gray-500 bg/text

Style: Subtle bg with matching text (e.g., bg-green-500/10 text-green-500)
```

#### SectionHeader (`SectionHeader.tsx`)

```
Props:
  label?: string        (small uppercase label above heading, like "OUR TEAM")
  title: string         (main heading)
  subtitle?: string     (paragraph below heading)
  align?: "left" | "center"
  gradient?: boolean    (apply .gradient-text to title)

Purpose: Consistent section heading across all pages — avoids repeating
the same heading markup everywhere.
```

#### DataTable (`DataTable.tsx`) — For Admin

```
Props:
  columns: { key: string, label: string, render?: (row) => ReactNode }[]
  data: any[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row) => void

Features:
  Dark themed rows (alternating surface-100/surface-200)
  Responsive: horizontal scroll on mobile
  Loading skeleton rows
  Empty state message
```

#### ImageUpload (`ImageUpload.tsx`) — For Admin

```
Props:
  onUpload: (file: File) => Promise<string>  (returns URL)
  currentUrl?: string
  accept?: string
  maxSizeMB?: number

Features:
  Drag-and-drop zone
  Preview of current/selected image
  Upload progress indicator
  File size validation
```

### 5.2 Shared Layout Components (`src/components/shared/`)

#### Navbar (`Navbar.tsx`) — EXISTS, needs updates

**Current state:** Functional with desktop/mobile, auth-aware, GSAP entrance animation.

**Required updates for Phase 2:**
- Update `navLinks` array to match final route structure
- Add active indicator animation (red underline slide)
- Add profile avatar dropdown for logged-in users (links to `/profile`, `/admin` if admin, logout)
- Ensure `Contact` link is added

#### Footer (`Footer.tsx`) — EXISTS on landing page

**Required updates:**
- Extract into `src/components/shared/Footer.tsx` if not already
- Include: logo, navigation links, social links, contact info, copyright
- Responsive: 4-column grid on desktop → stacked on mobile

#### PageWrapper (`PageWrapper.tsx`)

```
Purpose: Wraps every page with consistent top padding (to clear fixed navbar)
and section spacing.

Props:
  children: ReactNode
  className?: string

Structure:
  <main className="pt-24 min-h-screen">  ← clears 80px navbar
    {children}
  </main>
```

### 5.3 Component File Convention

```
src/components/ui/Button.tsx      → export default function Button()
src/components/ui/Card.tsx        → export default function Card()
src/components/ui/Input.tsx       → export default function Input()
src/components/ui/Modal.tsx       → export default function Modal()
src/components/ui/Badge.tsx       → export default function Badge()
src/components/ui/SectionHeader.tsx
src/components/ui/DataTable.tsx
src/components/ui/ImageUpload.tsx
src/components/ui/index.ts        → re-export all components

src/components/shared/Navbar.tsx   → EXISTS
src/components/shared/Footer.tsx
src/components/shared/PageWrapper.tsx
```

**`src/components/ui/index.ts` barrel export:**
```ts
export { default as Button } from "./Button";
export { default as Card } from "./Card";
// ... etc
```

This allows: `import { Button, Card, Badge } from "@/components/ui";`

---

## 6. Page-by-Page Specifications

### 6.1 Landing Page — `/` (EXISTS)

**Status:** Built and functional.

**Sections (in order):**
1. Hero — Full-screen with headline, CTA, background animation
2. Workout Plans — Card grid of training programs
3. Define Your Goals — Large reactive text with cursor spotlight
4. Floating Images — Parallax image section
5. Membership — Pricing overview (links to `/pricing`)
6. Reviews Carousel — Testimonial slider
7. Download App — CTA section
8. Reach Us / Contact — Wave animation, contact info
9. Footer

**No changes needed** — this page is the reference for the design language.

---

### 6.2 About Page — `/about`

**Route:** `src/app/(public)/about/page.tsx`  
**Auth:** Public  
**Navbar:** Yes  
**Footer:** Yes

**Sections:**

1. **Hero Banner**
   - Full-width image/video background (gym interior)
   - Overlay heading: "Our Story"
   - Subtitle: Brief tagline

2. **Our Story**
   - Two-column: Image left, text right
   - Founding story, mission, what makes IronStone different
   - GSAP fade-in on scroll

3. **Core Values**
   - 3-4 value cards in a grid
   - Each card: icon + title + short description
   - Values: Discipline, Community, Results, Excellence (customize)
   - Use `Card` component with `interactive` variant

4. **Stats / Numbers**
   - Horizontal row of animated counters
   - Examples: "500+ Members", "15+ Trainers", "50+ Equipment", "5 Years"
   - GSAP countUp animation on scroll

5. **Why Choose Us**
   - Feature list with icons
   - 6 items in 2x3 or 3x2 grid
   - Examples: "State-of-art Equipment", "Personal Training", "Flexible Plans", "Clean Facility", "Expert Trainers", "Community Events"

6. **CTA Section**
   - "Ready to Transform?" heading
   - Two buttons: "View Pricing" → `/pricing`, "Contact Us" → `/contact`

---

### 6.3 Trainers Page — `/trainers`

**Route:** `src/app/(public)/trainers/page.tsx`  
**Auth:** Public  
**Data Source:** Firestore `trainers` collection, ordered by `order` field

**Sections:**

1. **Section Header**
   - Label: "OUR TEAM"
   - Title: "Expert Trainers"
   - Subtitle: "Meet the professionals who'll guide your fitness journey"

2. **Trainer Card Grid**
   - Responsive grid: 1 col mobile, 2 col tablet, 3-4 col desktop
   - Each card:
     ```
     ┌─────────────────────────┐
     │  [Trainer Photo]        │  ← aspect-[3/4], object-cover
     │                         │
     ├─────────────────────────┤
     │  Name                   │  ← text-xl font-bold
     │  Specialization         │  ← text-red-500 text-sm uppercase
     │  Experience             │  ← text-gray-400 text-sm
     │  Bio (truncated)        │  ← text-gray-300 text-sm, line-clamp-3
     └─────────────────────────┘
     ```
   - Card component: `interactive` variant
   - GSAP staggered entrance animation
   - Loading state: skeleton cards

3. **CTA**
   - "Want personal training? Contact us" → `/contact`

---

### 6.4 Equipment Page — `/equipment`

**Route:** `src/app/(public)/equipment/page.tsx`  
**Auth:** Public  
**Data Source:** Firestore `equipment` collection, ordered by `order` field

**Sections:**

1. **Section Header**
   - Label: "OUR FACILITY"
   - Title: "World-Class Equipment"
   - Subtitle: "Everything you need for a complete workout"

2. **Category Filter**
   - Horizontal scrollable pill/tag buttons
   - Categories derived from data: "All", "Cardio", "Strength", "Free Weights", "Machines", etc.
   - Active pill: red bg, white text
   - Inactive pill: surface-300 bg, gray text

3. **Equipment Card Grid**
   - Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
   - Each card:
     ```
     ┌─────────────────────────┐
     │  [Equipment Image]      │  ← aspect-video, object-cover
     ├─────────────────────────┤
     │  Category Badge         │  ← Badge component, "neutral" variant
     │  Equipment Name         │  ← text-lg font-bold
     │  Description            │  ← text-gray-400 text-sm, line-clamp-2
     └─────────────────────────┘
     ```
   - Use `Card` component with `interactive` variant

---

### 6.5 Gallery Page — `/gallery`

**Route:** `src/app/(public)/gallery/page.tsx`  
**Auth:** Public  
**Data Source:** Firestore `gallery` collection, ordered by `uploadedAt` desc

**Sections:**

1. **Section Header**
   - Label: "GALLERY"
   - Title: "Inside IronStone"
   - Subtitle: "Take a virtual tour of our facility"

2. **Masonry/Grid Gallery**
   - CSS grid with varying row spans for visual interest
   - Or: uniform grid (simpler) — 2 col mobile, 3 col tablet, 4 col desktop
   - Each item:
     - Image with rounded-xl, object-cover
     - Hover overlay: dark gradient + caption text + zoom icon
     - Click: opens lightbox modal
   - GSAP staggered fadeInUp animation
   - Loading: skeleton shimmer placeholders

3. **Lightbox Modal**
   - Full-screen dark overlay
   - Large image centered
   - Caption below image
   - Prev/Next navigation arrows
   - Close on backdrop click or Escape
   - Keyboard arrow navigation

---

### 6.6 Pricing Page — `/pricing`

**Route:** `src/app/(public)/pricing/page.tsx`  
**Auth:** Public (but "Buy Now" requires login)  
**Data Source:** Firestore `pricing` collection

**Sections:**

1. **Section Header**
   - Label: "MEMBERSHIP"
   - Title: "Choose Your Plan"
   - Subtitle: "Flexible plans to match your fitness goals"

2. **Pricing Cards**
   - 4 cards in a row (responsive: 1 mobile, 2 tablet, 4 desktop)
   - Layout per card:
     ```
     ┌───────────────────────────┐
     │  Plan Name                │  ← text-xl font-bold
     │  ₹ Price /month           │  ← text-4xl font-bold
     │  Duration: X days         │  ← text-gray-400
     │                           │
     │  ✓ Feature 1              │
     │  ✓ Feature 2              │  ← features list from Firestore
     │  ✓ Feature 3              │
     │                           │
     │  [ Get Started ]          │  ← Button component
     └───────────────────────────┘
     ```
   - Highlighted plan (most popular): `featured` Card variant with gradient border, slightly scaled up, "MOST POPULAR" badge
   - Non-highlighted: `default` Card variant
   - "Get Started" button behavior:
     - If logged out → redirect to `/login?redirect=/pricing`
     - If logged in → trigger Razorpay checkout popup

3. **FAQ Section** (optional)
   - Accordion component with common questions
   - "Can I switch plans?", "What payment methods?", "Cancellation policy?"

---

### 6.7 Contact Page — `/contact`

**Route:** `src/app/(public)/contact/page.tsx`  
**Auth:** Public

**Sections:**

1. **Section Header**
   - Label: "GET IN TOUCH"
   - Title: "Contact Us"

2. **Two-Column Layout**
   - **Left: Contact Form**
     - Fields: Name, Email, Phone, Message (textarea)
     - Submit button (primary variant)
     - On submit: could send email via Resend API route, or store in Firestore `contactMessages` collection
     - Success toast/message after submission
   - **Right: Contact Info + Map**
     - Address with icon
     - Phone number with icon
     - Email with icon
     - Operating hours
     - Embedded Google Maps iframe (or static map image)

3. **Social Links Row**
   - Instagram, Facebook, Twitter/X icons
   - Consistent with Navbar social icons

---

### 6.8 Login Page — `/login` (EXISTS)

**Status:** Built and functional.  
**Features:** Email/password, Google SSO, forgot password modal, animated muscle character progress indicator, redirect after login.

**No major changes needed.** Minor improvements:
- Support `?redirect=` query param to return user to intended page after login
- Ensure error messages are clear and specific

---

### 6.9 Signup Page — `/signup` (EXISTS)

**Status:** Built and functional.  
**Features:** Username, email, phone, password fields, Google SSO, 4-field progress tracker with muscle animation.

**No major changes needed.**

---

### 6.10 Home/Dashboard — `/home` (EXISTS)

**Route:** `src/app/(protected)/home/page.tsx`  
**Auth:** Protected (must be logged in)

**Status:** Built with membership status card and quick action grid.

**Required updates:**
- Ensure quick action links point to correct routes
- Add greeting with user's name
- Show membership expiry countdown if active
- Show "No active plan" CTA if membership is null

---

### 6.11 Profile Page — `/profile`

**Route:** `src/app/(public)/profile/page.tsx` (move to `(protected)` group)  
**Auth:** Protected

**Sections:**

1. **Profile Header**
   - User avatar (initials circle or uploaded photo)
   - Name, email, member since date
   - Edit profile button

2. **Membership Status Card**
   - Current plan name + badge (active/expired)
   - Start date, expiry date
   - Days remaining countdown (visual progress bar)
   - If expired/none: "Renew Now" button → `/pricing`

3. **Personal Information**
   - Editable form: Name, Phone, Email (read-only)
   - Save button updates Firestore `users/{uid}`

4. **Payment History** (future enhancement)
   - List of past payments with date, amount, plan
   - Razorpay payment IDs for reference

---

## 7. API Routes & Contracts

### 7.1 Auth Session

#### `POST /api/auth/session` (EXISTS)
```
Request:  { idToken: string }
Response: { success: true } + sets HttpOnly cookie
Purpose:  Exchange Firebase ID token for server-side session cookie
```

#### `DELETE /api/auth/session` (EXISTS)
```
Request:  (no body)
Response: { success: true } + clears cookie
Purpose:  Logout — remove session cookie
```

### 7.2 Payments

#### `POST /api/payment/create-order`
```
Request:
{
  planId: string,         // Firestore pricing doc ID
  userId: string          // Firebase UID
}

Response:
{
  orderId: string,        // Razorpay order ID
  amount: number,         // in paise
  currency: "INR",
  planName: string
}

Logic:
1. Validate user is authenticated (check session cookie)
2. Fetch plan from Firestore `pricing/{planId}`
3. Create Razorpay order via server SDK
4. Return order details for frontend checkout popup
```

#### `POST /api/payment/verify`
```
Request:
{
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  planId: string,
  userId: string
}

Response:
{
  success: true,
  membership: {
    plan: string,
    start: string,       // ISO date
    expiry: string       // ISO date
  }
}

Logic:
1. Verify HMAC signature (razorpay_secret + order_id + "|" + payment_id)
2. On valid: update Firestore users/{userId} with:
   - membershipPlan, membershipStart, membershipExpiry, isActive: true, razorpayPaymentId
3. Send confirmation email via Resend
4. Return success with membership details
```

### 7.3 Contact (New)

#### `POST /api/contact`
```
Request:
{
  name: string,
  email: string,
  phone?: string,
  message: string
}

Response: { success: true }

Logic:
1. Validate fields (name, email, message required)
2. Store in Firestore `contactMessages` collection
3. Send notification email to gym owner via Resend
```

---

## 8. Authentication & Authorization

### 8.1 Auth Flow

```
Signup:
  1. User fills form → Firebase createUserWithEmailAndPassword()
  2. Create Firestore doc: users/{uid} with role:"user", isActive:false
  3. Get ID token → POST /api/auth/session → HttpOnly cookie set
  4. Redirect to /home

Login:
  1. Email/password → Firebase signInWithEmailAndPassword()
     OR Google → signInWithPopup(GoogleAuthProvider)
  2. Get ID token → POST /api/auth/session → HttpOnly cookie set
  3. Redirect to /home (or ?redirect= param)

Logout:
  1. Firebase signOut()
  2. DELETE /api/auth/session → cookie cleared
  3. Redirect to /
```

### 8.2 Route Protection (middleware.ts)

```
Public routes (no auth needed):
  /, /about, /trainers, /equipment, /gallery, /pricing, /contact

Auth routes (redirect to /home if logged in):
  /login, /signup

Protected routes (redirect to /login if not logged in):
  /home, /profile

Admin routes (redirect to /home if not admin):
  /admin, /admin/*

API routes:
  /api/payment/* → validate session cookie
  /api/auth/*    → no middleware (handles its own auth)
  /api/contact   → no auth needed (public form)
```

### 8.3 AuthContext (`src/context/AuthContext.tsx`) — EXISTS

Provides `useAuth()` hook returning:
```ts
{
  user: UserData | null,   // Full Firestore user data
  loading: boolean,        // True while checking auth state
  firebaseUser: User | null // Raw Firebase Auth user
}
```

Real-time listener on `users/{uid}` doc — membership changes reflect instantly.

---

## 9. Database Schema

### 9.1 Firestore Collections

#### `users/{uid}` (EXISTS in types)
| Field | Type | Description |
|-------|------|-------------|
| uid | `string` | Firebase Auth UID |
| name | `string` | Display name |
| email | `string` | Email address |
| phone | `string` | Phone number (no OTP) |
| role | `"user" \| "admin"` | Access level |
| membershipPlan | `"monthly" \| "quarterly" \| "halfYearly" \| "yearly" \| null` | Current plan |
| membershipStart | `Timestamp \| null` | Plan start date |
| membershipExpiry | `Timestamp \| null` | Plan expiry date |
| isActive | `boolean` | Has active membership |
| razorpayPaymentId | `string \| null` | Last payment reference |
| createdAt | `Timestamp` | Account creation date |

#### `trainers/{id}`
| Field | Type | Description |
|-------|------|-------------|
| id | `string` | Auto-generated doc ID |
| name | `string` | Trainer full name |
| specialization | `string` | e.g., "Strength Training", "Yoga" |
| bio | `string` | Short biography (2-3 sentences) |
| experience | `string` | e.g., "8 Years" |
| photoUrl | `string` | Firebase Storage URL |
| order | `number` | Display order (lower = first) |

#### `equipment/{id}`
| Field | Type | Description |
|-------|------|-------------|
| id | `string` | Auto-generated doc ID |
| name | `string` | Equipment name |
| description | `string` | Short description |
| category | `string` | e.g., "Cardio", "Strength", "Free Weights" |
| imageUrl | `string` | Firebase Storage URL |
| order | `number` | Display order |

#### `gallery/{id}`
| Field | Type | Description |
|-------|------|-------------|
| id | `string` | Auto-generated doc ID |
| imageUrl | `string` | Firebase Storage URL |
| caption | `string` | Image caption/description |
| uploadedAt | `Timestamp` | Upload timestamp |
| uploadedBy | `string` | Admin UID who uploaded |

#### `pricing/{planId}`
| Field | Type | Description |
|-------|------|-------------|
| id | `string` | Plan identifier |
| name | `"Monthly" \| "Quarterly" \| "Half-Yearly" \| "Yearly"` | Display name |
| price | `number` | Price in INR paise (e.g., 99900 = ₹999) |
| duration | `number` | Duration in days |
| features | `string[]` | Feature list for the card |
| highlighted | `boolean` | Whether this is the "featured" plan |

#### `contactMessages/{id}` (NEW)
| Field | Type | Description |
|-------|------|-------------|
| id | `string` | Auto-generated doc ID |
| name | `string` | Sender name |
| email | `string` | Sender email |
| phone | `string \| null` | Sender phone |
| message | `string` | Message body |
| createdAt | `Timestamp` | Submission time |
| read | `boolean` | Whether admin has seen it |

### 9.2 Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users — own doc only, admins can read all
    match /users/{uid} {
      allow read: if request.auth != null && (request.auth.uid == uid || isAdmin());
      allow create: if request.auth != null && request.auth.uid == uid;
      allow update: if request.auth != null && (request.auth.uid == uid || isAdmin());
      // Users cannot delete their own doc
    }

    // Trainers — public read, admin write
    match /trainers/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Equipment — public read, admin write
    match /equipment/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Gallery — public read, admin write
    match /gallery/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Pricing — public read, admin write
    match /pricing/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Contact messages — anyone can create, admin can read/update
    match /contactMessages/{id} {
      allow create: if true;
      allow read, update: if isAdmin();
    }

    // Helper function
    function isAdmin() {
      return request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
  }
}
```

### 9.3 Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Trainer photos — admin upload, public read
    match /trainers/{fileName} {
      allow read: if true;
      allow write: if request.auth != null &&
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // Equipment images — same as trainers
    match /equipment/{fileName} {
      allow read: if true;
      allow write: if request.auth != null &&
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // Gallery images — same as trainers
    match /gallery/{fileName} {
      allow read: if true;
      allow write: if request.auth != null &&
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // Max file size: 5MB for all uploads
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

---

## 10. Payment Flow

### 10.1 Complete Razorpay Integration Flow

```
Step 1: User clicks "Get Started" on pricing card
  ↓
Step 2: Check auth state
  → Not logged in: redirect to /login?redirect=/pricing
  → Logged in: continue
  ↓
Step 3: Frontend calls POST /api/payment/create-order
  → Body: { planId, userId }
  → Server creates Razorpay order
  → Returns: { orderId, amount, currency, planName }
  ↓
Step 4: Frontend opens Razorpay checkout popup
  → Config: {
      key: RAZORPAY_KEY_ID (public key),
      amount, currency, order_id: orderId,
      name: "IronStone",
      description: planName,
      prefill: { name, email, contact: phone },
      theme: { color: "#dc2626" }
    }
  ↓
Step 5: User completes payment in popup
  → Razorpay returns: razorpay_order_id, razorpay_payment_id, razorpay_signature
  ↓
Step 6: Frontend calls POST /api/payment/verify
  → Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, userId }
  → Server verifies HMAC signature
  → On success: updates Firestore user doc with membership details
  → Sends confirmation email via Resend
  ↓
Step 7: Frontend shows success state
  → Toast: "Payment successful! Welcome to IronStone."
  → Redirect to /profile or /home after 2 seconds
```

### 10.2 Environment Variables Required

```env
# .env.local
RAZORPAY_KEY_ID=rzp_test_xxxxx          # Public (safe for client)
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx       # Server-side only
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx  # For client-side checkout
```

### 10.3 Razorpay Script Loading

Load the Razorpay checkout script dynamically only on the pricing page:
```tsx
// In pricing page or a useRazorpay hook
useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);
  return () => document.body.removeChild(script);
}, []);
```

---

## 11. Email Notifications

### 11.1 Email Templates (via Resend)

#### Welcome Email (on signup)
```
Subject: Welcome to IronStone 💪
Trigger: After successful signup (Firestore user doc created)
Content:
  - Greeting with user's name
  - Brief intro to IronStone
  - CTA: "Explore Membership Plans" → /pricing
  - Social links
```

#### Payment Confirmation (on successful payment)
```
Subject: Membership Confirmed — {Plan Name}
Trigger: After POST /api/payment/verify succeeds
Content:
  - "Thank you, {name}!"
  - Plan name, start date, expiry date
  - Razorpay payment ID for reference
  - CTA: "View Your Dashboard" → /home
```

#### Expiry Reminder (3 days before expiry)
```
Subject: Your IronStone Membership Expires Soon
Trigger: Firebase Cloud Function (daily cron at 9 AM IST)
Content:
  - "Hi {name}, your {plan} membership expires on {date}"
  - CTA: "Renew Now" → /pricing
```

### 11.2 Resend Setup

```ts
// lib/resend.ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string, name: string) { ... }
export async function sendPaymentConfirmation(to: string, name: string, plan: string, expiry: Date) { ... }
export async function sendExpiryReminder(to: string, name: string, plan: string, expiryDate: Date) { ... }
```

### 11.3 Environment Variables

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@ironstone.com  # Requires verified domain
```

---

## 12. Admin Panel

### 12.1 Admin Layout

All `/admin/*` pages share a common layout:

```
┌──────────────────────────────────────────────────┐
│  Navbar (same as public, but with admin badge)   │
├────────────┬─────────────────────────────────────┤
│            │                                     │
│  Sidebar   │  Main Content Area                  │
│            │                                     │
│  Dashboard │                                     │
│  Members   │                                     │
│  Pricing   │                                     │
│  Trainers  │                                     │
│  Equipment │                                     │
│  Gallery   │                                     │
│            │                                     │
├────────────┴─────────────────────────────────────┤
│  (no footer on admin pages)                      │
└──────────────────────────────────────────────────┘
```

Create `src/app/admin/layout.tsx` with sidebar navigation.
Sidebar: collapsible on mobile (hamburger toggle).

### 12.2 Admin Dashboard — `/admin`

**Stats Cards Row:**
| Stat | Source |
|------|--------|
| Total Members | Count of `users` where `role == "user"` |
| Active Members | Count where `isActive == true` |
| Expiring This Week | Count where `membershipExpiry` is within 7 days |
| Monthly Revenue | Sum of recent payments (or hardcoded for MVP) |

**Expiring Soon Table:**
- Users whose membership expires within 7 days
- Columns: Name, Email, Plan, Expiry Date, Days Left
- Use `DataTable` component

**Recent Signups:**
- Last 10 users by `createdAt`
- Columns: Name, Email, Joined Date, Plan

### 12.3 Admin Members — `/admin/members`

**Features:**
- Full user table with search and filter
- Filters: All, Active, Expired, No Plan
- Search by name or email
- Columns: Name, Email, Phone, Plan, Expiry, Status (Badge), Actions
- Actions: View details, Revoke membership (set isActive: false)
- Use `DataTable` component

### 12.4 Admin Pricing — `/admin/pricing`

**Features:**
- Editable pricing cards (same layout as public `/pricing` but with edit controls)
- Edit: price, features list, highlighted status
- Save updates to Firestore `pricing/{planId}`
- Preview of how the card looks on the public page

### 12.5 Admin Trainers — `/admin/trainers`

**Features:**
- Trainer list with add/edit/delete
- Add/Edit form: name, specialization, bio, experience, photo upload
- Photo upload to Firebase Storage `/trainers/{filename}`
- Drag-to-reorder (updates `order` field) — or simple up/down arrows
- Delete with confirmation modal
- Use `ImageUpload` component for photos

### 12.6 Admin Equipment — `/admin/equipment`

**Features:**
- Same CRUD pattern as trainers
- Fields: name, description, category (dropdown), image upload
- Category management: predefined list or free text
- Image upload to Firebase Storage `/equipment/{filename}`

### 12.7 Admin Gallery — `/admin/gallery`

**Features:**
- Grid view of all gallery images
- Multi-file upload (drag-and-drop zone)
- Each image: caption input, delete button
- Upload to Firebase Storage `/gallery/{filename}`
- Delete removes both Firestore doc and Storage file
- Bulk select and delete

---

## 13. Performance & SEO

### 13.1 Image Optimization

- Use `next/image` (`<Image>`) for all images — provides lazy loading, WebP conversion, responsive sizes
- Set explicit `width` and `height` (or use `fill` with `sizes` prop) to prevent CLS
- Firebase Storage images: consider using image resize extension or serving via CDN
- Gallery page: use `loading="lazy"` and `placeholder="blur"` where possible

### 13.2 Code Splitting

- Dynamic import for heavy components:
  ```tsx
  const Lightbox = dynamic(() => import("@/components/ui/Lightbox"), { ssr: false });
  ```
- Razorpay script: load only on `/pricing` page
- GSAP ScrollTrigger: import only in components that use it

### 13.3 SEO

**Per-page metadata** (use Next.js `generateMetadata` or static `metadata` export):

| Page | Title | Description |
|------|-------|-------------|
| `/` | IronStone — Transform Your Fitness | Premium gym with expert trainers, world-class equipment, and flexible membership plans |
| `/about` | About Us — IronStone | Our story, values, and commitment to your fitness journey |
| `/trainers` | Expert Trainers — IronStone | Meet our certified personal trainers |
| `/equipment` | Equipment — IronStone | State-of-the-art gym equipment for every workout |
| `/gallery` | Gallery — IronStone | Take a virtual tour of our facility |
| `/pricing` | Membership Plans — IronStone | Flexible monthly, quarterly, and yearly gym memberships |
| `/contact` | Contact Us — IronStone | Get in touch with IronStone gym |

**OG Tags:** Each page should have `openGraph` metadata with title, description, and image.

### 13.4 Accessibility

- All images must have descriptive `alt` text
- Interactive elements must be keyboard-accessible
- Color contrast: white text on dark backgrounds meets WCAG AA
- Modal focus trap (Tab cycles within modal)
- `aria-label` on icon-only buttons (hamburger, social links)

---

## 14. Security Requirements

### 14.1 Server-Side Only Secrets

These must NEVER be exposed to the client. Only use in API routes or server components:

| Secret | Usage |
|--------|-------|
| `RAZORPAY_KEY_SECRET` | Payment verification HMAC |
| `FIREBASE_ADMIN_*` | Firebase Admin SDK (service account) |
| `RESEND_API_KEY` | Sending emails |

### 14.2 Client-Safe Keys

These are safe to expose (prefixed with `NEXT_PUBLIC_`):

| Key | Usage |
|-----|-------|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase client SDK config |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay checkout popup |

### 14.3 Security Checklist

- [ ] Firebase Security Rules deployed (Firestore + Storage)
- [ ] API routes validate session cookies before mutations
- [ ] Razorpay signature verification uses constant-time comparison
- [ ] Admin routes check `role == "admin"` in both middleware AND API
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] Rate limiting on contact form (prevent spam)
- [ ] `.env.local` in `.gitignore`
- [ ] CSP headers configured in `next.config.ts`

---

## 15. Implementation Phases

### Phase 1 — Foundation & Auth (DONE)
- [x] Firebase setup (client + admin SDK)
- [x] Auth system (signup, login, Google SSO, logout)
- [x] Session management (HttpOnly cookies)
- [x] Middleware route protection
- [x] Landing page
- [x] Auth pages (login, signup)
- [x] Dashboard home page
- [x] AuthContext + useAuth hook
- [x] Type definitions

### Phase 2 — Design System & Common Components
- [ ] Build `Button`, `Card`, `Input`, `Badge`, `SectionHeader` components
- [ ] Build `Modal` component
- [ ] Build `PageWrapper`, extract `Footer` to shared
- [ ] Update Navbar with all routes + profile dropdown
- [ ] Create barrel export (`components/ui/index.ts`)
- [ ] Test all components in isolation

### Phase 3 — Content Pages
- [ ] `/about` page — static content with GSAP animations
- [ ] `/trainers` page — Firestore fetch, card grid
- [ ] `/equipment` page — Firestore fetch, category filter, card grid
- [ ] `/gallery` page — Firestore fetch, masonry grid, lightbox
- [ ] `/contact` page — form + map + `POST /api/contact`
- [ ] Add Firestore helper functions in `lib/firestore.ts`
- [ ] Seed Firestore with sample data for development

### Phase 4 — Payments & Membership
- [ ] `/pricing` page — Firestore-backed cards + Razorpay checkout
- [ ] `POST /api/payment/create-order`
- [ ] `POST /api/payment/verify`
- [ ] `/profile` page — membership status, edit info, expiry countdown
- [ ] Test full payment flow (Razorpay test mode)

### Phase 5 — Email Notifications
- [ ] Resend account + domain verification
- [ ] `lib/resend.ts` — email helper functions
- [ ] Welcome email on signup
- [ ] Payment confirmation email
- [ ] Firebase Cloud Function — daily expiry check + reminder email

### Phase 6 — Admin Panel
- [ ] Admin layout with sidebar
- [ ] `/admin` dashboard — stats cards, expiring members, recent signups
- [ ] `/admin/members` — user table with search/filter/actions
- [ ] `/admin/pricing` — edit plan prices and features
- [ ] `/admin/trainers` — CRUD with image upload
- [ ] `/admin/equipment` — CRUD with image upload
- [ ] `/admin/gallery` — multi-upload, delete
- [ ] `DataTable` and `ImageUpload` components

### Phase 7 — Polish & Launch
- [ ] GSAP scroll animations on all pages
- [ ] Mobile responsiveness audit (360px → 1440px)
- [ ] Deploy Firebase Security Rules (Firestore + Storage)
- [ ] SEO — metadata, OG tags, sitemap
- [ ] Performance — `next/image` everywhere, lazy loading, bundle analysis
- [ ] Accessibility audit — contrast, keyboard nav, screen reader
- [ ] E2E test: signup → purchase → profile → admin → expiry email
- [ ] Deploy to Vercel (or preferred host)

---

## Appendix A: Environment Variables Template

```env
# .env.local — NEVER commit this file

# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Appendix B: Firestore Seed Data

Use this to populate Firestore for development. Create a script `scripts/seed.ts` or add manually via Firebase Console.

### Sample Pricing Plans
```json
[
  {
    "id": "monthly",
    "name": "Monthly",
    "price": 99900,
    "duration": 30,
    "features": ["Full gym access", "Locker room", "Basic equipment"],
    "highlighted": false
  },
  {
    "id": "quarterly",
    "name": "Quarterly",
    "price": 249900,
    "duration": 90,
    "features": ["Full gym access", "Locker room", "All equipment", "1 PT session/month"],
    "highlighted": false
  },
  {
    "id": "halfYearly",
    "name": "Half-Yearly",
    "price": 449900,
    "duration": 180,
    "features": ["Full gym access", "Locker room", "All equipment", "2 PT sessions/month", "Diet plan"],
    "highlighted": true
  },
  {
    "id": "yearly",
    "name": "Yearly",
    "price": 799900,
    "duration": 365,
    "features": ["Full gym access", "Locker room", "All equipment", "4 PT sessions/month", "Diet plan", "Priority booking"],
    "highlighted": false
  }
]
```

### Sample Trainers
```json
[
  {
    "name": "Rahul Sharma",
    "specialization": "Strength & Conditioning",
    "bio": "Certified strength coach with a passion for helping clients build functional strength and athletic performance.",
    "experience": "8 Years",
    "photoUrl": "",
    "order": 1
  },
  {
    "name": "Priya Patel",
    "specialization": "Yoga & Flexibility",
    "bio": "International yoga instructor specializing in power yoga and mobility training for athletes.",
    "experience": "6 Years",
    "photoUrl": "",
    "order": 2
  },
  {
    "name": "Arjun Reddy",
    "specialization": "CrossFit & HIIT",
    "bio": "CrossFit Level 2 trainer who designs high-intensity programs tailored to individual fitness levels.",
    "experience": "5 Years",
    "photoUrl": "",
    "order": 3
  }
]
```
