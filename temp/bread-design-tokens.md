# Bread Cooperative Design System v1
## Design Tokens Reference for Astro Starlight Implementation

> **Source**: Figma Design System v1 - [View File](https://www.figma.com/design/qbL8FslnxILdRFnYlbQmMU/Copy-of-Bread-Design-System)
> 
> **Status**: In Progress - Design system is evolving
>
> **Last Extracted**: 2025-01-13

---

## Overview

This document contains all design tokens extracted from the official Bread Cooperative Design System v1. The system is organized into four main categories:

1. **Foundations**: Colors, typefaces, logos
2. **Clickable Elements**: Buttons, chips, tooltips
3. **Navigation Elements**: Menus, navigation patterns
4. **Swap Elements**: Web3-specific components

**Source Citation**: Welcome guide frame (Node ID: `73:2138`)

---

## 🎨 Color System

### Primary Colors

```css
/* Primary Brand Colors */
--color-primary-orange: #ea6023;
--color-primary-jade: #286b63;
--color-primary-blue: #1c5bb9;
```

**Source**: Background color `#ea6023` observed in welcome guide chip component (Node ID: `73:2143`), confirmed across bread-ui-kit implementation

### Orange Scale

```css
--color-orange-0: #ffc080;
--color-orange-1: #d14a0f;
--color-orange-2: #b83c08;
```

**Source**: bread-ui-kit `theme.css` implementation

### Jade Scale

```css
--color-jade-0: #9cacc6;
--color-jade-1: #72849d;
--color-jade-2: #134a44;
```

**Source**: bread-ui-kit `theme.css` implementation

### Blue Scale

```css
--color-blue-0: #a8c3ea;
--color-blue-1: #588ddb;
--color-blue-2: #1b4a90;
```

**Source**: bread-ui-kit `theme.css` implementation

### Paper/Background Colors

```css
--color-paper-main: #f6f3eb;
--color-paper-0: #fdfcf9;
--color-paper-1: #f0ebe0;
--color-paper-2: #eae2d6;
```

**Source**: Background color `#f6f3eb` extracted from Figma welcome guide (Node ID: `73:2138`), full scale from bread-ui-kit

### Surface Colors

```css
--color-surface-ink: #1b201a;
--color-surface-grey: #808080;
--color-surface-grey-2: #595959;
--color-surface-brown: #513c35;
--color-surface-brown-1: #301f18;
```

**Source**: bread-ui-kit `theme.css` implementation

### Text Colors

```css
--color-text-standard: #171414;
--color-text-gray: #616161;
```

**Source**: Text color `#616161` from Figma (Node ID: `73:2147`), black from Node ID: `73:2145`

### System Colors

```css
--color-system-green: #32a800;
--color-system-red: #df0b00;
--color-system-warning: #ce7f00;
```

**Source**: bread-ui-kit `theme.css` implementation

### Red Scale (for destructive actions)

```css
--color-red-0: #f7cac2;
--color-red-1: #f4b8ad;
--color-red-main: #df0b00;
```

**Source**: bread-ui-kit `theme.css` implementation

### Neutral Colors

```css
--color-white: #ffffff;
--color-black: #000000;
```

---

## 📝 Typography System

### Font Families

The design system uses two custom font families:

#### Bread Display (Display/Headings)
- **Usage**: Large headings (H1-H3)
- **Weights**: 900 (Black), 700 (Bold), 400 (Regular)
- **Format**: WOFF2
- **Files**:
  - `PogacaDisplayBlack.woff2`
  - `PogacaDisplayBold.woff2`
  - `PogacaDisplayRegular.woff2`

**Source**: Font family from bread-ui-kit `src/fonts/fonts.css`

**Figma Reference**: Typography observed in welcome guide shows display typography (Node ID: `73:2145` - 64px bold uppercase)

#### Bread Body (Body/UI Text)
- **Usage**: Body text, smaller headings (H4-H5), UI elements
- **Weights**: 700 (Bold), 400 (Regular)
- **Format**: WOFF2
- **Files**:
  - `PogacaBodyBold.woff2`
  - `PogacaBodyRegular.woff2`

**Source**: Font family from bread-ui-kit `src/fonts/fonts.css`

**Figma Reference**: Body typography observed (Node ID: `73:2147` - 24px regular)

### CSS Variable Definition

```css
:root {
  --font-breadDisplay: "Bread Display", ui-sans-serif, system-ui, sans-serif;
  --font-breadBody: "Bread Body", ui-sans-serif, system-ui, sans-serif;
}
```

### Typography Scale

#### Heading 1
```css
.text-h1 {
  font-family: var(--font-breadDisplay);
  font-weight: 900;
  font-size: 3rem; /* 48px mobile */
  line-height: 36px;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

@media (min-width: 768px) {
  .text-h1 {
    font-size: 96px;
    line-height: 76px;
  }
}

@media (min-width: 1280px) {
  .text-h1 {
    font-size: 7rem; /* 112px */
    line-height: 83px;
  }
}
```

**Source**: bread-ui-kit `theme.css`, responsive scaling pattern

**Figma Reference**: Display heading at 64px (Node ID: `73:2145`)

#### Heading 2
```css
.text-h2 {
  font-family: var(--font-breadDisplay);
  font-weight: 900;
  font-size: 3rem; /* 48px */
  line-height: 36px;
  letter-spacing: -0.03em;
}

@media (min-width: 1280px) {
  .text-h2 {
    font-size: 80px;
    line-height: 63px;
  }
}
```

**Source**: bread-ui-kit `theme.css`

#### Heading 3
```css
.text-h3 {
  font-family: var(--font-breadDisplay);
  font-weight: 900;
  font-size: 1.5rem; /* 24px mobile */
  line-height: 20px;
  letter-spacing: -0.02em;
}

@media (min-width: 768px) {
  .text-h3 {
    font-size: 2.5rem; /* 40px */
    line-height: 36px;
  }
}

@media (min-width: 1280px) {
  .text-h3 {
    font-size: 3rem; /* 48px */
    line-height: 48px;
  }
}
```

**Source**: bread-ui-kit `theme.css`

**Figma Reference**: Heading sizes observed at 32px (Node ID: `73:2153`)

#### Heading 4
```css
.text-h4 {
  font-family: var(--font-breadBody);
  font-weight: 700;
  font-size: 24px;
  line-height: 24px;
}

@media (min-width: 1280px) {
  .text-h4 {
    font-size: 2rem; /* 32px */
    line-height: 2rem;
  }
}
```

**Source**: bread-ui-kit `theme.css`

#### Heading 5
```css
.text-h5 {
  font-family: var(--font-breadBody);
  font-weight: 400;
  font-size: 1rem; /* 16px */
}

@media (min-width: 1280px) {
  .text-h5 {
    font-size: 1.5rem; /* 24px */
    line-height: 24px;
  }
}
```

**Source**: bread-ui-kit `theme.css`

#### Body Text
```css
.text-body {
  font-family: var(--font-breadBody);
  font-size: 16px;
  font-weight: 400;
}

.text-body-bold {
  font-family: var(--font-breadBody);
  font-size: 16px;
  font-weight: 700;
}
```

**Source**: bread-ui-kit `theme.css`

**Figma Reference**: Body text at 24px (Node ID: `73:2147`, `73:2153`)

#### Caption
```css
.text-caption {
  font-family: var(--font-breadBody);
  font-size: 0.7rem; /* ~11px */
}
```

**Source**: bread-ui-kit `theme.css`

---

## 🔘 Component Tokens

### Button System (LiftedButton)

The signature component of the design system featuring a "lifted" shadow effect.

#### Base Structure
```css
.lifted-button-base {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font-breadBody);
  font-size: 16px;
  padding: 0 37px;
  height: 56px;
  cursor: pointer;
  margin-bottom: 4px;
  z-index: 10;
}
```

**Source**: bread-ui-kit `theme.css`, component class definitions

#### Shadow/Offset Effect
```css
.lifted-button-shadow {
  position: absolute;
  inset: 0;
  background-color: var(--color-surface-grey-2);
  margin-bottom: 4px;
}

.lifted-button-lifted {
  transform: translate(-2px, -2px);
}

.lifted-button-active {
  /* On active/press */
  transform: translate(2px, 2px);
}

.lifted-button-motion {
  transition: all 300ms ease-out;
}
```

**Variables**:
- `--btn-offset`: Default 4px
- `--btn-duration`: Default 300ms

**Source**: bread-ui-kit `LiftedButton.tsx` and `theme.css`

#### Button Presets

**Primary**:
```css
--btn-bg: var(--color-primary-orange);
--btn-text: var(--color-paper-main);
--btn-hover-bg: var(--color-orange-1);
--btn-hover-text: #ffffff;
--btn-shadow: #595959;
```

**Secondary**:
```css
--btn-bg: #FBDED1;
--btn-text: var(--color-primary-orange);
--btn-hover-bg: #FFF1EA;
--btn-hover-text: var(--color-primary-orange);
--btn-shadow: #595959;
```

**Stroke**:
```css
--btn-bg: var(--color-paper-main);
--btn-text: var(--color-surface-ink);
--btn-hover-bg: var(--color-paper-2);
--btn-hover-text: var(--color-surface-ink);
--btn-shadow: #595959;
```

**Burn** (red variant):
```css
--btn-bg: var(--color-red-0);
--btn-text: var(--color-red-main);
--btn-hover-bg: var(--color-red-1);
--btn-hover-text: var(--color-red-main);
--btn-shadow: #595959;
```

**Destructive**:
```css
--btn-bg: var(--color-system-red);
--btn-text: var(--color-paper-main);
--btn-hover-bg: #BF0A00;
--btn-hover-text: #ffffff;
--btn-shadow: #595959;
```

**Positive**:
```css
--btn-bg: var(--color-system-green);
--btn-text: var(--color-paper-main);
--btn-hover-bg: #2B8F00;
--btn-hover-text: #ffffff;
--btn-shadow: #595959;
```

**Source**: bread-ui-kit `LiftedButtonPresets.tsx`

#### Width Variants
- `auto`: Natural width
- `full`: 100% width
- `mobile-full`: 100% on mobile, auto on desktop (breakpoint: 1280px)

**Source**: bread-ui-kit `LiftedButton.tsx`

### Logo Component

The logo has multiple variants and color options:

#### Variants
- **Default**: Full circular logo
- **Square**: Logo in rounded square container
- **Line**: Outlined/stroke version

**Source**: bread-ui-kit `Logo.tsx`

**Figma Reference**: Logo visible in welcome guide (Node ID: `73:2139` - Subtract boolean operation forming logo shape)

#### Colors
- **Orange** (default): `--color-primary-orange`
- **Blue**: `--color-primary-blue`
- **Jade**: `--color-primary-jade`
- **White**: `--color-white`

**Source**: bread-ui-kit `Logo.tsx`, color prop options

#### Size
- Default: 32px
- Configurable via `size` prop

---

## 📐 Spacing & Layout

### Container Widths
```css
--max-width-sm: 388px;    /* Mobile */
--max-width-md: 768px;    /* Tablet */
--max-width-lg: 1280px;   /* Desktop */
--max-width-xl: 1920px;   /* Wide */
```

**Source**: Observed in bread.coop production site layout patterns

### Responsive Breakpoints
```css
/* Mobile-first approach */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1280px) { /* Desktop */ }
```

**Source**: bread-ui-kit component responsive patterns

### Common Spacing Scale
```
4px, 6px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px
```

**Source**: Gap and padding values from bread-ui-kit components

---

## 🎭 Special Effects

### Grain Texture Overlay
- **Usage**: Applied over dark backgrounds for tactile feel
- **File**: `grain-texture.jpg`
- **Application**: 
  ```css
  .grain-overlay {
    position: absolute;
    inset: 0;
    background-image: url('/grain-texture.jpg');
    opacity: 1;
    mix-blend-mode: overlay;
  }
  ```

**Source**: bread.coop production site, used on surface-ink backgrounds

### Border Styles
```css
/* Standard borders */
border: 1px solid var(--color-primary-orange);

/* Card/section borders */
border: 1px solid var(--color-orange-0); /* lighter variant */
```

**Source**: Component borders in bread.coop production

---

## 🔧 Implementation Guide for Astro Starlight

### Step 1: Font Setup

Create `src/styles/fonts.css`:

```css
@font-face {
  font-family: "Bread Display";
  src: url("/fonts/PogacaDisplayBlack.woff2") format("woff2");
  font-weight: 900;
  font-display: swap;
}

@font-face {
  font-family: "Bread Display";
  src: url("/fonts/PogacaDisplayBold.woff2") format("woff2");
  font-weight: 700;
  font-display: swap;
}

@font-face {
  font-family: "Bread Display";
  src: url("/fonts/PogacaDisplayRegular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: "Bread Body";
  src: url("/fonts/PogacaBodyRegular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: "Bread Body";
  src: url("/fonts/PogacaBodyBold.woff2") format("woff2");
  font-weight: 700;
  font-display: swap;
}

:root {
  --font-breadDisplay: "Bread Display", ui-sans-serif, system-ui, sans-serif;
  --font-breadBody: "Bread Body", ui-sans-serif, system-ui, sans-serif;
}
```

### Step 2: Color Variables

Create `src/styles/tokens.css`:

```css
:root {
  /* Primary Colors */
  --color-primary-orange: #ea6023;
  --color-primary-jade: #286b63;
  --color-primary-blue: #1c5bb9;

  /* Orange Scale */
  --color-orange-0: #ffc080;
  --color-orange-1: #d14a0f;
  --color-orange-2: #b83c08;

  /* Jade Scale */
  --color-jade-0: #9cacc6;
  --color-jade-1: #72849d;
  --color-jade-2: #134a44;

  /* Blue Scale */
  --color-blue-0: #a8c3ea;
  --color-blue-1: #588ddb;
  --color-blue-2: #1b4a90;

  /* Paper/Backgrounds */
  --color-paper-main: #f6f3eb;
  --color-paper-0: #fdfcf9;
  --color-paper-1: #f0ebe0;
  --color-paper-2: #eae2d6;

  /* Surface Colors */
  --color-surface-ink: #1b201a;
  --color-surface-grey: #808080;
  --color-surface-grey-2: #595959;
  --color-surface-brown: #513c35;
  --color-surface-brown-1: #301f18;

  /* Text */
  --color-text-standard: #171414;
  --color-text-gray: #616161;

  /* System Colors */
  --color-system-green: #32a800;
  --color-system-red: #df0b00;
  --color-system-warning: #ce7f00;

  /* Red Scale */
  --color-red-0: #f7cac2;
  --color-red-1: #f4b8ad;
  --color-red-main: #df0b00;

  /* Neutrals */
  --color-white: #ffffff;
  --color-black: #000000;

  /* Fonts */
  --font-breadDisplay: "Bread Display", ui-sans-serif, system-ui, sans-serif;
  --font-breadBody: "Bread Body", ui-sans-serif, system-ui, sans-serif;
}
```

### Step 3: Starlight Configuration

Update `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Bread Docs',
      customCss: [
        './src/styles/fonts.css',
        './src/styles/tokens.css',
        './src/styles/bread-theme.css',
      ],
      // ... other config
    }),
  ],
});
```

### Step 4: Override Starlight Theme

Create `src/styles/bread-theme.css`:

```css
/* Apply Bread fonts to Starlight elements */
:root {
  --sl-font: var(--font-breadBody);
  --sl-font-system: var(--font-breadBody);
}

/* Headings */
.sl-markdown-content h1 {
  font-family: var(--font-breadDisplay);
  font-weight: 900;
  text-transform: uppercase;
  color: var(--color-primary-orange);
}

.sl-markdown-content h2 {
  font-family: var(--font-breadDisplay);
  font-weight: 900;
  color: var(--color-surface-ink);
}

.sl-markdown-content h3 {
  font-family: var(--font-breadDisplay);
  font-weight: 900;
  color: var(--color-surface-ink);
}

/* Body text */
.sl-markdown-content p {
  font-family: var(--font-breadBody);
  color: var(--color-text-standard);
}

/* Links */
.sl-markdown-content a {
  color: var(--color-primary-orange);
}

.sl-markdown-content a:hover {
  color: var(--color-orange-1);
}

/* Background */
body {
  background-color: var(--color-paper-main);
}
```

---

## 📋 Component Checklist

### Priority 1: Foundation
- [ ] Install custom fonts (Bread Display, Bread Body)
- [ ] Set up CSS custom properties for colors
- [ ] Configure Tailwind CSS v4 (if needed)
- [ ] Apply base typography styles

### Priority 2: Core Components
- [ ] Implement LiftedButton component
- [ ] Implement Logo component with variants
- [ ] Create typography components (H1-H5, Body, Caption)
- [ ] Style links and inline elements

### Priority 3: Layout
- [ ] Override Starlight navbar styling
- [ ] Create footer component
- [ ] Apply container widths and spacing
- [ ] Implement responsive breakpoints

### Priority 4: Documentation Elements
- [ ] Style code blocks
- [ ] Customize callouts/admonitions
- [ ] Apply table styling
- [ ] Style sidebar navigation

### Priority 5: Polish
- [ ] Add grain texture to dark sections
- [ ] Optimize animations
- [ ] Accessibility audit
- [ ] Performance testing

---

## 🎯 Design Principles

From the Figma design system documentation:

1. **Solidarity First**: Design emphasizes worker ownership and collective action
2. **Accessibility Standards**: All interactive elements maintain WCAG compliance
3. **Craft Aesthetic**: Tactile elements like grain textures and shadow effects
4. **Evolving System**: Built for continuous improvement and community input

**Source**: Figma welcome guide (Node ID: `73:2138`, `73:2153`)

---

## 📚 Additional Resources

- **Figma File**: https://www.figma.com/design/qbL8FslnxILdRFnYlbQmMU/Copy-of-Bread-Design-System
- **Reference Implementation**: bread-ui-kit repository
- **Production Example**: https://bread.coop
- **Documentation**: Check Bread Cooperative docs for updates

---

**Document Version**: 1.0
**Last Updated**: 2025-01-13
**Maintained By**: Bread Cooperative Design Team
