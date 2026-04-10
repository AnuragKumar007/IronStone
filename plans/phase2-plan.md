# Phase 2: Design System & Common Components

> **Status:** Not started  
> **Depends on:** Phase 1 (complete)  
> **Blocks:** Phase 3 (Content Pages)

---

## Goal

Extract inline UI patterns (buttons, inputs, cards, badges) into a reusable component library at `src/components/ui/`. This gives Phase 3+ pages a consistent, DRY foundation.

---

## Components to Build (in order)

### 1. Badge — `src/components/ui/Badge.tsx`
- **Props:** `variant` (success / warning / danger / info / neutral), `size` (sm / md), `children`, `className`
- Subtle bg with matching text: e.g. `bg-green-500/10 text-green-500`
- `inline-flex items-center font-semibold rounded-full`

### 2. Button — `src/components/ui/Button.tsx`
- **Props:** `variant` (primary / secondary / outline / ghost), `size` (sm / md / lg), `loading`, `fullWidth`, `icon`, `children` + native button props
- Primary → red gradient (`from-red-600 to-red-900`), hover shadow
- Secondary → `bg-surface-300`, zinc border
- Outline → transparent, zinc border, hover red
- Ghost → text only, hover white
- Loading state → spinner icon + disabled

### 3. Input — `src/components/ui/Input.tsx`
- **Props:** `label`, `error`, `icon` (remix icon class), + native input props
- Reuses `.auth-input` CSS class from globals.css
- Label: `text-gray-400 text-xs uppercase tracking-widest font-bold`
- Icon: absolute left, adds `pl-11`
- Error: `text-red-500 text-xs` below
- Uses `React.forwardRef`

### 4. Card — `src/components/ui/Card.tsx`
- **Props:** `variant` (default / featured / interactive), `padding` (sm / md / lg), `children`, `className`
- Default → `bg-surface-100 rounded-3xl border border-zinc-800/50`
- Featured → `bg-surface-200` + `gradient-border-effect` + red glow shadow
- Interactive → default + `card-hover` class (lift on hover)

### 5. SectionHeader — `src/components/ui/SectionHeader.tsx`
- **Props:** `label`, `title`, `subtitle`, `align` (left / center), `gradient`, `className`
- Server component (no GSAP) — simpler sibling of PageHero for mid-page sections
- Label → uppercase pill badge, title → h2, subtitle → gray paragraph

### 6. Modal — `src/components/ui/Modal.tsx`
- **Props:** `isOpen`, `onClose`, `title`, `size` (sm / md / lg), `children`
- Dark backdrop + blur, centered panel (`bg-surface-200`)
- GSAP scale-in animation on open
- Close on backdrop click + Escape key
- Body scroll lock when open

### 7. DataTable — `src/components/ui/DataTable.tsx` *(minimal stub)*
- Generic `<T>` component, basic dark-styled HTML table
- Columns: `{ key, header, render? }`
- Ready for Phase 6 admin to consume

### 8. ImageUpload — `src/components/ui/ImageUpload.tsx` *(minimal stub)*
- Dashed border drop zone, hidden file input, image preview
- Ready for Phase 6 admin to consume

### 9. Barrel Export — `src/components/ui/index.ts`
```ts
export { default as Badge } from "./Badge";
export { default as Button } from "./Button";
export { default as Card } from "./Card";
export { default as Input } from "./Input";
export { default as Modal } from "./Modal";
export { default as SectionHeader } from "./SectionHeader";
export { default as DataTable } from "./DataTable";
export { default as ImageUpload } from "./ImageUpload";
```
Usage: `import { Button, Card, Badge } from "@/components/ui"`

---

## Shared Layout Components

### 10. PageWrapper — `src/components/shared/PageWrapper.tsx`
- Wraps page content with `pt-24 min-h-screen` to clear fixed navbar
- Server component, accepts `children` + `className`

### 11. Move Navbar → `src/components/shared/Navbar.tsx`

### 12. Move Footer → `src/components/shared/Footer.tsx`

### 13. Update All Import Paths
- `src/app/(public)/layout.tsx` → shared/Navbar + PageWrapper
- `src/app/(protected)/layout.tsx` → shared/Navbar
- `src/app/page.tsx` → shared/Navbar + shared/Footer
- Any other files importing Navbar/Footer

---

## Design Patterns to Follow

| Pattern | Class |
|---------|-------|
| Card bg | `bg-surface-100`, `bg-surface-200`, `bg-surface-300` |
| Card radius | `rounded-3xl` |
| Button/input radius | `rounded-xl` |
| Badge/pill radius | `rounded-full` |
| Transitions | `transition-all duration-300` |
| Accent text | `text-red-500` or `text-red-600` |
| Hover on icons | `hover:text-red-500 transition-colors` |
| Card hover | `.card-hover` CSS class |
| Featured glow | `.gradient-border-effect` CSS class |
| Gradient text | `.gradient-text` CSS class |

**Rules:** No raw hex in .tsx — only Tailwind classes. Dark backgrounds only. Reuse globals.css utilities.

---

## Reference Files
- `src/app/globals.css` — design tokens + CSS utilities
- `src/components/PageHero.tsx` — SectionHeader reference
- `src/app/(auth)/login/page.tsx` — Input/Button patterns
- `src/components/MembershipSection.tsx` — Card/Badge patterns

---

## Verification
1. `npx next build` passes
2. All existing pages render correctly after Navbar/Footer move
3. Components visually match existing design language
