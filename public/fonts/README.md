# Bread Design System Fonts

This directory should contain the Pogaca font family files for the Bread Cooperative Design System.

## Required Font Files

The following font files are needed for complete Bread Design System typography:

### Bread Display (for large headings H1-H3)
- `PogacaDisplayBlack.woff2` (font-weight: 900)
- `PogacaDisplayBold.woff2` (font-weight: 700)
- `PogacaDisplayRegular.woff2` (font-weight: 400)

### Bread Body (for body text, smaller headings H4-H6, and UI elements)
- `PogacaBodyBold.woff2` (font-weight: 700)
- `PogacaBodyRegular.woff2` (font-weight: 400)

## Installation

1. Obtain the Pogaca font files from the Bread Cooperative design resources
2. Place the `.woff2` files in this directory
3. The fonts are referenced in `src/styles/bread-theme.css`

## Fallback Behavior

If these font files are not present, the site will automatically fall back to system fonts:
- Display fallback: `ui-sans-serif, system-ui, -apple-system, sans-serif`
- Body fallback: `ui-sans-serif, system-ui, -apple-system, sans-serif`

The site remains fully functional with system fonts, but the complete Bread brand experience requires the Pogaca typefaces.

## Font Display Strategy

All fonts use `font-display: swap` to ensure text remains visible during font loading, prioritizing performance and user experience.

## Questions?

Contact the Breadchain design team for access to the Pogaca font files.
