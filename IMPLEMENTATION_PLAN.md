# Bread Design System v1 - Astro Starlight Implementation Plan

**Project**: bread-docs
**Target**: Complete design overhaul using Bread Cooperative Design System v1
**Framework**: Astro v5.6.1 + Starlight v0.36.2
**Reference**: temp/bread-design-tokens.md

---

## 1. Prerequisites Analysis

### 1.1 Dependencies to Install

#### Required Dependencies
```bash
# Tailwind CSS v4 (optional - evaluate during implementation)
npm install -D tailwindcss@next @tailwindcss/vite

# Or use pure CSS custom properties (recommended for Starlight)
# No additional dependencies needed - Starlight has built-in CSS support
```

**Decision Point**: Tailwind CSS v4 vs Pure CSS
- **Tailwind v4**: Better for utility-first development, matches bread-ui-kit approach
- **Pure CSS**: Simpler, lighter, better Starlight integration, no build complexity
- **Recommendation**: Start with **Pure CSS** approach, add Tailwind only if needed for complex components

#### Optional Dependencies
```bash
# None required - Starlight includes everything needed for basic styling
```

### 1.2 Font Files Required

**Five WOFF2 font files** need to be obtained from the bread-ui-kit repository or Bread Cooperative:

#### Bread Display Family
1. `PogacaDisplayBlack.woff2` (weight: 900)
2. `PogacaDisplayBold.woff2` (weight: 700)
3. `PogacaDisplayRegular.woff2` (weight: 400)

#### Bread Body Family
4. `PogacaBodyBold.woff2` (weight: 700)
5. `PogacaBodyRegular.woff2` (weight: 400)

**Location**: Place in `public/fonts/` directory

**Fallback Strategy**: If fonts unavailable initially, implement system font stack and add custom fonts later:
```css
--font-breadDisplay: ui-sans-serif, system-ui, sans-serif;
--font-breadBody: ui-sans-serif, system-ui, sans-serif;
```

### 1.3 Assets Required

#### Essential Assets
1. **Logo Files**:
   - SVG format for all variants (default, square, line)
   - All color variants (orange, blue, jade, white)
   - Source: Extract from bread-ui-kit or Figma

2. **Grain Texture**:
   - `grain-texture.jpg` for overlay effects
   - Used on dark backgrounds (surface-ink)

3. **Favicon**:
   - Replace current `public/favicon.svg` with Bread logo variant

#### Nice-to-Have Assets
- Social share images using Bread branding
- Custom 404 page illustrations

---

## 2. Architecture Decisions

### 2.1 Styling Approach

**Decision: CSS Custom Properties + Starlight Overrides**

**Rationale**:
- Starlight has excellent built-in CSS custom property support
- Avoids Tailwind v4 migration complexity
- Lighter bundle size
- Easier maintenance for documentation site
- Can migrate specific components to Tailwind later if needed

**Structure**:
```
src/styles/
├── fonts.css          # @font-face declarations
├── tokens.css         # Design token CSS custom properties
├── theme.css          # Starlight CSS property overrides
├── components.css     # Custom component styles (LiftedButton, etc.)
└── global.css         # Global overrides and utilities
```

### 2.2 Component Architecture

**Decision: Astro Components First, Islands for Interactivity**

**Component Strategy**:

1. **Pure Astro Components** (Static, no JS):
   - Typography components (H1-H5)
   - Logo variants
   - Layout components (Header, Footer, Container)
   - Card components
   - Basic buttons (non-interactive lifted buttons)

2. **Astro Islands** (Interactive, client-side JS):
   - LiftedButton with hover/active states
   - Navigation menus with dropdowns
   - Search functionality
   - Theme toggles (if implementing dark mode)

**Structure**:
```
src/components/
├── bread/                    # Bread Design System components
│   ├── buttons/
│   │   ├── LiftedButton.astro
│   │   └── LiftedButtonInteractive.astro (client:load)
│   ├── typography/
│   │   ├── Heading.astro
│   │   └── Text.astro
│   ├── layout/
│   │   ├── Container.astro
│   │   ├── Header.astro
│   │   └── Footer.astro
│   └── brand/
│       └── Logo.astro
└── overrides/               # Starlight component overrides
    ├── Head.astro
    ├── Header.astro
    ├── Footer.astro
    └── PageFrame.astro
```

### 2.3 React → Astro Migration Strategy

**bread-ui-kit uses React, we're using Astro**

**Conversion Approach**:

1. **Analyze React Component**:
   ```tsx
   // bread-ui-kit/LiftedButton.tsx
   export function LiftedButton({ children, variant, onClick }) {
     const [isPressed, setIsPressed] = useState(false);
     return <button className={styles}>...</button>
   }
   ```

2. **Convert to Astro**:
   ```astro
   ---
   // LiftedButton.astro
   interface Props {
     variant?: 'primary' | 'secondary' | 'stroke';
     href?: string;
   }
   const { variant = 'primary', href } = Astro.props;
   ---
   <a href={href} class={`lifted-button lifted-button-${variant}`}>
     <slot />
   </a>
   ```

3. **Add Interactivity if Needed**:
   ```astro
   ---
   // LiftedButtonInteractive.astro
   const { variant = 'primary' } = Astro.props;
   ---
   <button class={`lifted-button lifted-button-${variant}`}>
     <slot />
   </button>
   <script>
     // Client-side interaction
   </script>
   ```

**Migration Priority**:
- Phase 1: Static visual components (typography, colors, layout)
- Phase 2: Basic interactive components (buttons, links)
- Phase 3: Complex interactive components (navigation, search)

### 2.4 Starlight Integration Strategy

**Approach: Override CSS Properties First, Components Second**

**Level 1 - CSS Custom Properties** (Minimal invasiveness):
```css
:root {
  --sl-font: var(--font-breadBody);
  --sl-color-accent: var(--color-primary-orange);
  --sl-color-bg: var(--color-paper-main);
  /* ... map all Starlight properties to Bread tokens */
}
```

**Level 2 - Custom CSS Classes** (More control):
```css
.sl-markdown-content h1 {
  font-family: var(--font-breadDisplay);
  text-transform: uppercase;
  /* ... custom styles */
}
```

**Level 3 - Component Overrides** (Full control):
```js
// astro.config.mjs
starlight({
  components: {
    Header: './src/components/overrides/Header.astro',
    Footer: './src/components/overrides/Footer.astro',
  }
})
```

**Strategy**: Implement Level 1 & 2 first (80% of visual changes), then selectively override components for structural changes.

---

## 3. File Structure Plan

### 3.1 Complete Directory Structure

```
bread-docs/
├── public/
│   ├── fonts/                           # Custom font files
│   │   ├── PogacaDisplayBlack.woff2
│   │   ├── PogacaDisplayBold.woff2
│   │   ├── PogacaDisplayRegular.woff2
│   │   ├── PogacaBodyBold.woff2
│   │   └── PogacaBodyRegular.woff2
│   ├── images/
│   │   ├── grain-texture.jpg           # Texture overlay
│   │   └── logo/                       # Logo variants
│   │       ├── bread-logo-orange.svg
│   │       ├── bread-logo-blue.svg
│   │       ├── bread-logo-jade.svg
│   │       └── bread-logo-white.svg
│   └── favicon.svg                     # Updated Bread favicon
│
├── src/
│   ├── styles/
│   │   ├── fonts.css                   # @font-face declarations
│   │   ├── tokens.css                  # Design tokens (colors, spacing, etc.)
│   │   ├── theme.css                   # Starlight theme overrides
│   │   ├── components.css              # Component-specific styles
│   │   ├── typography.css              # Typography system styles
│   │   └── global.css                  # Global utilities and resets
│   │
│   ├── components/
│   │   ├── bread/                      # Bread Design System components
│   │   │   ├── buttons/
│   │   │   │   ├── LiftedButton.astro
│   │   │   │   └── ButtonPresets.ts    # Preset configurations
│   │   │   ├── typography/
│   │   │   │   ├── Heading.astro
│   │   │   │   ├── Text.astro
│   │   │   │   └── Caption.astro
│   │   │   ├── layout/
│   │   │   │   ├── Container.astro
│   │   │   │   ├── Section.astro
│   │   │   │   └── PageLayout.astro
│   │   │   ├── brand/
│   │   │   │   └── Logo.astro
│   │   │   └── effects/
│   │   │       └── GrainOverlay.astro
│   │   │
│   │   └── overrides/                  # Starlight component overrides
│   │       ├── Head.astro              # Custom meta tags, font preloads
│   │       ├── Header.astro            # Custom header
│   │       ├── Footer.astro            # Custom footer
│   │       └── PageFrame.astro         # Custom page structure
│   │
│   ├── content/
│   │   └── docs/                       # Documentation content (auto-synced)
│   │
│   ├── integrations/
│   │   └── github-wiki-sync.ts         # Existing integration
│   │
│   ├── lib/
│   │   └── github-cache.ts             # Existing utility
│   │
│   └── content.config.ts
│
├── temp/
│   └── bread-design-tokens.md          # Reference (keep for documentation)
│
├── astro.config.mjs                     # Updated with custom CSS
├── package.json                         # Updated dependencies
├── tsconfig.json
└── IMPLEMENTATION_PLAN.md               # This file
```

### 3.2 Configuration Files Changes

#### `astro.config.mjs`
```js
export default defineConfig({
  integrations: [
    githubWikiSync({ /* existing config */ }),
    starlight({
      title: 'Breadchain Docs',
      logo: {
        src: './src/assets/bread-logo.svg',
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/BreadchainCoop'
        }
      ],
      customCss: [
        './src/styles/fonts.css',
        './src/styles/tokens.css',
        './src/styles/theme.css',
        './src/styles/typography.css',
        './src/styles/components.css',
        './src/styles/global.css',
      ],
      components: {
        // Start with none, add overrides as needed
        // Head: './src/components/overrides/Head.astro',
        // Header: './src/components/overrides/Header.astro',
        // Footer: './src/components/overrides/Footer.astro',
      },
    }),
  ],
});
```

#### `package.json` (if using Tailwind)
```json
{
  "devDependencies": {
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0"
  }
}
```

---

## 4. Implementation Phases

### Phase 1: Foundation (Week 1)
**Goal**: Establish design tokens and typography

#### Tasks:
1. **Setup Font Files**
   - [ ] Obtain font files from Bread Cooperative
   - [ ] Place files in `public/fonts/`
   - [ ] Create `src/styles/fonts.css` with @font-face declarations
   - [ ] Test font loading in browser
   - [ ] Add font preload to Head

2. **Create Design Token System**
   - [ ] Create `src/styles/tokens.css` with all color variables
   - [ ] Test color application
   - [ ] Document any missing tokens

3. **Configure Starlight Theme**
   - [ ] Create `src/styles/theme.css`
   - [ ] Map Bread tokens to Starlight CSS properties
   - [ ] Override typography styles
   - [ ] Test in dev mode

4. **Update Astro Config**
   - [ ] Add customCss array
   - [ ] Configure logo
   - [ ] Test build process

**Deliverables**:
- Fonts working correctly
- Colors matching design system
- Typography using Bread fonts
- Successful build

### Phase 2: Typography & Content Styling (Week 1-2)
**Goal**: Style all markdown content

#### Tasks:
1. **Create Typography System**
   - [ ] Create `src/styles/typography.css`
   - [ ] Implement H1-H5 responsive styles
   - [ ] Style body text, captions
   - [ ] Style links and inline code
   - [ ] Test with sample documentation

2. **Content Element Styling**
   - [ ] Style code blocks (background, syntax highlighting)
   - [ ] Style blockquotes
   - [ ] Style lists (ordered/unordered)
   - [ ] Style tables
   - [ ] Style Starlight callouts/admonitions

3. **Create Typography Components**
   - [ ] Create `components/bread/typography/Heading.astro`
   - [ ] Create `components/bread/typography/Text.astro`
   - [ ] Create `components/bread/typography/Caption.astro`
   - [ ] Document usage in example page

**Deliverables**:
- All markdown elements styled correctly
- Responsive typography working
- Typography components available for custom pages

### Phase 3: Layout & Structure (Week 2)
**Goal**: Implement page layout and navigation

#### Tasks:
1. **Container & Spacing**
   - [ ] Create `components/bread/layout/Container.astro`
   - [ ] Create `components/bread/layout/Section.astro`
   - [ ] Implement spacing utilities
   - [ ] Test responsive behavior

2. **Header Customization**
   - [ ] Analyze current Starlight header
   - [ ] Create `components/overrides/Header.astro`
   - [ ] Implement Bread logo
   - [ ] Style navigation
   - [ ] Test mobile menu

3. **Footer Customization**
   - [ ] Create `components/overrides/Footer.astro`
   - [ ] Add Bread branding
   - [ ] Add relevant links
   - [ ] Style consistently with header

4. **Sidebar Styling**
   - [ ] Style sidebar navigation
   - [ ] Style active states
   - [ ] Test mobile behavior
   - [ ] Customize collapse behavior

**Deliverables**:
- Custom header and footer
- Proper spacing throughout
- Responsive layout working
- Navigation styled correctly

### Phase 4: Components (Week 3)
**Goal**: Implement signature Bread components

#### Tasks:
1. **Logo Component**
   - [ ] Obtain/create SVG logo files (all variants)
   - [ ] Create `components/bread/brand/Logo.astro`
   - [ ] Implement variant system (default, square, line)
   - [ ] Implement color system (orange, blue, jade, white)
   - [ ] Test in different contexts

2. **LiftedButton Component**
   - [ ] Create `components/bread/buttons/LiftedButton.astro`
   - [ ] Implement shadow/offset effect in CSS
   - [ ] Create all variant presets (primary, secondary, stroke, etc.)
   - [ ] Implement width variants (auto, full, mobile-full)
   - [ ] Add hover/active states
   - [ ] Test responsiveness

3. **Interactive Button** (if needed)
   - [ ] Create `components/bread/buttons/LiftedButtonInteractive.astro`
   - [ ] Add client-side interaction script
   - [ ] Test click handlers
   - [ ] Optimize bundle size

4. **Component Documentation**
   - [ ] Create example page showcasing all components
   - [ ] Document props and variants
   - [ ] Create usage guidelines

**Deliverables**:
- Working Logo component with all variants
- Working LiftedButton with all presets
- Component showcase page
- Usage documentation

### Phase 5: Visual Polish (Week 3-4)
**Goal**: Add finishing touches and effects

#### Tasks:
1. **Special Effects**
   - [ ] Obtain grain texture image
   - [ ] Create `components/bread/effects/GrainOverlay.astro`
   - [ ] Apply to appropriate backgrounds
   - [ ] Test performance

2. **Animations & Transitions**
   - [ ] Add button transition effects
   - [ ] Add page transition effects
   - [ ] Add hover states throughout
   - [ ] Ensure 60fps performance

3. **Dark Backgrounds**
   - [ ] Create dark section variants
   - [ ] Apply grain texture
   - [ ] Test text contrast
   - [ ] Verify accessibility

4. **Favicon & Meta**
   - [ ] Create Bread-branded favicon
   - [ ] Update meta tags
   - [ ] Add social share images
   - [ ] Test og:image

**Deliverables**:
- Grain texture working on dark sections
- Smooth animations throughout
- Updated favicon and meta tags
- Professional polish

### Phase 6: Testing & Optimization (Week 4)
**Goal**: Ensure quality and performance

#### Tasks:
1. **Accessibility Audit**
   - [ ] Run axe DevTools audit
   - [ ] Test keyboard navigation
   - [ ] Test screen reader compatibility
   - [ ] Verify color contrast (WCAG AA minimum)
   - [ ] Fix any issues found

2. **Performance Testing**
   - [ ] Run Lighthouse audit
   - [ ] Optimize font loading (preload, font-display)
   - [ ] Optimize images (grain texture size)
   - [ ] Check bundle size
   - [ ] Test build time

3. **Browser Testing**
   - [ ] Test in Chrome/Edge
   - [ ] Test in Firefox
   - [ ] Test in Safari
   - [ ] Test mobile browsers
   - [ ] Fix any browser-specific issues

4. **Content Testing**
   - [ ] Test with actual documentation content
   - [ ] Verify GitHub wiki sync still works
   - [ ] Check markdown rendering
   - [ ] Test code blocks with various languages
   - [ ] Verify search functionality

5. **Responsive Testing**
   - [ ] Test mobile (320px - 767px)
   - [ ] Test tablet (768px - 1279px)
   - [ ] Test desktop (1280px+)
   - [ ] Test ultra-wide (1920px+)
   - [ ] Fix any layout issues

**Deliverables**:
- Lighthouse score 90+ (all categories)
- WCAG AA compliance
- Working across all browsers
- Smooth mobile experience

---

## 5. Technical Implementation Details

### 5.1 CSS Custom Properties Strategy

**Map Bread tokens to Starlight properties**:

```css
/* src/styles/theme.css */
:root {
  /* ----- Starlight Property Overrides ----- */

  /* Fonts */
  --sl-font: var(--font-breadBody);
  --sl-font-system: var(--font-breadBody);
  --sl-font-code: 'Monaco', 'Courier New', monospace;

  /* Colors - Accent (used for links, current nav item) */
  --sl-color-accent-low: var(--color-orange-0);
  --sl-color-accent: var(--color-primary-orange);
  --sl-color-accent-high: var(--color-orange-1);

  /* Colors - Background */
  --sl-color-bg: var(--color-paper-main);
  --sl-color-bg-nav: var(--color-paper-0);
  --sl-color-bg-sidebar: var(--color-paper-1);

  /* Colors - Text */
  --sl-color-text: var(--color-text-standard);
  --sl-color-text-accent: var(--color-primary-orange);

  /* Colors - Gray scale */
  --sl-color-gray-1: var(--color-paper-0);
  --sl-color-gray-2: var(--color-paper-1);
  --sl-color-gray-3: var(--color-paper-2);
  --sl-color-gray-4: var(--color-surface-grey);
  --sl-color-gray-5: var(--color-surface-grey-2);
  --sl-color-gray-6: var(--color-surface-ink);

  /* Border radius (Bread uses sharp corners) */
  --sl-border-radius: 0;

  /* Other customizations */
  --sl-line-height: 1.6;
  --sl-content-width: 1280px;
}
```

### 5.2 LiftedButton Implementation

**CSS-only approach** (no JavaScript for basic version):

```css
/* src/styles/components.css */
.lifted-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  font-family: var(--font-breadBody);
  font-size: 16px;
  font-weight: 400;
  text-decoration: none;

  padding: 0 37px;
  height: 56px;

  cursor: pointer;
  border: none;

  /* Shadow effect */
  box-shadow: 4px 4px 0 var(--color-surface-grey-2);

  /* Initial lifted state */
  transform: translate(-2px, -2px);

  transition: all 300ms ease-out;
}

.lifted-button:hover {
  transform: translate(-3px, -3px);
  box-shadow: 5px 5px 0 var(--color-surface-grey-2);
}

.lifted-button:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0 var(--color-surface-grey-2);
}

/* Variant: Primary */
.lifted-button-primary {
  background: var(--color-primary-orange);
  color: var(--color-paper-main);
}

.lifted-button-primary:hover {
  background: var(--color-orange-1);
  color: #ffffff;
}

/* Variant: Secondary */
.lifted-button-secondary {
  background: #FBDED1;
  color: var(--color-primary-orange);
}

.lifted-button-secondary:hover {
  background: #FFF1EA;
}

/* ... other variants */
```

### 5.3 Responsive Typography Implementation

```css
/* src/styles/typography.css */

/* H1 - Display heading */
h1, .text-h1 {
  font-family: var(--font-breadDisplay);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.02em;

  font-size: 3rem; /* 48px mobile */
  line-height: 36px;
}

@media (min-width: 768px) {
  h1, .text-h1 {
    font-size: 96px;
    line-height: 76px;
  }
}

@media (min-width: 1280px) {
  h1, .text-h1 {
    font-size: 7rem; /* 112px */
    line-height: 83px;
  }
}

/* H2 */
h2, .text-h2 {
  font-family: var(--font-breadDisplay);
  font-weight: 900;
  letter-spacing: -0.03em;

  font-size: 3rem; /* 48px */
  line-height: 36px;
}

@media (min-width: 1280px) {
  h2, .text-h2 {
    font-size: 80px;
    line-height: 63px;
  }
}

/* ... H3, H4, H5 following same pattern */
```

### 5.4 Font Loading Optimization

```astro
---
// src/components/overrides/Head.astro
import type { Props } from '@astrojs/starlight/props';
---

<head>
  <!-- Preload critical fonts -->
  <link
    rel="preload"
    href="/fonts/PogacaBodyRegular.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />
  <link
    rel="preload"
    href="/fonts/PogacaDisplayBlack.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />

  <!-- Other head elements -->
</head>
```

---

## 6. Quality Assurance

### 6.1 Accessibility Checklist

- [ ] Color contrast meets WCAG AA (4.5:1 for text, 3:1 for large text)
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] Proper heading hierarchy
- [ ] Alt text for all images
- [ ] Semantic HTML throughout
- [ ] Screen reader tested
- [ ] No accessibility errors in axe DevTools

### 6.2 Performance Targets

- [ ] Lighthouse Performance: 90+
- [ ] Lighthouse Accessibility: 100
- [ ] Lighthouse Best Practices: 90+
- [ ] Lighthouse SEO: 100
- [ ] First Contentful Paint: < 1.5s
- [ ] Largest Contentful Paint: < 2.5s
- [ ] Total Bundle Size: < 500kb (excluding fonts)
- [ ] Font files: < 200kb total

### 6.3 Browser Support

Minimum support:
- Chrome/Edge: last 2 versions
- Firefox: last 2 versions
- Safari: last 2 versions
- Mobile Safari: iOS 14+
- Chrome Mobile: last 2 versions

### 6.4 Testing Checklist

**Visual Regression**:
- [ ] Compare with Figma designs
- [ ] Review against bread.coop production
- [ ] Check all component variants
- [ ] Verify responsive breakpoints

**Functional**:
- [ ] All links working
- [ ] Navigation working
- [ ] Search working (if enabled)
- [ ] GitHub wiki sync working
- [ ] Build succeeds without errors
- [ ] Dev server starts correctly

---

## 7. Migration from bread-ui-kit Reference

### 7.1 Component Conversion Matrix

| bread-ui-kit (React) | bread-docs (Astro) | Complexity | Priority |
|----------------------|-------------------|------------|----------|
| LiftedButton.tsx | bread/buttons/LiftedButton.astro | Medium | High |
| Logo.tsx | bread/brand/Logo.astro | Low | High |
| Heading components | bread/typography/Heading.astro | Low | High |
| Container | bread/layout/Container.astro | Low | Medium |
| Card | bread/layout/Card.astro | Low | Medium |
| Chip | bread/components/Chip.astro | Low | Low |
| Tooltip | bread/components/Tooltip.astro | Medium | Low |
| Navigation | overrides/Header.astro | High | Medium |

### 7.2 Styling Conversion Strategy

**From Tailwind (bread-ui-kit) to CSS (bread-docs)**:

Example conversion:
```tsx
// bread-ui-kit/LiftedButton.tsx
<button className="flex items-center justify-center gap-2 px-9 h-14 bg-orange-primary text-paper-main hover:bg-orange-1 transition-all duration-300">
  {children}
</button>
```

Converts to:
```css
/* bread-docs/src/styles/components.css */
.lifted-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 37px;
  height: 56px;
  background: var(--color-primary-orange);
  color: var(--color-paper-main);
  transition: all 300ms ease-out;
}

.lifted-button:hover {
  background: var(--color-orange-1);
}
```

---

## 8. Risk Assessment & Mitigation

### 8.1 Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Font files unavailable | High | Medium | Use system fonts temporarily, source fonts from Figma |
| Starlight updates break customizations | Medium | Low | Pin Starlight version, test updates in branch |
| Performance regression | Medium | Medium | Monitor Lighthouse scores, optimize assets |
| Browser compatibility issues | Medium | Low | Test early, use standard CSS features |
| GitHub wiki sync breaks | High | Low | Test thoroughly, maintain backup |

### 8.2 Rollback Plan

If major issues occur:
1. Branch protection - all work is on feature branch
2. Can revert to main branch anytime
3. Staged rollout via preview deployments
4. Keep original styling files for reference

---

## 9. Success Criteria

### 9.1 Must Have (Launch Blockers)

- [ ] All fonts loading correctly
- [ ] Colors matching design system
- [ ] Typography using Bread fonts
- [ ] LiftedButton component working
- [ ] Logo displaying correctly
- [ ] Header and footer styled
- [ ] Markdown content properly styled
- [ ] No accessibility violations
- [ ] Build succeeds
- [ ] GitHub wiki sync working

### 9.2 Should Have (Post-Launch Acceptable)

- [ ] Grain texture on backgrounds
- [ ] All button variants
- [ ] Custom 404 page
- [ ] Social share images
- [ ] Dark mode support
- [ ] Advanced animations

### 9.3 Nice to Have (Future Iteration)

- [ ] Component showcase/storybook
- [ ] Interactive component demos
- [ ] Design system documentation
- [ ] Tailwind integration for utility classes
- [ ] Additional Web3 components from design system

---

## 10. Timeline & Milestones

### Week 1: Foundation
- **Days 1-2**: Setup fonts, create design tokens
- **Days 3-4**: Configure Starlight theme, style typography
- **Day 5**: Review and testing

**Milestone**: Basic design system applied, fonts working

### Week 2: Layout & Content
- **Days 1-2**: Style all markdown elements
- **Days 3-4**: Customize header, footer, navigation
- **Day 5**: Review and testing

**Milestone**: Complete page layout with Bread branding

### Week 3: Components
- **Days 1-2**: Implement Logo and LiftedButton
- **Days 3-4**: Additional components, visual polish
- **Day 5**: Review and testing

**Milestone**: All core components implemented

### Week 4: Testing & Launch
- **Days 1-2**: Accessibility and performance testing
- **Days 3-4**: Browser testing, bug fixes
- **Day 5**: Final review and deployment

**Milestone**: Production-ready implementation

---

## 11. Next Steps

### Immediate Actions

1. **Get Font Files**
   - Contact Bread Cooperative design team
   - Request all 5 WOFF2 font files
   - Alternative: Extract from bread-ui-kit if accessible

2. **Get Logo Assets**
   - Request SVG logo files (all variants)
   - Request grain texture image
   - Request any other brand assets

3. **Review Plan**
   - Confirm approach with stakeholders
   - Adjust timeline if needed
   - Identify any additional requirements

4. **Begin Phase 1**
   - Create directory structure
   - Set up font files (or fallbacks)
   - Create initial CSS files

---

## 12. Resources & References

### Documentation
- [Astro Documentation](https://docs.astro.build)
- [Starlight Documentation](https://starlight.astro.build)
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4)

### Design System
- Figma: https://www.figma.com/design/qbL8FslnxILdRFnYlbQmMU/Copy-of-Bread-Design-System
- Design Tokens: `temp/bread-design-tokens.md`

### Repository
- bread-docs: Current repository
- BreadchainCoop GitHub: https://github.com/BreadchainCoop

---

**Plan Version**: 1.0
**Created**: 2025-01-13
**Author**: Claude Code
**Status**: Ready for Review
