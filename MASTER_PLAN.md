# IronStone — Full-Stack Master Plan ✅

> Reference this file at the start of every dev session. Mark steps `[x]` as you complete them.

---

## ⚙️ Tech Stack (Finalized)

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | GSAP + Lenis |
| Database | Firebase Firestore |
| Auth | Firebase Auth (Email+Password + Google SSO) |
| Storage | Firebase Storage |
| Payment | Razorpay |
| Email | Resend |
| Session | Firebase JWT → HttpOnly cookie via Next.js API route |

---

## 🔐 Auth Details

- **Signup fields**: Username, Email, Phone, Password + Google SSO button
- **Login**: Email+Password + Google SSO
- **Phone**: Stored as input in Firestore only (no OTP for now)
- **Session**: HttpOnly cookie set via `POST /api/auth/session`, validated in `middleware.ts`

### Homepage Routing Logic
- `/` → Landing page (logged-out users)
- `/home` → App homepage (logged-in users)
- Middleware: logged-in → redirect away from `/`; logged-out → redirect away from `/home`, `/profile`, `/admin/*`

---

## 📄 All Pages

### Public (no login required)
| Route | Description |
|---|---|
| `/` | Landing page (existing) |
| `/about` | Gym story & values |
| `/equipment` | Equipment card grid (Firestore-backed) |
| `/gallery` | Gym image gallery (Firebase Storage) |
| `/trainers` | Personal trainer cards (Firestore-backed) |
| `/pricing` | 4 membership tiers with Razorpay checkout |
| `/contact` | Contact form + Google Maps |

### Auth
| Route | Description |
|---|---|
| `/login` | Email+password + Google SSO |
| `/signup` | Username, email, phone, password + Google SSO |

### Protected — User
| Route | Description |
|---|---|
| `/home` | Post-login app homepage (membership status, quick links) |
| `/profile` | Personal info, active plan, expiry countdown, renewal CTA |

### Protected — Admin
| Route | Description |
|---|---|
| `/admin` | Dashboard (active members, expiring soon, revenue) |
| `/admin/members` | All users — active/expired, revoke access |
| `/admin/pricing` | Edit plan prices and feature lists |
| `/admin/trainers` | Add / Edit / Delete trainers |
| `/admin/equipment` | Add / Edit / Delete equipment |
| `/admin/gallery` | Upload / Delete gallery images |

---

## 🗃️ Firestore Collections

### `users/{uid}`
```
uid, name, email, phone, role ("user" | "admin"),
membershipPlan ("monthly" | "quarterly" | "halfYearly" | "yearly" | null),
membershipStart (Timestamp), membershipExpiry (Timestamp),
isActive (boolean), razorpayPaymentId, createdAt
```

### `trainers/{id}`
```
name, specialization, bio, experience, photoUrl, order
```

### `equipment/{id}`
```
name, description, category, imageUrl, order
```

### `gallery/{id}`
```
imageUrl, caption, uploadedAt (Timestamp), uploadedBy (uid)
```

### `pricing/{planId}`
```
name ("Monthly"|"Quarterly"|"Half-Yearly"|"Yearly"),
price (INR paise), duration (days), features (string[]), highlighted (boolean)
```

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── (public)/
│   │   ├── about/page.tsx
│   │   ├── equipment/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── trainers/page.tsx
│   │   ├── pricing/page.tsx
│   │   └── contact/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (protected)/
│   │   ├── home/page.tsx
│   │   └── profile/page.tsx
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── members/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── trainers/page.tsx
│   │   ├── equipment/page.tsx
│   │   └── gallery/page.tsx
│   ├── api/
│   │   ├── auth/session/route.ts
│   │   └── payment/
│   │       ├── create-order/route.ts
│   │       └── verify/route.ts
│   ├── layout.tsx
│   ├── page.tsx  ← existing landing page
│   └── globals.css
├── components/
│   ├── (existing components...)
│   ├── ui/           ← Button, Card, Modal, Badge, Input
│   ├── admin/        ← admin-only components
│   └── shared/       ← Navbar, Footer
├── lib/
│   ├── firebase.ts        ← client SDK init
│   ├── firebase-admin.ts  ← server SDK init
│   ├── auth.ts            ← auth helpers
│   ├── firestore.ts       ← DB helpers
│   ├── razorpay.ts        ← payment helpers
│   └── resend.ts          ← email helpers
├── hooks/
│   ├── useAuth.ts
│   └── useMembership.ts
├── types/
│   └── index.ts
└── middleware.ts
```

---

## 💳 Razorpay Payment Flow

1. User picks plan on `/pricing`
2. `POST /api/payment/create-order` → creates Razorpay order server-side
3. Razorpay checkout popup opens
4. On success → `POST /api/payment/verify` → HMAC signature check
5. Verified → update `users/{uid}` with plan + expiry in Firestore

---

## 📧 Email Triggers (Resend)

| Trigger | Email |
|---|---|
| Signup | Welcome to IronStone |
| Payment success | Membership confirmation + expiry date |
| 3 days before expiry | Reminder to renew |

Expiry reminders via **Firebase Cloud Functions** (scheduled daily cron).

---

## 🚀 Step-by-Step Checklist

### Phase 1 — Firebase Setup & Auth
- [x] 1. Install: `firebase`, `firebase-admin`, `resend`, `razorpay`
- [x] 2. Create Firebase project → enable Firestore, Storage, Auth (Email + Google)
- [x] 3. Set up `lib/firebase.ts` (client) + `lib/firebase-admin.ts` (server)
- [x] 4. Write `lib/auth.ts` — login, signup, Google SSO, logout
- [x] 5. Build `/signup` page
- [x] 6. Build `/login` page
- [x] 7. `POST /api/auth/session` route — Firebase token → HttpOnly cookie
- [x] 8. `DELETE /api/auth/session` route — logout
- [x] 9. Write `proxy.ts` — route protection + redirects (Next.js 16)
- [x] 10. Build `/home` page — post-login app homepage

### Phase 2 — Content Pages
- [ ] 11. `/trainers` page — Firestore fetch, PT cards
- [ ] 12. `/equipment` page — Firestore fetch, card grid
- [ ] 13. `/gallery` page — Firebase Storage images, card layout
- [ ] 14. `/about` page — static content
- [ ] 15. Update Navbar — all routes + auth state aware

### Phase 3 — Membership & Payments
- [ ] 16. `/pricing` page — 4 tiers from Firestore
- [ ] 17. `POST /api/payment/create-order` — Razorpay server order
- [ ] 18. `POST /api/payment/verify` — HMAC verification
- [ ] 19. Update user doc on successful payment
- [ ] 20. `/profile` page — membership details + expiry countdown

### Phase 4 — Email Notifications
- [ ] 21. Resend account + domain setup
- [ ] 22. `lib/resend.ts` — email helpers
- [ ] 23. Welcome email on signup
- [ ] 24. Membership confirmation email on payment
- [ ] 25. Firebase Cloud Function — daily expiry check + reminder email

### Phase 5 — Admin Panel
- [ ] 26. `/admin` dashboard — member stats
- [ ] 27. `/admin/members` — user table, revoke access
- [ ] 28. `/admin/pricing` — edit plans live
- [ ] 29. `/admin/trainers` — CRUD with image upload
- [ ] 30. `/admin/equipment` — CRUD with image upload
- [ ] 31. `/admin/gallery` — multi-upload + delete

### Phase 6 — Polish & QA
- [ ] 32. GSAP animations on all new pages
- [ ] 33. Mobile responsiveness audit
- [ ] 34. Firebase Security Rules (Firestore + Storage)
- [ ] 35. SEO — meta tags, OG tags, page titles
- [ ] 36. Performance — image optimization, lazy loading
- [ ] 37. E2E test: signup → buy plan → profile → admin view → expiry email

---

## 🔒 Security Reminders

> [!IMPORTANT]
> Always enforce access control in **both** Firebase Security Rules AND Next.js API routes. Never rely on frontend-only role checks.

- Razorpay secret key → server-side only (never exposed to client)
- Firebase Admin SDK → server-side only
- Resend API key → server-side only
- All secrets → `.env.local` (never commit to git)
