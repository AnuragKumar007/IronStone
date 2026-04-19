# Plan: Contact Messages to Admin Dashboard

## Context
The contact page (`src/app/(public)/contact/page.tsx`) currently fakes a success response with `setTimeout` — no data is saved anywhere. Instead of wiring it to an email service, we'll save messages to Firestore and create an admin page to view/manage them. The `ContactMessage` type already exists in `src/types/index.ts`.

---

## Files to Change

| # | File | Action |
|---|------|--------|
| 1 | `src/lib/firestore.ts` | Add 4 Firestore functions for `messages` collection |
| 2 | `src/app/(public)/contact/page.tsx` | Replace fake timeout with `addMessage()` call |
| 3 | `src/app/admin/messages/page.tsx` | **New** — admin page to view/manage messages |
| 4 | `src/components/admin/AdminSidebar.tsx` | Add "Messages" to `navItems` array |

---

## Step 1 — Firestore Functions (`src/lib/firestore.ts`)

Add at the bottom, following existing patterns (coupons/gallery):

- **`addContactMessage(data)`** — `addDoc` to `"messages"` collection with `serverTimestamp()` for `createdAt` and `read: false`
- **`getContactMessages()`** — query `"messages"` ordered by `createdAt` desc, convert Timestamps via `.toDate()`
- **`updateContactMessage(id, data)`** — `updateDoc`, strip `id`/`createdAt` before writing
- **`deleteContactMessage(id)`** — `deleteDoc`

Add `ContactMessage` to the existing type import line.

## Step 2 — Wire Contact Form (`src/app/(public)/contact/page.tsx`)

- Import `addContactMessage` from `@/lib/firestore`
- In `handleSubmit`, replace `await new Promise(...)` with:
  ```ts
  await addContactMessage({ name: form.name, email: form.email, phone: form.phone, message: form.message, createdAt: new Date(), read: false });
  ```
- Remove the `TODO` comment

## Step 3 — Admin Messages Page (`src/app/admin/messages/page.tsx`) **NEW**

Follow the coupons page pattern exactly:

**State:** `messages`, `loading`, `selectedMessage` (for detail modal), `deleting`

**DataTable columns:**
| Column | Render |
|--------|--------|
| Name | White bold text |
| Email | Gray text |
| Date | `toLocaleDateString("en-IN")` + time |
| Status | `<Badge variant="info">New</Badge>` or `<Badge variant="neutral">Read</Badge>` |
| Actions | Read/unread toggle + delete button (same icon style as coupons) |

**Features:**
- Click row to open detail Modal (size `"md"`) showing full message (name, email, phone, date, message body)
- Auto-mark as read when modal opens
- Toggle read/unread button
- Delete with confirmation

**Imports:** `Button, Badge, Modal, DataTable` from `@/components/ui`, firestore functions, `Column` type, `ContactMessage` type

## Step 4 — Sidebar Nav (`src/components/admin/AdminSidebar.tsx`)

Add after the Gallery entry in `navItems`:
```ts
{ label: "Messages", href: "/admin/messages", icon: "ri-mail-line" },
```

---

## Verification
1. Run `npm run dev` / dev server
2. Go to `/contact`, submit a form — should show success and save to Firestore `messages` collection
3. Go to `/admin/messages` — should see the message in the table
4. Click the message row — modal opens with full details, status changes to "Read"
5. Toggle read/unread from actions column
6. Delete a message — should disappear from table
7. Check sidebar — "Messages" link should appear and highlight when active
