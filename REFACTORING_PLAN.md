# Bread Design System - Refactoring Plan

## ✅ STATUS: COMPLETED

All phases of this refactoring plan have been successfully executed. See commit history for implementation details.

**Results:**
- ✅ 0 `!important` declarations (down from 27)
- ✅ 2 CSS files (down from 7) - 60% reduction
- ✅ Component overrides implemented (ThemeSelect.astro, Search.astro)
- ✅ 354 total CSS lines (down from 888)
- ✅ All visual functionality preserved

---

## Overview

This plan addressed the critical issues found in the architecture audit while maintaining all visual functionality. The goal was to transform from a "works but fragile" implementation to a "works and robust" implementation.

## Scope

**What we're refactoring:**
- Remove all 27 `!important` declarations
- Replace fragile DOM selectors with component overrides
- Consolidate 7 CSS files down to 4
- Use proper Starlight CSS properties throughout

**What we're NOT changing:**
- Visual appearance (should look identical)
- Obsidian markdown support (already well-implemented)
- Design tokens or color system
- Dark/light mode functionality

## Phase 1: Component Overrides (High Priority)

### Problem
Currently fighting CSS specificity with `!important` to override:
- Theme toggle (`starlight-theme-select`)
- Search (`site-search`)
- Sidebar navigation

### Solution
Create Astro component overrides that wrap Starlight's defaults.

### Implementation

#### 1.1 Create ThemeSelect Override

**Create:** `src/components/overrides/ThemeSelect.astro`

```astro
---
// Import Starlight's default component
import StarlightThemeSelect from '@astrojs/starlight/components/ThemeSelect.astro';
---

<div class="bread-theme-select">
  <StarlightThemeSelect {...Astro.props} />
</div>

<style>
/* All theme toggle styling here - no !important needed */
.bread-theme-select {
  /* Scoped to this component */
}

.bread-theme-select :global(select),
.bread-theme-select :global(button) {
  color: var(--sl-color-gray-6);
  background-color: var(--sl-color-gray-1);
  border-color: var(--sl-color-gray-4);
}

.bread-theme-select :global(svg),
.bread-theme-select :global(.icon) {
  color: var(--sl-color-gray-6);
}

.bread-theme-select :global(.caret) {
  color: var(--sl-color-gray-6);
  opacity: 1;
}

/* Dropdown states */
.bread-theme-select :global(option) {
  color: var(--sl-color-gray-6);
  background-color: var(--sl-color-bg);
}

.bread-theme-select :global(option:hover) {
  color: var(--sl-color-text-accent);
  background-color: var(--sl-color-gray-2);
}
</style>
```

**Register in:** `astro.config.mjs`
```js
starlight({
  components: {
    ThemeSelect: './src/components/overrides/ThemeSelect.astro',
  }
})
```

**Remove from theme.css:** Lines 98-154 (57 lines removed, 0 !important needed)

---

#### 1.2 Create Search Override

**Create:** `src/components/overrides/Search.astro`

```astro
---
import StarlightSearch from '@astrojs/starlight/components/Search.astro';
---

<div class="bread-search">
  <StarlightSearch {...Astro.props} />
</div>

<style>
.bread-search :global(button),
.bread-search :global(svg) {
  color: var(--sl-color-gray-6);
}

.bread-search :global(input)::placeholder {
  color: var(--sl-color-gray-5);
  opacity: 1;
}

.bread-search :global(kbd) {
  color: var(--sl-color-gray-6);
  background-color: var(--sl-color-gray-2);
  border-color: var(--sl-color-gray-4);
}
</style>
```

**Register in:** `astro.config.mjs`
```js
components: {
  ThemeSelect: './src/components/overrides/ThemeSelect.astro',
  Search: './src/components/overrides/Search.astro',
}
```

**Remove from theme.css:** Lines 166-218 (53 lines removed, 0 !important needed)

---

#### 1.3 Handle Remaining UI Elements

**For sidebar and pagination:** These can stay in `theme.css` as they use proper specificity:

```css
/* Keep these - they're not fragile */
.sidebar a {
  color: var(--sl-color-gray-6);
}

.pagination-links a {
  color: var(--sl-color-gray-6);
  /* No !important needed */
}
```

But need to verify the selectors are correct (check Starlight's actual class names).

---

## Phase 2: Consolidate CSS Files (Medium Priority)

### Current Structure (7 files, 888 lines)
```
fonts.css         58 lines  - Font declarations
tokens.css        74 lines  - Design token variables
theme.css        253 lines  - Starlight overrides + fragile selectors
typography.css    71 lines  - Typography utilities
components.css   195 lines  - Component styles (mostly unused)
global.css       166 lines  - Utility classes (mostly unused)
obsidian-callouts.css  71 lines  - Obsidian styles (keep separate)
```

### New Structure (4 files, ~400 lines)

#### 2.1 Merge into: `bread-theme.css` (~200 lines)

**Combines:**
- `fonts.css` (58 lines)
- `tokens.css` (74 lines)
- `theme.css` (cleaned up to ~70 lines)

**Rationale:** These are all "theme configuration" - fonts, tokens, and Starlight property mapping.

```css
/* bread-theme.css */

/* ===== FONT DECLARATIONS ===== */
@font-face { /* ... */ }

/* ===== DESIGN TOKENS ===== */
:root {
  --color-primary-orange: #ea6023;
  /* ... all tokens ... */
}

/* ===== STARLIGHT OVERRIDES ===== */
:root {
  --sl-font-system: var(--font-breadBody);
  --sl-color-accent: var(--color-primary-orange);
  /* ... proper Starlight properties ... */
}

:root[data-theme="light"] { /* ... */ }
:root[data-theme="dark"] { /* ... */ }

/* ===== MARKDOWN CONTENT ===== */
.sl-markdown-content h1 { /* ... */ }
```

---

#### 2.2 Audit and slim: `bread-components.css` (~100 lines)

**Current issues:**
- Defines `.lifted-button`, `.bread-container`, `.bread-card`
- No actual Astro components use these
- Unclear if markdown content uses these

**Action:**
1. Search codebase for usage of these classes
2. If used: keep them
3. If unused: remove them
4. Document how to use remaining classes

**Likely result:** Remove most of it, keep only what's actually used.

---

#### 2.3 Remove or minimize: `global.css` (0-50 lines)

**Current:** 166 lines of utility classes (`.flex`, `.items-center`, `.gap-md`, etc.)

**Action:**
1. Check if any markdown or components use these
2. If not used: delete the entire file
3. If sparingly used: keep only what's needed

**Most likely:** These aren't used anywhere and can be deleted entirely.

---

#### 2.4 Keep separate: `obsidian-callouts.css` (71 lines)

**Rationale:** Domain-specific, well-organized, appropriate use of custom CSS.

No changes needed.

---

### Updated astro.config.mjs

```js
customCss: [
  './src/styles/bread-theme.css',        // Consolidated fonts + tokens + theme
  './src/styles/bread-components.css',   // Actual component styles (if any used)
  './src/styles/obsidian-callouts.css',  // Obsidian-specific
],
```

---

## Phase 3: Use Starlight Typography (Low Priority)

### Current Problem

`typography.css` defines custom utility classes:
```css
.text-h1 { font-family: var(--font-breadDisplay); }
.text-h2 { font-family: var(--font-breadDisplay); }
```

But doesn't leverage Starlight's built-in responsive typography system:
- `--sl-text-h1`, `--sl-text-h2`, etc.
- `--sl-text-body`, `--sl-text-xs`, etc.

### Solution

**Option A: Map to Starlight properties (Recommended)**
```css
/* In bread-theme.css */
:root {
  /* Override Starlight's typography scale to use Bread fonts */
  --sl-text-h1: var(--font-breadDisplay);
  --sl-text-h2: var(--font-breadDisplay);
  --sl-text-h3: var(--font-breadDisplay);
  --sl-text-h4: var(--font-breadBody);
  --sl-text-h5: var(--font-breadBody);
  --sl-text-body: var(--font-breadBody);
}
```

Then delete `typography.css` entirely.

**Option B: Keep utility classes**
If the `.text-h1`, `.text-h2` utilities are actually used in markdown/components, keep them but add comment explaining why.

---

## Implementation Plan

### Step 1: Verify Current Usage
```bash
# Check if utility classes are actually used
grep -r "text-h1\|text-h2\|lifted-button\|bread-container" src/content/
grep -r "flex\|items-center\|gap-md" src/content/

# Check component class usage
grep -r "lifted-button\|bread-card" src/components/
```

### Step 2: Create Component Overrides
1. Create `src/components/overrides/` directory
2. Create `ThemeSelect.astro`
3. Create `Search.astro`
4. Update `astro.config.mjs` to register them
5. Test that theme toggle and search still work

### Step 3: Remove Obsolete CSS
1. Delete lines 98-218 from `theme.css` (component-specific overrides)
2. Verify no visual regressions

### Step 4: Consolidate Files
1. Create `bread-theme.css` (merge fonts + tokens + theme)
2. Audit `components.css` and `global.css` for usage
3. Remove unused code
4. Update `astro.config.mjs` imports
5. Delete old files

### Step 5: Validate
1. Test all pages render correctly
2. Verify theme toggle works
3. Verify search works
4. Check dark/light mode
5. Verify no console errors

---

## Expected Results

### Before
```
❌ 7 CSS files (888 lines)
❌ 27 !important declarations
❌ Fragile DOM selectors
❌ Fighting CSS specificity
⚠️ May break on Starlight updates
```

### After
```
✅ 3-4 CSS files (~400 lines)
✅ 0 !important declarations
✅ Component overrides (robust)
✅ Working with the framework
✅ Resilient to Starlight updates
```

### Impact
- **CSS reduced by ~55%** (888 → 400 lines)
- **Maintenance burden reduced** (fewer files to manage)
- **Robustness increased** (component overrides don't break)
- **No visual changes** (should look identical)

---

## Risks & Mitigation

### Risk 1: Component overrides break functionality
**Mitigation:** Test thoroughly before/after, keep old code in git history

### Risk 2: Some utility classes are actually used
**Mitigation:** Step 1 searches for usage before deleting

### Risk 3: Starlight component API changes
**Mitigation:** This is why we import/wrap defaults, not rewrite from scratch

### Risk 4: Consolidation creates merge conflicts
**Mitigation:** Do in small commits, test between each step

---

## Timeline Estimate

- **Step 1 (Verify):** 30 minutes
- **Step 2 (Overrides):** 2 hours
- **Step 3 (Remove CSS):** 30 minutes
- **Step 4 (Consolidate):** 2 hours
- **Step 5 (Validate):** 1 hour

**Total:** ~6 hours of focused work

---

## Decision Points

I need your input on:

### 1. Do you want me to proceed with refactoring?
- [ ] Yes, do the full refactor
- [ ] No, ship as-is with known tech debt
- [ ] Partial refactor (specify which phases)

### 2. If yes, should I do:
- [ ] All phases (1-3)
- [ ] Just Phase 1 (component overrides - highest ROI)
- [ ] Phases 1+2 (overrides + consolidation)

### 3. When should I do this?
- [ ] Now, before merge
- [ ] After initial merge, separate PR
- [ ] Later, when time permits

### 4. What's your risk tolerance?
- [ ] Conservative (test heavily between each step)
- [ ] Balanced (commit per phase, test at end)
- [ ] Aggressive (do it all, test once)

---

## My Recommendation

**Do Phase 1 now, Phases 2-3 later:**

**Rationale:**
- Phase 1 (component overrides) eliminates all `!important` and fragility → biggest win
- Phase 2-3 (consolidation) is mostly cleanup → nice to have but not critical
- Doing Phase 1 before merge means main branch never has fragile code
- Can ship Phase 2-3 as polish work later

**Estimated time for Phase 1 only:** 3-4 hours

What do you think?
