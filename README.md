# bread-docs

Documentation website for [Bread Cooperative](https://bread.coop), built with [Astro Starlight](https://starlight.astro.build). Deployed at **docs.bread.coop**.

## Stack

- [Astro](https://astro.build) — static site framework
- [Starlight](https://starlight.astro.build) — documentation theme
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first styling
- Content via Astro Content Collections (`src/content/docs/`)

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

## Contributing

See [AGENTS.md](./AGENTS.md) for a full reference on how this project is structured, how to add content, and the design system conventions.
