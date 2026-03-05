# Bread Cooperative Design System — Astro Starlight Context Document

**Purpose:** This document gives coding agents everything needed to correctly implement the Bread Cooperative design system in an Astro Starlight documentation site. Read this fully before writing any styles or components.

---

## 1. Source of Truth — Where to Look

Always consult these sources, in this order:

|Source|URL|What it contains|
|---|---|---|
|**UI Kit README**|https://github.com/BreadchainCoop/bread-ui-kit|Component API, color token names, typography components|
|**UI Kit FONTS.md**|https://github.com/BreadchainCoop/bread-ui-kit/blob/main/FONTS.md|Font names, file structure, `@font-face` setup|
|**Storybook Demo**|https://breadcoopstorybook.netlify.app/|Live preview of all components and typography variants|
|**Landing Repo**|https://github.com/BreadchainCoop/breadcoop-landing|Real-world Next.js implementation using `@breadcoop/ui`|
|**Live Site**|https://bread.coop/|Visual reference — orange/cream palette, lifted buttons, grain texture|
|**Starlight CSS Props**|https://github.com/withastro/starlight/blob/main/packages/starlight/style/props.css|Full list of `--sl-*` custom properties Starlight exposes|
|**Starlight Styling Docs**|https://starlight.astro.build/guides/css-and-tailwind/|How to inject custom CSS and override Starlight themes|

---

## 2. Bread UI Kit — Package & Setup

The kit is published as **`@breadcoop/ui`** and built for **Tailwind CSS v4** (not v3).

```bash
pnpm install @breadcoop/ui
```

The kit ships a `theme.css` file that must be imported in the main CSS entry point:

```css
/* src/styles/global.css */
@import "tailwindcss";
@import "@breadcoop/ui/theme";  /* registers all @theme variables AND @font-face rules */
```

**Do not omit this import or place it after other `@theme` declarations.**

---

## 3. Typography — Fonts

### Font Family: Bread Display / Bread Body

Bread Cooperative uses a proprietary typeface (the Pogaca family) in two sub-families. The **CSS `font-family` names registered in the package** are:

|Family|Weights|CSS `font-family` name|Usage|
|---|---|---|---|
|**Bread Display**|400 (Regular), 700 (Bold), 900 (Black)|`"Bread Display"`|Headings, hero text, display copy|
|**Bread Body**|400 (Regular), 700 (Bold)|`"Bread Body"`|Body text, UI labels, captions|

> **Important:** The `.woff2` files are named `PogacaDisplay*.woff2` / `PogacaBody*.woff2`, but the CSS `font-family` registration uses `"Bread Display"` and `"Bread Body"`. Use these names, not the file names.

### Font Files — Bundled in the Package

Font files **are included in `@breadcoop/ui`** under `dist/fonts/`. When you `@import "@breadcoop/ui/theme"`, Vite resolves and serves the font files automatically. **You do not need to copy font files into your project.**

```
node_modules/@breadcoop/ui/dist/
├── theme.css          ← imports and registers fonts
└── fonts/
    ├── PogacaDisplayBlack.woff2
    ├── PogacaDisplayBold.woff2
    ├── PogacaDisplayRegular.woff2
    ├── PogacaBodyRegular.woff2
    └── PogacaBodyBold.woff2
```

`theme.css` registers `@font-face` with `font-family: "Bread Display"` / `"Bread Body"` and sets the CSS custom properties:

```css
/* These are set by @breadcoop/ui/theme automatically */
:root {
  --font-breadDisplay: "Bread Display", ui-sans-serif, system-ui, sans-serif;
  --font-breadBody: "Bread Body", ui-sans-serif, system-ui, sans-serif;
}
```

### Wiring Fonts into Starlight

Since `@breadcoop/ui/theme` handles `@font-face` and the `--font-breadDisplay`/`--font-breadBody` CSS variables, you only need to map these into Starlight's system:

```css
/* src/styles/global.css */
@layer base, starlight, theme, components, utilities;

@import "@breadcoop/ui/theme";    /* registers fonts and all color/type tokens */
@import '@astrojs/starlight-tailwind';
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities);
```

To wire into Starlight's `--sl-font` (body text across all Starlight UI):

```css
:root {
  --sl-font: "Bread Body", sans-serif;
}
.sl-markdown-content h1,
.sl-markdown-content h2,
.sl-markdown-content h3 {
  font-family: "Bread Display", sans-serif;
  font-weight: 700;
}
```

### Typography Components (from `@breadcoop/ui`)

```tsx
import { Heading1, Heading2, Heading3, Heading4, Heading5, Body, Caption, Typography } from "@breadcoop/ui";
// Typography variant prop: "h1" | "h2" | "h3" | "h4" | "h5" | "body" | "caption"
```

|Component|Font|Weight|Notes|
|---|---|---|---|
|`Heading1`|Bread Display|900|Hero headings — uppercase, tight tracking|
|`Heading2`|Bread Display|900|Section headings|
|`Heading3`|Bread Display|900|Sub-section headings|
|`Heading4`|Bread Body|700|Smaller headings|
|`Heading5`|Bread Body|400|Fine-print headings|
|`Body`|Bread Body|400 / 700|Accepts `bold` prop|
|`Caption`|Bread Body|400|Labels, metadata|

---

## 4. Color Tokens

Colors are defined in `@breadcoop/ui/theme` and available as both CSS custom properties and Tailwind utility classes. All values below are taken directly from the published `theme.css`.

### Full Token Reference

```css
/* Orange (primary brand) */
--color-primary-orange: #ea6023;   /* bg-primary-orange — main CTA color */
--color-orange-0:       #ffc080;   /* lighter tint */
--color-orange-1:       #d14a0f;   /* hover state */
--color-orange-2:       #b83c08;   /* darker variant */

/* Jade (Safety Net product) */
--color-primary-jade:   #286b63;
--color-jade-0:         #9cacc6;
--color-jade-1:         #72849d;
--color-jade-2:         #134a44;   /* hover */

/* Blue (Stacks product) */
--color-primary-blue:   #1c5bb9;
--color-blue-0:         #a8c3ea;
--color-blue-1:         #588ddb;
--color-blue-2:         #1b4a90;   /* hover */

/* Paper (warm off-white backgrounds) */
--color-paper-main:     #f6f3eb;   /* primary page/card background */
--color-paper-0:        #fdfcf9;   /* lightest */
--color-paper-1:        #f0ebe0;
--color-paper-2:        #eae2d6;   /* sidebar, secondary surfaces */

/* Ink / Surface */
--color-surface-ink:    #1b201a;   /* near-black text */
--color-surface-grey:   #808080;
--color-surface-grey-2: #595959;   /* button drop-shadow color */
--color-surface-brown:  #513c35;
--color-surface-brown-1:#301f18;

/* Semantic */
--color-system-green:   #32a800;
--color-system-red:     #df0b00;
--color-system-warning: #ce7f00;
--color-red-0:          #f7cac2;
--color-red-1:          #f4b8ad;
--color-red-main:       #df0b00;
--color-text-standard:  #171414;
```

**In Tailwind classes:** `bg-primary-orange`, `text-surface-ink`, `border-paper-2`, etc.

> **Never hardcode hex values** — always use the token names so overrides propagate correctly.

### Mapping Bread Orange to Starlight's Accent System

Starlight reads `--color-accent-*` from your `@theme` block and applies it to links, active nav items, and highlights. Derive the scale from the exact token values above:

```css
@theme {
  /* Bread orange accent scale — derived from #ea6023 */
  --color-accent-50:  #fdf3ec;
  --color-accent-100: #fae0cb;
  --color-accent-200: #f5c09a;
  --color-accent-300: #f09a66;
  --color-accent-400: #eb7840;
  --color-accent-500: #ea6023;   /* = --color-primary-orange */
  --color-accent-600: #d14a0f;   /* = --color-orange-1 (hover) */
  --color-accent-700: #b83c08;   /* = --color-orange-2 */
  --color-accent-800: #8c2d06;
  --color-accent-900: #5e1e04;
  --color-accent-950: #3a1202;

  /* Warm neutral gray scale — derived from paper/surface tokens */
  --color-gray-50:  #fdfcf9;   /* = --color-paper-0 */
  --color-gray-100: #f6f3eb;   /* = --color-paper-main */
  --color-gray-200: #f0ebe0;   /* = --color-paper-1 */
  --color-gray-300: #eae2d6;   /* = --color-paper-2 */
  --color-gray-400: #c8bfb0;
  --color-gray-500: #808080;   /* = --color-surface-grey */
  --color-gray-600: #595959;   /* = --color-surface-grey-2 */
  --color-gray-700: #3d3d3d;
  --color-gray-800: #2a2a2a;
  --color-gray-900: #1b201a;   /* = --color-surface-ink */
  --color-gray-950: #0f130f;
}
```

> Use the [Starlight Color Theme Editor](https://starlight.astro.build/guides/css-and-tailwind/#color-theme-editor) to preview and fine-tune these values.

---

## 5. Button System — LiftedButton

The signature Bread UI element is the `LiftedButton` — a drop-shadow offset effect that shifts up-left of a dark base layer on hover, and depresses on active. This is a key brand differentiator; do not substitute it with a standard button style.

### Presets

All five presets are defined in `LiftedButtonPresets.tsx`. The shadow layer is always `#595959` (`--color-surface-grey-2`).

|Preset|Background|Text|Hover bg|Hover text|
|---|---|---|---|---|
|`primary`|`#ea6023` (primary-orange)|`#f6f3eb` (paper-main)|`#d14a0f` (orange-1)|`#ffffff`|
|`secondary`|`#FBDED1`|`#ea6023` (primary-orange)|`#FFF1EA`|`#ea6023`|
|`stroke`|`#f6f3eb` (paper-main)|`#1b201a` (surface-ink)|`#eae2d6` (paper-2)|`#1b201a`|
|`destructive`|`#df0b00` (system-red)|`#f6f3eb` (paper-main)|`#BF0A00`|`#ffffff`|
|`positive`|`#32a800` (system-green)|`#f6f3eb` (paper-main)|`#2B8F00`|`#ffffff`|
|`burn`|`#f7cac2` (red-0)|`#df0b00` (red-main)|`#f4b8ad` (red-1)|`#df0b00`|

### Key Props

```tsx
// From harvested LiftedButton.tsx
<LiftedButton
  preset="primary"           // see table above
  offsetPx={4}               // shadow offset depth in px (default: 4)
  durationMs={300}           // transition duration in ms (default: 300)
  width="auto"               // "auto" | "full" | "mobile-full"
  scrollTo="section-id"      // smooth-scrolls to element by ID (requires hydration)
  leftIcon={<SomeIcon />}    // optional icon left of label
  rightIcon={<SomeIcon />}   // optional icon right of label
  disabled={false}
  onClick={() => {}}
>
  Button label
</LiftedButton>
```

### Actual CSS Class Structure

The button is rendered as two sibling elements inside a `<span>` wrapper — a shadow layer behind and the button itself on top. The lift effect is achieved by translating the button element up-left relative to the fixed shadow. All values come from CSS custom properties set as inline styles on the wrapper.

```css
/* Wrapper span — holds CSS vars, establishes group for :active */
/* position: relative; display: inline-block; user-select: none */

/* Shadow layer — fixed in place, always visible */
.lifted-button-shadow {
  position: absolute;
  inset: 0;
  background: var(--btn-shadow);   /* always #595959 */
  transform: translateX(2px) translateY(2px);
}

/* Button element */
.lifted-button-base {
  /* font-family: "Bread Body"; font-size: 1rem */
  /* display: inline-flex; align-items: center; justify-content: center */
  /* gap: 8px; padding: 0 37px; height: 3.5rem (h-14) */
  position: relative;
  z-index: 10;
}

.lifted-button {
  background-color: var(--btn-bg);
  color: var(--btn-text);
}

.lifted-button:hover {
  background-color: var(--btn-hover-bg);
  color: var(--btn-hover-text);
}

/* Motion: applied when not disabled */
.lifted-button-motion {
  transition-property: all;
  transition-timing-function: ease-out;
  transition-duration: var(--btn-duration);   /* e.g. 300ms */
}

/* Lift: button floats up-left of shadow */
.lifted-button-lifted {
  transform: translateX(-0.125rem) translateY(-0.125rem);   /* -translate-x-0.5 -translate-y-0.5 */
}

/* Active: button depresses back down to shadow on click */
.lifted-button-active {
  /* group-active: translates back to origin */
}
```

CSS custom properties set as inline styles on the wrapper (resolved via `colorsToStyleVars`):

```css
--btn-bg          /* preset background */
--btn-text        /* preset text color */
--btn-hover-bg    /* preset hover background */
--btn-hover-text  /* preset hover text color */
--btn-shadow      /* always #595959 */
--btn-offset      /* offsetPx prop, e.g. 4px */
--btn-duration    /* durationMs prop, e.g. 300ms */
```

> Note: the `--btn-offset` variable is set but the current `theme.css` uses hardcoded `translateX(2px) translateY(2px)` on the shadow layer rather than reading `--btn-offset`. If you need a custom offset depth, override the shadow transform directly.

### Pure `.astro` / HTML Replication

For contexts where you don't want React at all (e.g. Starlight MDX pages, static overrides):

```html
<!-- Primary preset, 4px offset -->
<span style="
  position: relative; display: inline-block; user-select: none;
  --btn-bg: #ea6023; --btn-text: #f6f3eb;
  --btn-hover-bg: #d14a0f; --btn-hover-text: #fff;
">
  <span aria-hidden style="
    position: absolute; inset: 0;
    background: #595959;
    transform: translateX(2px) translateY(2px);
  "></span>
  <a href="/your-link" class="bread-lifted-btn">
    Button label
  </a>
</span>
```

```css
.bread-lifted-btn {
  font-family: "Bread Body", sans-serif;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 2.3rem;
  height: 3.5rem;
  position: relative;
  z-index: 10;
  background-color: var(--btn-bg);
  color: var(--btn-text);
  transform: translateX(-0.125rem) translateY(-0.125rem);
  transition: all 300ms ease-out;
}

.bread-lifted-btn:hover {
  background-color: var(--btn-hover-bg);
  color: var(--btn-hover-text);
}

.bread-lifted-btn:active {
  transform: translateX(0.125rem) translateY(0.125rem);
}
```

---

## 6. Astro Starlight — Theming Architecture

### How CSS Overrides Work

Starlight's styles live inside the `starlight` cascade layer. **Plain unlayered CSS always wins** — no `!important` needed.

### Layer Order (Critical)

```css
/* src/styles/global.css */
@layer base, starlight, theme, components, utilities;

@import "@breadcoop/ui/theme";   /* fonts + color tokens — must come first */
@import '@astrojs/starlight-tailwind';
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities);

@theme {
  /* all Bread tokens here */
}
```

### Key `--sl-*` Variables

Full source: https://github.com/withastro/starlight/blob/main/packages/starlight/style/props.css

```css
:root {
  /* Typography */
  --sl-font: "Bread Body", sans-serif;
  --sl-font-mono: ui-monospace, monospace;

  /* Accent (orange) */
  --sl-color-accent-low:   /* light tint — used in dark mode sidebar */
  --sl-color-accent:       /* base orange */
  --sl-color-accent-high:  /* darker — for contrast on light backgrounds */

  /* Gray scale */
  --sl-color-white:
  --sl-color-gray-1:  /* lightest */
  --sl-color-gray-2:
  --sl-color-gray-3:
  --sl-color-gray-4:
  --sl-color-gray-5:
  --sl-color-gray-6:  /* darkest */
  --sl-color-black:

  /* Semantic aliases */
  --sl-color-text:         /* body text */
  --sl-color-text-accent:  /* link color */
  --sl-color-bg:           /* page background */
  --sl-color-bg-nav:       /* top nav background */
  --sl-color-bg-sidebar:   /* sidebar background */
  --sl-color-hairline:     /* borders/dividers */

  /* Type scale */
  --sl-text-xs: 0.75rem;
  --sl-text-sm: 0.875rem;
  --sl-text-base: 1rem;
  --sl-text-lg: 1.125rem;
  --sl-text-xl: 1.25rem;
  --sl-text-2xl: 1.5rem;
  --sl-text-3xl: 1.875rem;
  --sl-text-4xl: 2.25rem;
  --sl-text-5xl: 3rem;

  /* Layout */
  --sl-content-width: 45rem;
  --sl-sidebar-width: 18rem;
}

[data-theme='dark'] {
  --sl-color-text: var(--sl-color-gray-1);
  --sl-color-bg: var(--sl-color-gray-6);
}
```

### `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Bread Docs',
      customCss: [
        './src/styles/global.css',
      ],
      components: {
        Header: './src/overrides/Header.astro',
        Footer: './src/overrides/Footer.astro',
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
```

---

## 7. Starlight + Tailwind Integration

```bash
pnpm add @astrojs/starlight-tailwind
```

This package:

1. Configures `dark:` variants to use Starlight's `[data-theme='dark']` selector
2. Reads `--color-accent-*` and `--color-gray-*` from `@theme` and applies them to Starlight's UI
3. Restores essential Tailwind Preflight resets

**Prefer the `@theme` approach** — if `--color-accent-*` and `--color-gray-*` are set, Starlight inherits them automatically without manually setting every `--sl-color-*` variable.

---

## 8. React Component Hydration — The Astro Way

This is the most performance-critical section. Astro's default behavior is to render every React component to **pure static HTML with zero JavaScript**. A client directive is only added when that component actually needs to run JS in the browser.

### The Rule

> **No `client:*` directive = the component renders to HTML at build time. No JavaScript is shipped for that component.** The component is inert in the browser — event handlers are dropped, hooks don't run, browser APIs aren't available. Add a directive only when the component actually needs to be interactive.

### React Runtime Cost — Read This First

The React runtime (~30–40KB) is only loaded by the browser **when at least one component on the page uses a `client:*` directive**. Once loaded, the runtime is shared across all hydrated React components on that page.

- **Zero `client:*` components on a page = zero React runtime shipped** — even if you import many `@breadcoop/ui` components without directives
- **Even one `client:*` component on a page = React runtime loaded for everyone** — this is the primary reason to minimize hydrated islands
- Multiple hydrated React components on the same page don't pay the runtime cost again — the runtime is shared

This means: use static rendering (no directive) wherever possible, and batch interactivity into as few hydrated islands as necessary.

### Directive Quick Reference

|Directive|When to use|Priority|
|---|---|---|
|_(none)_|Component is purely visual — no onClick, no state, no browser APIs|No JS shipped|
|`client:load`|Must be interactive immediately (above-fold CTAs, nav menus)|High — loads on page load|
|`client:idle`|Interactivity is non-critical; can wait until browser is idle|Medium — deferred|
|`client:visible`|Component is below the fold; only hydrate when scrolled into view|Low — lazy|
|`client:only="react"`|Component uses browser-only APIs at render time (e.g. `localStorage`, `window`) and **cannot SSR at all**|High — skips SSR entirely|

**Never use `client:only` for `@breadcoop/ui` components** — they all SSR fine. Only use it for components that throw during SSR due to browser API usage.

### `@breadcoop/ui` Component Classification

Based on inspecting the compiled package source:

#### Prerender as static HTML — no directive needed

These components contain zero React state, no event handlers, and no browser API calls. They are pure presentational wrappers that output styled HTML elements. **Import and use them in `.astro` files without any `client:*` directive.**

```astro
---
// Using harvested source files (see Section 9 — no web3 baggage)
import { Heading1, Heading2, Heading3, Heading4, Heading5 } from '../components/bread/Typography';
import { Body, Caption, Typography } from '../components/bread/Typography';
import Logo from '../components/bread/Logo';
---

<!-- These all render to static HTML — zero JS shipped -->
<Heading1>Welcome to Bread Docs</Heading1>
<Heading2>Section Title</Heading2>
<Body>Body text content</Body>
<Caption>Metadata label</Caption>
<Logo color="orange" size={32} />
```

> **Footer:** Implement as a custom `.astro` component, not a harvested React file. See Section 10 for the structure to replicate.

#### LiftedButton — depends on usage

The LiftedButton's **hover/press animation is 100% CSS-driven** — confirmed by reading the compiled source. The component applies CSS class names (`lifted-button-motion`, `lifted-button-active`, etc.) and sets CSS custom properties (`--btn-offset`, `--btn-duration`, `--btn-bg`, etc.) via the `style` prop. The actual transition logic lives in `theme.css`. The only `useEffect` in the component is a dev-only CSS variable validation warning — it doesn't affect rendering or animation. The visual lift effect works without any JavaScript in the browser.

What **does** require hydration:

- `onClick` prop — React synthetic event, not wired up in static HTML
- `scrollTo` prop — uses `document.getElementById` at click time

Decision table:

|Usage|Directive|
|---|---|
|Visual/display only (no click action)|None|
|With `onClick` handler|`client:load` (above fold) or `client:idle` (below fold)|
|With `scrollTo` prop|`client:load` (above fold) or `client:idle` (below fold)|
|Below the fold with click action|`client:visible`|

```astro
---
import LiftedButton from '../components/bread/LiftedButton';
---

<!-- Display only — no JS needed, hover animation still works via CSS -->
<LiftedButton preset="primary">Learn More</LiftedButton>

<!-- Clickable CTA above fold — hydrate immediately -->
<LiftedButton client:load preset="primary" onClick={() => doSomething()}>
  Get Started
</LiftedButton>

<!-- Scroll-to link — needs JS for smooth scroll -->
<LiftedButton client:load scrollTo="contact-section" preset="stroke">
  Contact Us
</LiftedButton>

<!-- Below-fold button — defer hydration until visible -->
<LiftedButton client:visible preset="secondary" onClick={() => doSomething()}>
  Learn More
</LiftedButton>
```

#### Navbar and wallet-connected components — always need hydration

These components use React state, refs, context, and wallet hooks. Always hydrate:

```astro
---
import { Navbar, LoginButton } from '@breadcoop/ui';
---
<Navbar client:load app="fund" />
<LoginButton client:load app="fund" status="NOT_CONNECTED" />
```

### Setup: `@astrojs/react` Integration

React components from `@breadcoop/ui` require the React integration to be installed:

```bash
pnpm astro add react
```

This adds `@astrojs/react` to `astro.config.mjs` automatically, but **may not install `react` and `react-dom` peer dependencies** in all package manager setups. If you see peer dependency warnings or missing module errors, install them manually:

```bash
pnpm add react react-dom @types/react @types/react-dom
```

Confirm `astro.config.mjs` includes the integration correctly:

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [
    react(),   // must come BEFORE starlight
    starlight({
      title: 'Bread Docs',
      customCss: ['./src/styles/global.css'],
      components: {
        Header: './src/overrides/Header.astro',
        Footer: './src/overrides/Footer.astro',
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
```

**`react()` must be listed before `starlight()`** in the integrations array.

### Using React Components in `.mdx` Docs Pages

MDX pages in Starlight support React component imports natively (once `@astrojs/react` is installed). The same directive rules apply:

```mdx
---
title: Getting Started
---

import LiftedButton from '../components/bread/LiftedButton';
import { Heading2 } from '../components/bread/Typography';

<Heading2>Quick Start</Heading2>

This is a callout button:

<LiftedButton client:load preset="primary">Connect Wallet</LiftedButton>
```

### Passing Children and Slots

React components in Astro can receive children from `.astro` files. Pass static content through the `children` prop or use named slots:

```astro
<!-- Static children (text/HTML) — always works -->
<LiftedButton client:load preset="primary">
  Click me
</LiftedButton>

<!-- You CANNOT nest .astro components inside React components -->
<!-- This pattern is wrong: -->
<!-- <LiftedButton><SomeAstroComponent /></LiftedButton> -->
```

**Children from `.astro` to React components are plain strings, not React nodes.** Astro serializes children to a static string before passing them across the boundary. This means the React "render props" pattern will not work when passing from an `.astro` file into a React component:

```astro
<!-- This will NOT work as expected — children is a string, not a render function -->
<!-- <SomeReactComponent>{(data) => <span>{data}</span>}</SomeReactComponent> -->

<!-- Use named slots or restructure the component instead -->
```

### Props Serialization Constraint

Props passed to **hydrated** components (`client:*`) must be JSON-serializable — they are serialized to HTML attributes and re-read by the client runtime. Props passed to **static** (no directive) components do not need serialization — they are evaluated only at build time and never leave the server.

This means:

- **Static components (no directive):** props can be anything — functions, class instances, complex objects — since they only run at build time
- **Hydrated components (`client:*`):** strings, numbers, booleans, arrays, plain objects: ✅ serialize fine; functions (e.g. `onClick`): ✅ work because React handles these; non-serializable objects (class instances, Symbols): ❌ will not survive hydration

### Component Overrides

Full Starlight override list: https://starlight.astro.build/reference/overrides/

|Component key|Bread UI usage|
|---|---|
|`Header`|Use `Logo` (no directive) + `Navbar` (`client:load`)|
|`SiteTitle`|Swap in `<Logo>` from `@breadcoop/ui` — no directive needed|
|`Footer`|Custom `.astro` component — see Section 10 for structure|
|`PageTitle`|Use `<Heading1>` — no directive needed|

Example `SiteTitle` override using `Logo` without JS:

```astro
---
// src/overrides/SiteTitle.astro
import Logo from '../components/bread/Logo';
---
<a href="/">
  <Logo color="orange" size={32} text="Bread Docs" />
</a>
```

> **Navbar:** Not used in the docs site — it requires wallet integration (wagmi/privy). The Starlight default header nav is sufficient, themed via `--sl-color-*` tokens.

---

## 9. Dependency Strategy for Docs Sites

### The Problem

`@breadcoop/ui` is built for Bread's web apps, not a docs site. Its compiled bundle has top-level ESM `import` statements for:

```
wagmi / viem / viem/chains
@privy-io/react-auth
@rainbow-me/rainbowkit
```

These are listed as `peerDependencies` in `package.json` — meaning pnpm won't install them automatically. But because they are **top-level imports in the compiled bundle**, Vite will fail at build time with a "Cannot find module" error if they aren't installed. You can't skip them by simply not using the wallet components.

### Recommended Approach: Harvest the Source (Option C)

Copy only the source files for the components you actually need into your project. Skip the compiled package entirely for component code; keep `@breadcoop/ui/theme` for CSS tokens and fonts.

**Why this works:**

- The components you need (`Typography`, `LiftedButton`, `Logo`, `Footer`) have **zero web3 imports** in their source files
- Their only dependencies are `react`, `clsx`, `tailwind-merge`, and `@radix-ui/react-navigation-menu` (Footer uses Radix nav internally) — all lightweight and non-web3
- `@breadcoop/ui/theme` (the CSS file) imports nothing from JS — it's safe to keep using it
- You own the code, so you can adjust it freely

### Files to Copy

From the [bread-ui-kit GitHub repo](https://github.com/BreadchainCoop/bread-ui-kit/tree/main/src), copy these files into `src/components/bread/`:

```
src/components/bread/
├── Typography.tsx                  ← src/components/typography/Typography.tsx
├── LiftedButton.tsx                ← src/components/LiftedButton/LiftedButton.tsx
├── LiftedButtonPresets.tsx         ← src/components/LiftedButton/LiftedButtonPresets.tsx
├── cssValidation.ts                ← src/utils/cssValidation.ts
├── Logo.tsx                        ← src/components/Logo/Logo.tsx
└── logo-square.svg                 ← src/components/Logo/logo-square.svg (+ other SVG assets Logo.tsx references)
```

> **Footer:** Do not harvest `footer.tsx`, `links.ts`, or `tools.ts`. Implement the footer as a custom `.astro` component instead — see Section 10 for structure.

Update the relative import paths after copying. The inter-component dependencies are:

- `LiftedButton.tsx` → `LiftedButtonPresets.tsx`, `cssValidation.ts`

### Install Only What You Need

```bash
pnpm add react react-dom @types/react @types/react-dom clsx tailwind-merge
pnpm add @breadcoop/ui   # still needed for theme.css and fonts
```

You do **not** need to install: `wagmi`, `viem`, `@privy-io/react-auth`, `@rainbow-me/rainbowkit`, `@tanstack/react-query`.

> **Note on `@radix-ui/react-navigation-menu`:** This is only used by the `Navbar` component in the kit. Since the Footer is implemented as a custom `.astro` component (not harvested from the kit), and you're not using `Navbar`, you don't need Radix at all.

### Update Imports

In your `.astro` files and overrides, change import paths from the package to your local copies:

```astro
---
// Before (package import — pulls in web3 deps at build time)
import { Heading1, LiftedButton } from '@breadcoop/ui';

// After (local harvest — zero web3 baggage)
import { Heading1 } from '../components/bread/Typography';
import LiftedButton from '../components/bread/LiftedButton';
---
```

Keep the CSS import unchanged — it comes from the package and has no JS:

```css
/* src/styles/global.css — this stays the same */
@import "@breadcoop/ui/theme";
```

### Keeping Up with Changes

When the UI kit publishes updates:

1. Check the GitHub diff for the component files you copied
2. Pull in changes to `theme.css` automatically via `pnpm update @breadcoop/ui`
3. Manually apply any relevant changes to your harvested `.tsx` files

This is a small maintenance cost — the components are simple and unlikely to change frequently.

---

## 10. Visual Details from `bread.coop`

- **Grain texture** — sections use `background-image: url('/grain-texture.jpg')` with `background-blend-mode: overlay`
- **High contrast** — alternating near-black and cream/white section backgrounds
- **Thick borders** — `2px solid #000` paired with the box-shadow offset
- **Never use generic Tailwind orange** (`orange-500` etc.) — always use `primary-orange` token

### Footer Structure

The footer should be implemented as a custom `.astro` component — it is fully static, so React is not needed and adds unnecessary runtime cost. Adapt link content for the docs site context. The footer has two modes set via a prop: `colored` (orange background, default) and `transparent` (no background).

**Overall layout:**

- `px-4 py-12` padding, full width
- `colored` mode: `bg-primary-orange text-white`
- `transparent` mode: no background, `text-surface-ink`
- Max-width container: `max-w-7xl mx-auto`

**Top section** — two-column flex at `xl`, stacked below:

Left column (logo + social):

- `Logo` component, white color in `colored` mode
- Tagline: "Solidarity forever." in `font-breadBody`
- Row of social icon links: YouTube, LinkedIn, GitHub, Discord, X, newsletter (Paragraph), Farcaster
- Icons are `@phosphor-icons` in the kit — replace with inline SVGs in an `.astro` component

Right section — four link columns, flex row at `md`:

- **Cooperative** — Documentation, Blog, Contribute (adapt for docs site)
- **Solidarity tools** — Solidarity Fund (external), Stacks (coming soon, no link), Safety Net (coming soon, no link)
- **Reach out** — `contact@bread.coop` mailto with envelope icon
- **Support us** — Donate in crypto (Giveth, external), Donate in fiat (Open Collective, external)

Column header style: `font-breadBody text-lg mb-4`, color `#EA5817` in `transparent` mode Link style: `font-breadBody`, external links get an `ArrowUpRight` icon; coming-soon links are `opacity-50` with no `href`

**Bottom bar** — `border-t border-orange-0 pt-6`, flex row at `md`:

- Left: `Creative Commons ©BREAD Cooperative`
- Right: `All Rights Reserved`
- Both in `font-breadBody text-sm`

**Implementation note:** The footer imports `@phosphor-icons/react` for social icons and the arrow/envelope icons. In a pure `.astro` implementation, replace these with inline SVGs or any icon library already in your project. The Phosphor icon set has a web component / SVG variant that works without React.

---

## 11. Common Mistakes

1. **Tailwind v3 syntax** — The kit requires v4. Use `@theme {}`, not `module.exports`. Use `@import "tailwindcss"`, not `@tailwind base`.
2. **Wrong import order** — `@import "@breadcoop/ui/theme"` must come after `@import "tailwindcss"`.
3. **Hardcoding hex values** — Use `var(--color-primary-orange)` or `bg-primary-orange`, not `#F97316`.
4. **Missing dark mode accent variants** — Set all three: `--sl-color-accent-low`, `--sl-color-accent`, `--sl-color-accent-high`. The `@theme` approach handles this automatically.
5. **Wrong font family name in CSS** — The CSS `font-family` names registered by `@breadcoop/ui/theme` are `"Bread Display"` and `"Bread Body"`. The `.woff2` files happen to be named `Pogaca*.woff2`, but those are file names, not CSS names. Using `'Pogaca Display'` or `'Pogaca Body'` in CSS will not match and fonts will fall back to system sans-serif.
6. **Manually copying font files** — `@breadcoop/ui` **does** bundle `.woff2` files in `dist/fonts/`. When you `@import "@breadcoop/ui/theme"`, Vite resolves and serves them automatically. No manual copying is needed.
7. **Importing from `@breadcoop/ui` directly in a docs site** — The package's compiled bundle has top-level imports for wagmi, viem, privy, and rainbowkit. These are `peerDependencies`, so pnpm won't install them — but Vite will fail at build time trying to resolve them. Use the harvested source approach (Section 9) instead.
8. **Over-hydrating React components** — Do NOT add `client:load` to `Heading1`, `Body`, `Caption`, or `Logo`. These components are purely presentational — they render to static HTML with zero JS. Adding a directive ships unnecessary React runtime to the user. The Footer should be a custom `.astro` component (not React at all).
9. **Using `client:only` instead of `client:load`** — `client:only="react"` skips server-side rendering entirely, showing nothing until JS loads. Prefer `client:load` for `@breadcoop/ui` components — they all SSR correctly.
10. **`react()` integration missing or wrong order** — `@astrojs/react` must be installed and `react()` must appear **before** `starlight()` in the `integrations` array in `astro.config.mjs`.
11. **Passing `.astro` components as children to React islands** — Astro components cannot be imported inside React components. Use Astro's slot/children pattern from a parent `.astro` file instead.
12. **Missing `react` and `react-dom` peer dependencies** — `pnpm astro add react` may not install `react` and `react-dom` automatically. If you see resolution errors, run `pnpm add react react-dom @types/react @types/react-dom` explicitly.
13. **Expecting render props to work from `.astro` to React** — Children passed from `.astro` to a React component are serialized to a plain string, not a React node tree. The render props pattern (`{(data) => <span>{data}</span>}`) will not work across this boundary. Restructure using named slots or keep render-prop logic fully inside a React component.
14. **Attaching `client:*` to `.astro` components** — Client directives can only be applied to framework components (React, Vue, Svelte, etc.). If you need to add interactivity to a Starlight component override (which is always a `.astro` file), import a React component inside it and attach the directive to that React component, not the `.astro` wrapper.

---

## 12. File Checklist

|File|Purpose|
|---|---|
|`src/styles/global.css`|Tailwind v4 entry + layer order + `@theme` tokens|
|`astro.config.mjs`|`customCss`, Vite plugin, component overrides|
|`public/grain-texture.png`|Texture asset for section backgrounds|
|`src/overrides/`|Custom `.astro` components replacing Starlight defaults|
|**Harvested component files**||
|`src/components/bread/Typography.tsx`|Heading1–5, Body, Caption, Typography|
|`src/components/bread/LiftedButton.tsx`|Lifted button component|
|`src/components/bread/LiftedButtonPresets.tsx`|Button color presets and color-to-CSS-var helper|
|`src/components/bread/cssValidation.ts`|Dev-mode CSS variable checker (required by LiftedButton)|
|`src/components/bread/Logo.tsx`|Brand logo component|
|`src/components/bread/logo-square.svg`|SVG asset used by Logo (copy all SVGs from the Logo dir)|
|`src/overrides/Footer.astro`|Custom footer — implement from scratch using structure in Section 10|

> Fonts are bundled inside `@breadcoop/ui` and served automatically via `@import "@breadcoop/ui/theme"`. No manual font file copying needed.

---

## 13. Reference Links

|Resource|URL|
|---|---|
|UI Kit repo|https://github.com/BreadchainCoop/bread-ui-kit|
|UI Kit FONTS.md|https://github.com/BreadchainCoop/bread-ui-kit/blob/main/FONTS.md|
|Storybook|https://breadcoopstorybook.netlify.app/|
|Landing repo|https://github.com/BreadchainCoop/breadcoop-landing|
|Live site|https://bread.coop/|
|Starlight CSS/Tailwind guide|https://starlight.astro.build/guides/css-and-tailwind/|
|Starlight props.css|https://github.com/withastro/starlight/blob/main/packages/starlight/style/props.css|
|Starlight overrides guide|https://starlight.astro.build/guides/overriding-components/|
|Starlight config reference|https://starlight.astro.build/reference/configuration/|
|**Astro islands architecture**|https://docs.astro.build/en/concepts/islands/|
|**Astro framework components guide**|https://docs.astro.build/en/guides/framework-components/|
|**Astro client directives reference**|https://docs.astro.build/en/reference/directives-reference/|
|Tailwind v4 `@theme` docs|https://tailwindcss.com/docs/theme|
|`@astrojs/starlight-tailwind`|https://www.npmjs.com/package/@astrojs/starlight-tailwind|
|Starlight color theme editor|https://starlight.astro.build/guides/css-and-tailwind/#color-theme-editor|