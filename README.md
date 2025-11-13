# Breadchain Docs

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

Documentation site for Breadchain, built with Astro and Starlight. Features automatic sync with GitHub Wiki and full Obsidian-flavored markdown support.

## Features

- **Bread Design System v1**: Custom theming using Bread Cooperative brand colors, fonts, and components
  - Custom Bread Display and Body fonts (fallback to system fonts)
  - Bread orange accent colors throughout
  - High contrast for accessibility (WCAG AA)
  - Sharp corners and "lifted" button effects
  - Full dark/light mode support
- **GitHub Wiki Sync**: Automatically syncs content from a GitHub wiki repository at build time
- **Obsidian Markdown Support**: Full support for Obsidian-style syntax
  - Wikilinks: `[[page]]` and `[[page|alias]]`
  - Image embeds: `![[image.png]]`
  - Callouts/Admonitions: `> [!note]`, `> [!warning]`, etc.
  - Heading anchors: `[[page#heading]]`
- **Automatic Link Resolution**: Strips `wiki/` prefixes and resolves to clean URLs
- **Dark Mode**: Built-in dark mode support via Starlight

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file in the root directory:

```env
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_REPO_OWNER=BreadchainCoop
GITHUB_REPO_NAME=shared-obsidian
GITHUB_WIKI_PATH=wiki
```

The GitHub token needs read access to the wiki repository.

### Development

Start the local development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

### Build

Build the production site:

```bash
npm run build
```

The built site will be in `./dist/`

### Preview

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
.
├── public/
│   └── attachments/        # Images synced from wiki
├── src/
│   ├── content/
│   │   └── docs/           # Markdown content synced from wiki
│   ├── integrations/
│   │   └── github-wiki-sync.ts  # GitHub sync integration
│   ├── plugins/
│   │   └── remark-strip-wiki-prefix.js  # Custom remark plugin
│   └── styles/
│       ├── fonts.css       # Bread font declarations
│       ├── tokens.css      # Design system tokens
│       ├── theme.css       # Starlight theme overrides
│       ├── typography.css  # Typography styles
│       ├── components.css  # Bread components
│       ├── global.css      # Utility classes
│       └── obsidian-callouts.css  # Obsidian feature styling
├── docs/
│   └── obsidian-markdown-support.md  # Comprehensive documentation
├── astro.config.mjs        # Astro configuration with plugins
└── package.json
```

## How It Works

1. **Build Time**: The GitHub Wiki Sync integration downloads markdown files and images from the configured GitHub wiki repository
2. **Markdown Processing**: Content is processed through a pipeline of remark and rehype plugins:
   - `remark-strip-wiki-prefix`: Strips `wiki/` from standard markdown links
   - `@flowershow/remark-wiki-link`: Transforms Obsidian wikilinks to HTML
   - `rehype-callouts`: Transforms Obsidian callouts to styled components
3. **Static Generation**: Starlight generates static HTML from the processed markdown
4. **Deployment**: The static site can be deployed to any hosting platform

## Obsidian Markdown Features

### Wikilinks

```markdown
[[page-name]]
[[page-name|Custom Text]]
[[page-name#heading]]
```

### Image Embeds

```markdown
![[image.png]]
![[image.png|Alt text]]
```

### Callouts

```markdown
> [!note]
> This is a note callout

> [!warning]
> This is a warning callout

> [!tip]- Collapsed by default
> This callout starts collapsed
```

Supported callout types: note, tip, warning, danger, success, question, example, bug, and more.

For complete documentation, see [docs/obsidian-markdown-support.md](docs/obsidian-markdown-support.md)

## Design System

The site uses the **Bread Cooperative Design System v1**, which includes:

- **Colors**: Orange (#ea6023), Jade (#286b63), Blue (#1c5bb9) primary colors with paper backgrounds (#f6f3eb)
- **Typography**: Custom Bread Display (headings) and Bread Body (text) fonts with system font fallbacks
- **Components**: Lifted buttons with shadow effects, sharp corners, high-contrast UI elements
- **Accessibility**: High contrast ratios for readability in both light and dark modes

Custom fonts can be added to `public/fonts/` when available:
- `PogacaDisplayBlack.woff2`, `PogacaDisplayBold.woff2`, `PogacaDisplayRegular.woff2`
- `PogacaBodyBold.woff2`, `PogacaBodyRegular.woff2`

Design tokens reference: `temp/bread-design-tokens.md`

## Dependencies

- **astro** (^5.6.1): Static site generator
- **@astrojs/starlight** (^0.36.2): Documentation theme
- **@flowershow/remark-wiki-link** (^3.1.2): Wikilink support
- **rehype-callouts** (^2.1.2): Callout/admonition support
- **octokit** (^5.0.5): GitHub API client
- **unist-util-visit** (^5.0.0): AST traversal for plugins

## Contributing

Content should be edited in the source Obsidian vault/GitHub wiki, not directly in this repository. The `src/content/docs/` directory is automatically synced at build time.

To modify the documentation site itself:
1. Create a feature branch
2. Make your changes
3. Test locally with `npm run dev`
4. Submit a pull request

## License

[Add license information]

## Resources

- [Obsidian Markdown Support Documentation](docs/obsidian-markdown-support.md)
- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Documentation](https://docs.astro.build)
