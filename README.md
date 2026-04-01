# bread-docs

Documentation website for [Bread Cooperative](https://bread.coop), built with [Astro Starlight](https://starlight.astro.build). Deployed at **docs.bread.coop**.

## Stack

- [Astro](https://astro.build) — static site framework
- [Starlight](https://starlight.astro.build) — documentation theme
- [Keystatic](https://keystatic.com) — admin CMS
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first styling
- Content via Astro Content Collections (`src/content/docs/`)

## Requirements

- Node 24.14.0 or higher (see `.nvmrc`)

## Dev Commands

```bash
npm install       # install dependencies
npm run dev       # dev server at localhost:4321
npm run build     # build to ./dist/
npm run preview   # preview production build
```

## Project Structure

```
src/
├── content/docs/       # Markdown documentation (one file = one page)
├── overrides/          # Custom Starlight component overrides
├── plugins/            # Custom Starlight plugins
├── styles/global.css   # Bread design system + Starlight theme overrides
└── content.config.ts   # Content collection schema
astro.config.mjs        # Starlight config: sidebar, plugins, overrides
```

Content is organized into three sidebar sections:

| Section | Directory |
|---------|-----------|
| About | `src/content/docs/about/` |
| Solidarity Primitives | `src/content/docs/solidarity-primitives/` |
| Bread Cooperative | `src/content/docs/bread-cooperative/` |

## Customizations

This project uses several custom plugins and configurations beyond standard Starlight:

### Sidebar Configuration (`_meta.yml`)

Sidebar labels, ordering, and collapsed states are controlled via `_meta.yml` files in each directory (powered by [`starlight-auto-sidebar`](https://github.com/HiDeoo/starlight-auto-sidebar)):

```yaml
# src/content/docs/about/_meta.yml
label: About          # Sidebar label
order: 0              # Position in parent
collapsed: true       # Collapse by default (subdirs only)
```

**Key behaviors:**
- Top-level sections (About, Solidarity Primitives, Bread Cooperative) are **expanded** by default
- All nested subdirectories are **collapsed** by default
- Files appear **before** folders in the sidebar (via custom plugin)

### Custom Plugins

**`starlightFilesBeforeFolders`** (`src/plugins/`)
- Custom Starlight plugin that reorders sidebar entries
- Ensures files (links) appear before folders (groups) at all nesting levels
- Uses route data middleware with `await next()` to run after `starlight-auto-sidebar`

**`starlight-page-actions`**
- Adds share buttons (LinkedIn, X, Threads, Bluesky, etc.) and AI prompt buttons to each page
- Configured in `astro.config.mjs`

**`starlight-markdown-blocks`**
- Enables custom admonition blocks like `:::draft`

### URL Redirects

Astro redirects maintain backward compatibility with old short URLs:

| Old URL | Redirects To |
|---------|--------------|
| `/token` | `/about/bread-token` |
| `/marketplace` | `/about/bread-token/marketplace` |
| `/solidarity-fund` | `/solidarity-primitives/crowdstaking` |
| `/angel-minters` | `/solidarity-primitives/crowdstaking/angel-minters` |
| `/member-projects` | `/solidarity-primitives/crowdstaking/member-projects` |

Custom `slug:` frontmatter has been removed from index files; URLs now follow the directory structure.

### Design System

- **Fonts**: Pogaca (Bread Display & Bread Body) — custom WOFF2 files in `public/fonts/`
- **Colors**: Defined in `src/styles/global.css` with CSS custom properties
- **Dark mode**: Fully supported via `[data-theme='dark']` selectors

## Deployment

This site is deployed to Netlify.

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 24 |

The site runs in static mode — Keystatic CMS is disabled in production.

## Contributing

See [AGENTS.md](./AGENTS.md) for a full reference on how this project is structured, how to add content, and the design system conventions.
