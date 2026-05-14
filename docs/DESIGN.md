---
version: alpha
name: IEC Web
description: >
  Design system for IEC Vietnam corporate website — Payload CMS 3 with Next.js 16 App Router,
  HeroUI component library, bilingual (EN/VI). Corporate tech identity built on a vivid IEC Blue
  primary with a clean, minimal surface palette.
colors:
  primary: "#006FEE"
  on-primary: "#FFFFFF"
  secondary: "#7828C8"
  on-secondary: "#FFFFFF"
  background: "#FFFFFF"
  foreground: "#000000"
  muted: "#65656B"
  surface: "#F4F4F5"
  border: "#E4E4E7"
  success: "#17C964"
  warning: "#F5A524"
  danger: "#F31260"
typography:
  h1:
    fontFamily: Space Grotesk
    fontSize: 3.5rem
    fontWeight: 700
    lineHeight: 1.1
  h2:
    fontFamily: Space Grotesk
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.3
  h3:
    fontFamily: Space Grotesk
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.4
  body-md:
    fontFamily: Space Grotesk
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Space Grotesk
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 0.75rem
    fontWeight: 600
    letterSpacing: 0.05em
  code:
    fontFamily: Geist Mono
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: 4px
  md: 10px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 80px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: 8px 16px
    typography: "{typography.body-sm}"
  button-primary-hover:
    backgroundColor: "#005CC4"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: 8px 16px
    typography: "{typography.body-sm}"
  button-outline-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: 8px 16px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: 16px
  badge-pill:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    padding: 4px 12px
    typography: "{typography.body-sm}"
  badge-muted:
    backgroundColor: "{colors.border}"
    textColor: "{colors.muted}"
    rounded: "{rounded.full}"
    padding: 4px 12px
    typography: "{typography.body-sm}"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: 8px 12px
    typography: "{typography.body-md}"
  header:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
  header-solid:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
  footer:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  modal:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: 24px
---

## Overview

Clean Corporate Tech. The IEC Web identity pairs a vivid IEC Blue (`#006FEE`) against white surfaces to create a trustworthy, forward-looking brand for a technology and education company operating in Vietnam. The aesthetic is modern and functional — optimized for bilingual (EN/VI) content without sacrificing visual coherence.

The UI framework is **HeroUI** (`@heroui/react`) layered over **Tailwind CSS v4**, with Space Grotesk as the expressive brand typeface and Geist Mono exclusively for code. Motion is handled by **Framer Motion** (hero animations, VideoHero typewriter). Smooth scrolling is provided by **Lenis**.

## Colors

The palette centers on a single strong primary and avoids unnecessary accent proliferation.

- **Primary (`#006FEE`):** IEC Blue — the dominant brand driver. Used for CTAs, interactive elements, active states, header/footer backgrounds, and focus rings.
- **On-Primary (`#FFFFFF`):** White text/icons on blue backgrounds.
- **Secondary (`#7828C8`):** Violet — used sparingly for secondary actions, tags, and state contrast.
- **Background (`#FFFFFF`):** Pure white. The dominant page canvas in light mode.
- **Foreground (`#000000`):** Black. All primary text.
- **Muted (`#65656B`):** Mid-gray for metadata, captions, and secondary labels.
- **Surface (`#F4F4F5`):** Off-white for cards, input backgrounds, and elevated containers.
- **Border (`#E4E4E7`):** Light gray for dividers, input borders, and card outlines.
- **Success (`#17C964`):** Form validation success, status indicators.
- **Warning (`#F5A524`):** Alert banners, advisory notices.
- **Danger (`#F31260`):** Errors, destructive actions.

### Dark Theme

All color variables are aliased to CSS custom properties and overridden under `[data-theme="dark"]`. In dark mode:

- Background flips to `oklch(14.5% 0 0)` ≈ `#1A1A1A`
- Foreground flips to near-white
- Primary `#006FEE` remains constant (brand consistency)
- Card surfaces use `oklch(18%)` dark gray

Dark mode is toggled by setting `data-theme="dark"` on `<html>`. Users can select Auto / Light / Dark via the ThemeSelector in the admin UI. Initial theme is injected before first paint via an inline `<script>` to prevent flash.

## Typography

Two typefaces; no mixing on the same hierarchy level.

- **Space Grotesk** (`--font-sans`) — all headings, body copy, labels, UI text. A geometric grotesque with distinctive letterforms that convey both technical precision and approachability.
- **Geist Mono** (`--font-mono`) — code blocks exclusively. Clean monospace with excellent legibility at small sizes.

### Scale

| Token | Family | Size | Weight | Use |
|---|---|---|---|---|
| `h1` | Space Grotesk | 3.5rem | 700 | Page heroes, primary headlines |
| `h2` | Space Grotesk | 1.5rem | 600 | Section titles, card headers |
| `h3` | Space Grotesk | 1.25rem | 600 | Sub-section titles |
| `body-md` | Space Grotesk | 1rem | 400 | Main body copy |
| `body-sm` | Space Grotesk | 0.875rem | 400 | Captions, metadata, button labels |
| `label-caps` | Space Grotesk | 0.75rem | 600 | Eyebrow labels (uppercase + tracking) |
| `code` | Geist Mono | 0.875rem | 400 | Inline code, code blocks |

### Prose

The `@tailwindcss/typography` plugin styles Payload Lexical rich text output. Prose inherits `--text` (the foreground CSS variable) for body and headings, ensuring correct light/dark rendering without custom overrides per-component.

## Layout

The site uses a single responsive container system centered on all breakpoints.

### Breakpoints

| Name | Min-width |
|---|---|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1344px (container max) |

### Container

A single `.container` utility provides responsive max-widths and horizontal padding:

```css
/* sm → max-w: 100% */
/* md → max-w: 100% */
/* lg → max-w: 1024px */
/* xl → max-w: 1280px */
/* 2xl → max-w: 1344px, padding-inline: 2rem */
```

All page content respects this container. Full-bleed sections (hero backgrounds, footer fills) use `w-full` wrappers containing an inner `.container`.

### Grid

Content blocks use Tailwind `grid` with `gap-8` (32px) as the standard column gutter. The `Content` block supports full / half / one-third / two-thirds column configurations.

### Spacing Scale

Base 4px unit. Prefer multiples: 4, 8, 16, 24, 40, 80px.

## Elevation & Depth

Elevation is intentionally minimal — flat surfaces with border delineation rather than heavy shadows.

- **Cards:** `border border-border` on `bg-surface`. No drop shadow in default state.
- **Modals / Drawers:** Semi-transparent overlay (`bg-black/50`), white card centered. Subtle `shadow-xl` is acceptable here as the only full-shadow use case.
- **Sticky Header (solid mode):** `border-b border-border` to separate from page content without elevation.
- **VideoHero overlay blocks:** Use gradient backgrounds (`from-black/60 to-transparent`) rather than discrete elevation.

Do not use `box-shadow` for functional layout separation — use borders or background contrast.

## Shapes

Consistent rounding reduces visual noise.

| Token | Value | Use |
|---|---|---|
| `rounded.sm` | 4px | Inline badges, tags, small UI elements |
| `rounded.md` | 10px | Buttons, inputs, chips |
| `rounded.lg` | 12px | Cards, panels |
| `rounded.xl` | 16px | Modals, large containers |
| `rounded.full` | 9999px | Pill badges, avatar circles, circular icon buttons |

Never use sharp corners (0px radius) for interactive elements. Never use `rounded.full` for full-width components — only for pills and circular elements.

## Components

### Button — Primary

The default action button. Blue fill, white text.

- Background: `{colors.primary}` → `#006FEE`
- Text: `{colors.on-primary}` → `#FFFFFF`
- Radius: `{rounded.md}` → 10px
- Padding: `8px 16px`
- Hover: darken to `#005CC4`
- Focus ring: 2px offset, `{colors.primary}` color

### Button — Outline

Secondary action. Transparent fill, blue border and text.

- Background: `transparent`
- Text + Border: `{colors.primary}`
- Hover: `{colors.surface}` background fill

### Button — Ghost

Tertiary / icon actions. No border, no fill.

- Text: `{colors.foreground}`
- Hover: `{colors.surface}` background

### Card

Content container. Off-white background, subtle border.

- Background: `{colors.surface}` → `#F4F4F5`
- Border: `1px solid {colors.border}`
- Radius: `{rounded.lg}` → 12px
- Internal padding: `{spacing.md}` → 16px

### Badge — Pill

Employment type indicators, category chips.

- Filled variant: `{colors.primary}` background, white text
- Muted variant: `{colors.border}` background, `{colors.muted}` text
- Always `{rounded.full}` — pill shape only

### Header

Two display modes controlled by scroll position and route:

1. **Transparent** (hero pages, `/posts`): `background: transparent`, white logo (CSS `filter: invert`), `py-12`. Sits behind page content via negative margin on heroes.
2. **Solid** (`data-theme` context): `background: {colors.background}`, dark logo, `py-8`, bottom border.

Nav links use `body-md` weight; active link uses `{colors.primary}` color.

### Footer

Full-width, two-row structure.

- Both rows: `background: {colors.primary}` → IEC Blue
- All text: `{colors.on-primary}` → white
- Top row: company contact info (address, hotline, email) + logo
- Bottom row: copyright, nav links, social icons, phone CTA button

The footer is always blue regardless of page theme. Do not apply dark/light mode inversion to the footer.

### Form Inputs

- Background: `{colors.background}`
- Border: `1px solid {colors.border}`, transitions to `{colors.primary}` on focus
- Radius: `{rounded.md}` → 10px
- Error state: border `{colors.danger}`, helper text `{colors.danger}`
- Disabled: 50% opacity, `cursor: not-allowed`

### Modal (Job Apply Modal)

- Overlay: `bg-black/50` backdrop
- Container: white, `{rounded.xl}`, `{spacing.lg}` padding
- Close button: top-right, ghost style
- Stacking: `z-50` to clear sticky header

## Do's and Don'ts

### Do

- Use `{colors.primary}` (`#006FEE`) for all primary actions, links, and interactive focus states.
- Use Space Grotesk for all non-code text. Never substitute another sans-serif.
- Maintain bilingual parity: every user-facing string must have both `en` and `vi` translations in `messages/`.
- Use the `.container` utility for all page-level content alignment.
- Apply `data-theme="dark"` on `<html>` to enable dark mode; do not manually override CSS variables in component styles.
- Use `{rounded.full}` exclusively for pill/circular shapes; use `{rounded.md}` or `{rounded.lg}` for rectangular controls.
- Keep richText fields (Payload Lexical) as the single source of long-form content. Do not embed long text strings in React components.

### Don't

- Don't use `secondary` (`#7828C8`) for primary CTAs or navigation — it is accent-only.
- Don't add drop shadows to card/panel components (use border-only elevation).
- Don't use `filter: invert` outside the Header logo — it is a header-specific trick for transparent mode.
- Don't hardcode pixel values when a spacing or typography token covers the case.
- Don't use `absolute` positioning for header/footer backgrounds — use the `bg-primary` Tailwind utility.
- Don't disable outline/focus rings — accessibility requires visible keyboard focus on all interactive elements.
- Don't render job or page content without locale awareness. Always pass the active `locale` to Payload queries.
