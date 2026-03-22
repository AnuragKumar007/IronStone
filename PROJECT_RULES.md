# IronStone — Project Rules & Design System

> Single source of truth for design decisions. Follow these rules in every component.  
> Last analyzed: All 13 components across every section of the site.

---

## 🎨 1. Color System

### Primary — Brand Red (Energy & Action)
Used for: CTAs, accent highlights, hover states, icons, glows, stat numbers.

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#ff0000` | Blob glows, wave borders, brightest red |
| `--color-primary-mid` | `#cc0000` | Logo gradient (mid stop), hover buttons |
| `--color-primary-dark` | `#660000` | Logo gradient (end), deep shadow reds |
| Tailwind aliases | `red-500`, `red-600`, `red-700`, `red-900` | nav hover, CTA bg, borders, ambient glow |

**Core gradient** (used in Logo, FloatingImagesSection headline, DownloadAppSection waves):
```
linear-gradient(to bottom, #ff3333, #cc0000, #660000)
```

### Secondary — Dark Surfaces (Depth & Layers)
Used for: card backgrounds, panels, toggles, pricing cards, review cards.

| Token | Hex / Tailwind | Usage |
|---|---|---|
| `--color-bg` | `#000000` | Page background |
| `--color-surface-100` | `#0d0d0d` | Basic/Advance pricing cards |
| `--color-surface-200` | `#111111` | Pro (featured) pricing card |
| `--color-surface-300` | `#1a1a1a` | Container panels |
| `zinc-900` | `#18181b` | Toggle background, badges, inner panels |
| `zinc-800` | `#27272a` | Dividers, borders, section lines |
| `zinc-700` | `#3f3f46` | Hover border state on cards |

### Tertiary — Muted Text & Grays (Readability Hierarchy)
Used for: body text, subtitles, secondary labels, disabled items.

| Token | Hex / Tailwind | Usage |
|---|---|---|
| `--color-foreground` | `#ffffff` | Primary headings, labels |
| `--color-muted-bright` | `#B5B5B6` | WorkoutPlans section main heading |
| `--color-muted` | `#959597` | WorkoutPlans subtitle |
| `--color-muted-dim` | `#919399` | FloatingImages section subtitle |
| `gray-300` | `#d1d5db` | Review card body text |
| `gray-400` | `#9ca3af` | Section supporting paragraphs, footer body copy |
| `gray-500` | `#6b7280` | Footer section links, timestamps, captions |

### Accent — Blue-Violet Gradient (Premium / Membership)
Used for: `.gradient-text`, `.text-gradient-primary`, `.gradient-border-effect` (Membership cards glow), CSS utility classes.

| Stop | Hex |
|---|---|
| Start | `#A2C7FF` (soft blue) |
| Mid | `#B0BDFF` (periwinkle) |
| End | `#D2AEF9` (soft violet) |

```
linear-gradient(to bottom right, #A2C7FF, #B0BDFF, #D2AEF9)
```

---

## 🔤 2. Typography

| Role | Font | Weight | Class |
|---|---|---|---|
| Primary | **Geist Sans** (Next.js Google Font) | varies | `font-sans` |
| Monospace | **Geist Mono** (Next.js Google Font) | varies | `font-mono` |
| Icons | **Remix Icon** (CDN) | — | `ri-*` classes |

### Type Scale (as used in components)
| Level | Size | Usage |
|---|---|---|
| Hero H1 | `4rem–7rem` | HeroSection main title |
| Section H2 | `3rem–4rem` | Section headings (Membership, Reviews, etc.) |
| Large H2 | `2.5rem–4rem` | WorkoutPlans, DownloadApp |
| Card Title | `1.5rem (text-2xl)` | Pricing cards, footer headings |
| Body | `1rem–1.125rem` | Paragraphs, supporting text |
| Caption/Label | `0.75rem–0.875rem` | Badges, toggles, pricing labels |

**Text Styling Rules:**
- Section labels/eyebrows: `uppercase tracking-widest text-xs font-semibold`
- CTA hover text: `red-500`
- Stat numbers: `text-red-600 font-black`

---

## 🏗️ 3. Tech Stack

| Tool | Version / Notes |
|---|---|
| Framework | **Next.js** (App Router) |
| Language | **TypeScript** (`.tsx` / `.ts`) |
| Styling | **Tailwind CSS v4** — config lives in `globals.css` `@theme` block |
| Animations | **GSAP** + `ScrollTrigger` for scroll-controlled animations |
| Smooth Scroll | **Lenis** via `<SmoothScroll>` wrapper in root layout |
| Lottie | `lottie-react` for animated SVG illustrations |
| Icons | **Remix Icon** via CDN (`remixicon@4.5.0`) |

---

## 📐 4. Component & Layout Rules

1. **All components** → `src/components/`, PascalCase filenames.
2. **Section padding**: `py-16` to `py-24` vertically; `px-6 md:px-[8rem]` horizontally.
3. **Container**: `container mx-auto` wraps all content.
4. **Cards**: `rounded-3xl` (membership) or `rounded-lg` (review cards).
5. **Borders**: `border border-zinc-800` for subtle card borders; `border-red-900/40` for featured/highlighted cards.
6. **Glow Effects** (featured cards): `shadow-[0_0_40px_rgba(220,38,38,0.1)]`
7. **Hover Interactions**:
   - Buttons: `hover:bg-red-700` or `hover:bg-white hover:text-black`
   - Links: `hover:text-red-500 transition-colors`
   - Social icons: `hover:bg-red-600 hover:border-red-600`
   - Cards: `hover:border-zinc-700` + `translateY(-5px)`
8. **Transitions**: Always `transition-all duration-300` or `transition-colors`.
9. **Backdrop blur** for overlays: `backdrop-blur-md` (navbar), `backdrop-blur-xl` (glass panels).

---

## 📋 5. CSS Utility Classes (defined in `globals.css`)

| Class | Purpose |
|---|---|
| `.gradient-text` / `.text-gradient-primary` | Blue-violet gradient clipped text |
| `.gradient-border-effect` | Animated glowing border on hover (membership cards) |
| `.card-hover` | Standard card lift + shadow on hover |
| `.review-card` | Review card hover animation |
| `.wave-1/.wave-2/.wave-3` | Pulsing wave rings (Reach Us section) |
| `.spotlight` | Mouse-following spotlight cursor effect |
| `.text-area` | Large reactive background text (Define Goals section) |
| `.perspective-1000` | 3D perspective helper for carousel |

---

## ⚠️ 6. Rules to Never Break

1. ❌ Never hard-code raw hex values inside `.tsx` files — use Tailwind classes or CSS tokens.
2. ❌ Never use default browser fonts — Geist Sans is always loaded via Next.js `layout.tsx`.
3. ❌ Never use white or light backgrounds on any section — all sections are black or dark zinc.
4. ✅ Always use `text-red-500` or `text-red-600` for accent/highlight text (never `text-orange`, `text-blue`, etc.).
5. ✅ Always wrap interactive icon buttons with `hover:text-red-500 transition-colors`.
6. ✅ Always use `font-black` for metric/stat numbers and `font-bold` for headings.
