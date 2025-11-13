# Bread Design System v1 Integration

## Summary

This PR integrates the **Bread Cooperative Design System v1** into the Astro Starlight documentation site, providing a complete visual overhaul with custom branding, typography, colors, and components while maintaining excellent accessibility and readability.

## Key Features

### 🎨 Design System Implementation

- **Custom Color System**: Bread orange (#ea6023), jade (#286b63), and blue (#1c5bb9) primary colors with warm paper backgrounds (#f6f3eb)
- **Typography**: Integration of Bread Display (headings) and Bread Body (text) fonts with system font fallbacks
- **Components**: Lifted buttons with signature shadow effects, sharp corners matching Bread aesthetic
- **Obsidian Enhancements**: Styled wikilinks and callouts to match Bread branding

### ♿ Accessibility & Readability

- **High Contrast**: WCAG AA compliant contrast ratios throughout
- **Dark Mode Support**: Full light/dark mode support with proper contrast in both themes
- **UI Element Visibility**: Enhanced contrast for:
  - Sidebar navigation links
  - Theme toggle and dropdown menu
  - Search bar, placeholder text, and hotkey labels
  - Search modal and results
  - "On this page" navigation
  - Next/Previous page buttons

### 🎯 Design System Files

All styles organized in `src/styles/`:
- `fonts.css` - Font declarations (with fallbacks until font files are added)
- `tokens.css` - Design system color, spacing, and layout tokens
- `theme.css` - Starlight CSS custom property overrides for both light/dark modes
- `typography.css` - Responsive typography utilities
- `components.css` - Bread components (LiftedButton, containers, cards)
- `global.css` - Utility classes
- `obsidian-callouts.css` - Enhanced Obsidian markdown styling

## Changes Made

### Core Implementation
- ✅ Implemented complete Bread Design System v1 foundation
- ✅ Created comprehensive style system using CSS custom properties
- ✅ Mapped Bread tokens to Starlight's theming system
- ✅ Applied Bread fonts to all typography (with system fallbacks)
- ✅ Integrated with existing Obsidian markdown support

### Contrast & Accessibility Improvements
- ✅ Increased text contrast in both light and dark modes
- ✅ Fixed low-contrast UI elements (theme toggle, search, navigation)
- ✅ Enhanced sidebar and "On this page" link visibility
- ✅ Improved search modal and results readability
- ✅ Added high-contrast backgrounds and borders where needed

### Documentation
- ✅ Updated README with design system documentation
- ✅ Documented font requirements and installation
- ✅ Listed all style files in project structure
- ✅ Included design tokens reference

## Testing

- ✅ Dev server runs without errors
- ✅ All UI elements have proper contrast
- ✅ Dark/light mode toggle works correctly
- ✅ Obsidian markdown features styled correctly
- ✅ Search functionality maintains high contrast
- ✅ Navigation elements clearly visible

## Breaking Changes

None. This is purely a visual enhancement that maintains all existing functionality.

## Architecture & Technical Debt

⚠️ **Important:** This implementation has been audited and contains known technical debt. See `ARCHITECTURE_AUDIT.md` for full analysis.

### Key Findings

**Works but has fragility:**
- ✅ Functionally complete and visually correct
- ⚠️ Uses 27 `!important` declarations (fighting CSS specificity)
- ⚠️ Direct DOM selectors (fragile to Starlight updates)
- ⚠️ 7 CSS files (could consolidate to 3-4)
- ⚠️ Recommended: Component overrides for long-term robustness

**Compatibility:**
- Tested with Starlight v0.36.2
- May break with Starlight updates
- Warnings added to code

**Recommendations:**
1. **Safe to merge** for MVP/documentation site
2. **Schedule refactoring** for production use
3. **Consider component overrides** over CSS specificity wars

See `ARCHITECTURE_AUDIT.md` for:
- Detailed technical analysis
- Comparison with Starlight best practices
- Recommended refactoring plan
- Alternative approaches

## Next Steps (Optional)

1. **Add Custom Fonts**: Place the 5 WOFF2 font files in `public/fonts/` for full typography:
   - `PogacaDisplayBlack.woff2`, `PogacaDisplayBold.woff2`, `PogacaDisplayRegular.woff2`
   - `PogacaBodyBold.woff2`, `PogacaBodyRegular.woff2`

2. **Add Brand Assets**: Optionally add Bread logo SVGs and grain texture image

3. **Component Library**: Create reusable Astro components using the design system styles

## Design System Reference

- **Design Tokens**: `temp/bread-design-tokens.md`
- **Figma**: [Bread Design System](https://www.figma.com/design/qbL8FslnxILdRFnYlbQmMU/Copy-of-Bread-Design-System)
- **Production Example**: [bread.coop](https://bread.coop)

## Screenshots

_Add screenshots showing before/after of key pages in both light and dark modes_

---

**Branch**: `claude/bread-design-system-integration-011CV5D35ARABHyJjKtyQxs4`
**Ready for**: Review and merge
