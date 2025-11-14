# Breadchain Docs

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

Documentation site for Breadchain, built with Astro and Starlight. Features automatic sync with GitHub Wiki and full Obsidian-flavored markdown support.

## Features

- **Bread Design System v1**: Custom theming using Bread Cooperative brand colors, fonts, and components
  - Custom Bread Display and Body fonts (fallback to system fonts)
  - Bread orange accent colors throughout
  - High contrast for accessibility (WCAG AA)
  - Sharp corners and paper-textured backgrounds
  - Full dark/light mode support
  - Component overrides for robust theming
- **GitHub Wiki Sync**: Automatically syncs content from a GitHub wiki repository at build time
- **Obsidian Markdown Support**: Full support for Obsidian-style syntax
  - Wikilinks: `[[page]]` and `[[page|alias]]` with file-based resolution
  - Image embeds: `![[image.png]]`
  - Callouts/Admonitions: `> [!note]`, `> [!warning]`, etc. (converts to Starlight native asides)
  - Heading anchors: `[[page#heading]]`
- **Custom Markdown Plugins**: TypeScript-based plugins for robust Obsidian markdown transformation
- **Dark Mode**: Built-in dark mode support via Starlight with system default

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
│   ├── components/
│   │   └── overrides/      # Starlight component overrides
│   │       ├── ThemeSelect.astro  # Custom theme toggle
│   │       └── Search.astro       # Custom search styling
│   ├── content/
│   │   └── docs/           # Markdown content synced from wiki
│   ├── integrations/
│   │   └── github-wiki-sync.ts  # GitHub sync integration
│   ├── lib/
│   │   ├── markdown-utils.ts      # Shared markdown utilities
│   │   └── wikilink-resolver.ts   # File-based wikilink resolution
│   ├── plugins/
│   │   ├── remark-obsidian-to-starlight.ts  # Callout transformation
│   │   ├── remark-strip-wiki-prefix.ts      # Strip wiki/ prefixes
│   │   └── remark-wikilinks.ts              # Wikilink parser
│   └── styles/
│       ├── bread-theme.css        # Complete design system (fonts + tokens + theme)
│       └── obsidian-callouts.css  # Wikilink and aside styling
├── .docs/
│   └── architectural-analysis.md  # Content loader research
├── docs/
│   └── obsidian-markdown-support.md  # Comprehensive documentation
├── astro.config.mjs        # Astro configuration with plugins
└── package.json
```

## How It Works

1. **Build Time**: The GitHub Wiki Sync integration downloads markdown files and images from the configured GitHub wiki repository
2. **Markdown Processing**: Content is processed through a custom pipeline of remark plugins:
   - `remark-strip-wiki-prefix`: Strips `wiki/` prefixes from standard markdown links
   - `remark-obsidian-to-starlight`: Transforms Obsidian callouts (`> [!note]`) to Starlight native asides (`:::note`)
   - `remark-wikilinks`: Parses wikilinks with file-based resolution using synced files manifest
3. **Component Overrides**: Custom Starlight components provide robust theming without CSS specificity wars
4. **Static Generation**: Starlight generates static HTML from the processed markdown
5. **Deployment**: The static site can be deployed to any hosting platform

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
- **Components**: Component overrides for ThemeSelect and Search with scoped styling
- **Accessibility**: WCAG AA high contrast ratios for readability in both light and dark modes
- **Architecture**: Zero `!important` declarations, proper CSS cascade, robust to framework updates

### Implementation Details

- **Consolidated CSS**: 2 files (354 lines) instead of 7 files (888 lines) - 60% reduction
- **Component Overrides**: ThemeSelect.astro and Search.astro for maintainable customization
- **Starlight Integration**: Uses official CSS custom properties and component override system
- **Obsidian Styling**: Enhanced wikilinks and Starlight native asides with Bread branding

Custom fonts can be added to `public/fonts/` when available:
- `PogacaDisplayBlack.woff2`, `PogacaDisplayBold.woff2`, `PogacaDisplayRegular.woff2`
- `PogacaBodyBold.woff2`, `PogacaBodyRegular.woff2`

Design tokens reference: `temp/bread-design-tokens.md`

## Dependencies

- **astro** (^5.6.1): Static site generator
- **@astrojs/starlight** (^0.36.2): Documentation theme
- **octokit** (^5.0.5): GitHub API client for wiki sync
- **unist-util-visit** (^5.0.0): AST traversal for custom remark plugins
- **sharp** (^0.34.2): Image optimization

### Custom Implementation (No External Dependencies)

All Obsidian markdown support is implemented via custom TypeScript plugins:
- No `@flowershow/remark-wiki-link` dependency (custom wikilink parser)
- No `rehype-callouts` dependency (custom callout transformer to Starlight asides)
- File-based wikilink resolution using synced files manifest

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
