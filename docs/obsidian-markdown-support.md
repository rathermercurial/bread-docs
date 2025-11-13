# Obsidian Markdown Support

Comprehensive documentation for Obsidian-flavored markdown features in Breadchain Docs.

## Overview

Breadchain Docs now supports Obsidian-style markdown syntax, allowing you to write documentation using familiar Obsidian features like wikilinks, image embeds, and callouts. This is powered by a combination of remark and rehype plugins that transform Obsidian syntax during the build process.

## Features

### 1. Wikilinks

Wikilinks provide a convenient way to link between pages without needing to know the exact file paths or URLs.

#### Basic Wikilinks

```markdown
[[page-name]]
```

Creates a link to another page. The page name is automatically converted to a slug:
- `[[Another Page]]` → `/another-page`
- `[[My Cool Feature]]` → `/my-cool-feature`

#### Wikilinks with Custom Text

```markdown
[[page-name|Custom link text]]
```

Example: `[[obsidian-test|See the demo]]` displays as "See the demo" but links to `/obsidian-test`.

#### Heading Anchors

```markdown
[[page-name#heading-id]]
[[page-name#heading-id|Jump to section]]
```

Links directly to a specific heading on a page.

#### Link Resolution Strategy

The wikilink resolver uses the following rules:

1. **Shortest path matching**: Links use the shortest possible path (`obsidian-short` format)
2. **Automatic wiki/ prefix stripping**: Links from source content with `wiki/` prefix are automatically cleaned
3. **Root-level resolution**: All links resolve to root level (`/page-name`, not `/wiki/page-name`)
4. **Slug transformation**:
   - Converts to lowercase
   - Replaces spaces with hyphens
   - Removes special characters (except slashes for nested paths)
   - Removes `.md` extensions
5. **Image detection**: Automatically detects image files and routes them to `/attachments/`

#### Standard Markdown Links

Standard markdown links are also processed to match the site structure:

```markdown
<!-- Source content (from GitHub wiki/) -->
[Link text](wiki/page-name.md)
[Another link](/wiki/some-page)

<!-- Automatically transformed to -->
[Link text](/page-name)
[Another link](/some-page)
```

This ensures compatibility with content authored in GitHub wikis or other systems that use `wiki/` prefixes.

### 2. Image Embeds

Embed images using Obsidian's double-bracket syntax:

```markdown
![[image.png]]
![[folder/image.png]]
![[image.png|Alt text or caption]]
```

**How it works:**
- Images are automatically routed to `/attachments/` directory
- The GitHub Wiki Sync integration downloads referenced images
- Supports nested paths (e.g., `subfolder/image.png`)
- Supported formats: jpg, jpeg, png, gif, svg, webp, apng, bmp, ico

**Standard markdown images still work:**
```markdown
![Alt text](/attachments/image.png)
```

### 3. Callouts (Admonitions)

Callouts are styled boxes that highlight important information. They use Obsidian's blockquote syntax with special metadata.

#### Basic Callout Syntax

```markdown
> [!type]
> Content of the callout goes here.
> Can span multiple lines.
```

#### Supported Callout Types

| Type | Use Case | Color |
|------|----------|-------|
| `note`, `info` | General information | Blue |
| `tip`, `hint`, `important` | Helpful suggestions | Green |
| `warning`, `caution`, `attention` | Potential issues | Orange |
| `danger`, `error` | Critical warnings | Red |
| `success`, `check`, `done` | Positive outcomes | Green |
| `question`, `help`, `faq` | Questions & answers | Purple |
| `abstract`, `summary`, `tldr` | Summaries | Cyan |
| `quote`, `cite` | Quotations | Gray |
| `example` | Examples & demos | Purple |
| `bug` | Bug reports | Red |

#### Callout Examples

**Note:**
```markdown
> [!note]
> This is important information that readers should know.
```

**Tip:**
```markdown
> [!tip]
> Here's a helpful tip to improve your workflow.
```

**Warning:**
```markdown
> [!warning]
> Be careful when doing this operation.
```

**Danger:**
```markdown
> [!danger]
> This action is irreversible and could cause data loss.
```

#### Foldable Callouts

Make callouts collapsible by adding `-` or `+` after the type:

```markdown
> [!tip]- Collapsed by default
> This content is hidden until the user clicks to expand.

> [!note]+ Expanded by default
> This is visible but can be collapsed.
```

- `-` = collapsed by default
- `+` = expanded by default

#### Custom Titles

Add a custom title after the callout type:

```markdown
> [!note] Custom Title Here
> Your content goes here.
```

#### Nested Content

Callouts support all markdown features inside them:

```markdown
> [!example] Code Example
> Here's some code:
>
> ```javascript
> function hello() {
>   console.log("Hello!");
> }
> ```
>
> Key points:
> - Lists work fine
> - **Bold** and _italic_ text
> - Even [[wikilinks]]!
```

### 4. Link Styling

Internal links created by wikilinks have special styling:

- **`.internal-link`**: Applied to all wikilinks
  - Colored with accent color
  - Dotted underline (becomes solid on hover)

- **`.internal-link-new`**: Applied to links with no matching page
  - Red color to indicate broken link
  - Helps identify content that needs to be created

## Technical Implementation

### Architecture

The Obsidian support is implemented through a plugin pipeline:

```
1. GitHub Wiki Sync (Build Time)
   ↓ Downloads markdown files and images
2. Starlight Content Loader
   ↓ Discovers content files
3. Remark Plugins (Markdown AST Processing)
   ↓ a. remark-strip-wiki-prefix (clean wiki/ from standard links)
   ↓ b. @flowershow/remark-wiki-link (wikilinks & embeds)
4. Rehype Plugins (HTML Processing)
   ↓ rehype-callouts (callouts with built-in CSS)
5. Final HTML Output
```

### Plugins

#### remark-strip-wiki-prefix (Custom Remark Plugin)

**Location**: `src/plugins/remark-strip-wiki-prefix.js`

Transforms standard markdown links to strip `wiki/` prefix:
- Removes `wiki/` or `/wiki/` from link URLs
- Removes `.md` extensions
- Converts to slug format (lowercase, hyphens)
- Preserves anchors/hashes
- Ensures root-level paths (`/page-name`)

**Examples:**
```markdown
[text](wiki/page.md)      → [text](/page)
[text](/wiki/some-page)   → [text](/some-page)
[text](wiki/Page Name.md) → [text](/page-name)
```

This plugin runs **first** to clean standard markdown links before wikilink processing.

#### @flowershow/remark-wiki-link (Remark Plugin)

**Package**: `@flowershow/remark-wiki-link@^3.1.2`

Transforms Obsidian wikilinks and embeds into standard HTML:
- Parses `[[target]]` and `[[target|alias]]` syntax
- Handles image embeds `![[image.png]]`
- Custom resolver function for URL generation
- CSS classes for styling
- Shortest path matching (`obsidian-short` format)

**Configuration** (see `astro.config.mjs`):
```javascript
[wikiLinkPlugin, {
  pathFormat: 'obsidian-short',  // Shortest path matching
  aliasDivider: '|',
  wikiLinkResolver: (name) => {
    // Strips wiki/ prefix if present in wikilinks
    // Converts to slug format
    // Routes images to /attachments/
  },
  className: 'internal-link',
  newClassName: 'internal-link-new',
}]
```

#### rehype-callouts (Rehype Plugin)

**Package**: `rehype-callouts@^1.5.0` (actively maintained)

Transforms Obsidian callout syntax into styled HTML:
- Parses `> [!type]` syntax
- Supports foldable callouts (`-` and `+`)
- Built-in Obsidian theme with CSS included
- Outputs semantic HTML (uses `<div>` or `<details>` elements)
- Automatic dark mode support

**Configuration** (see `astro.config.mjs`):
```javascript
[rehypeCallouts, {
  theme: 'obsidian',  // Uses built-in Obsidian theme
}]
```

**Note**: This plugin replaced the unmaintained `remark-obsidian-callout` package.

### Custom CSS

**File**: `src/styles/obsidian-callouts.css`

Provides styling for:
- Internal wikilink styling (`.internal-link`)
- Broken link indicators (`.internal-link-new`)
- Callout styles are provided by rehype-callouts built-in CSS

The plugin's built-in CSS:
- Matches Obsidian's visual style
- Automatic dark mode support
- No additional configuration needed

## Configuration

### astro.config.mjs

```javascript
import wikiLinkPlugin from '@flowershow/remark-wiki-link';
import rehypeCallouts from 'rehype-callouts';
import remarkStripWikiPrefix from './src/plugins/remark-strip-wiki-prefix.js';

export default defineConfig({
  markdown: {
    remarkPlugins: [
      // IMPORTANT: Order matters! Strip wiki/ prefix first
      remarkStripWikiPrefix,
      [wikiLinkPlugin, {
        pathFormat: 'obsidian-short',  // Shortest path
        // ... other config
      }],
    ],
    rehypePlugins: [
      [rehypeCallouts, { theme: 'obsidian' }],
    ],
  },
  integrations: [
    githubWikiSync({ /* config */ }),
    starlight({
      customCss: ['./src/styles/obsidian-callouts.css'],
    }),
  ],
});
```

### Customizing Link Resolution

To change how wikilinks are resolved, modify the `wikiLinkResolver` function in `astro.config.mjs`:

```javascript
wikiLinkResolver: (name) => {
  // Example: Add a wiki/ prefix
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  return [`/wiki/${slug}`];

  // Or: Use a different slugification
  const slug = someCustomSlugify(name);
  return [`/${slug}`];
}
```

### Customizing Callout Styles

Edit `src/styles/obsidian-callouts.css` to:
- Change callout colors
- Add new callout types
- Adjust spacing and borders
- Modify dark mode appearance

## Best Practices

### Writing Wikilinks

✅ **Do:**
- Use descriptive page names: `[[User Authentication]]`
- Use aliases for context: `[[auth-setup|setup guide]]`
- Keep link text readable

❌ **Don't:**
- Use file extensions: `[[page.md]]` (just use `[[page]]`)
- Include unnecessary paths: `[[docs/page]]` (just use `[[page]]`)
- Use special characters in page names

### Using Callouts

✅ **Do:**
- Choose appropriate callout types for content
- Use foldable callouts for optional/detailed content
- Keep callout content concise
- Use custom titles for clarity

❌ **Don't:**
- Overuse callouts (they lose impact)
- Nest callouts inside callouts
- Use callouts for large blocks of content
- Mix too many callout types on one page

### Image Organization

✅ **Do:**
- Use descriptive image filenames
- Keep images in the repository's attachments directory
- Use consistent naming conventions
- Provide alt text: `![[image.png|Description]]`

❌ **Don't:**
- Use spaces in image filenames
- Duplicate image filenames in different folders
- Use extremely large images without optimization

## Limitations & Known Issues

### Current Limitations

1. **No note embedding**: `![[other-note]]` (embedding entire notes) is not supported
2. **No audio/video embeds**: Only image embeds are supported
3. **No DataView**: Obsidian's DataView plugin syntax is not processed
4. **No custom plugins**: Only core Obsidian markdown features are supported

### Link Resolution

- Links resolve to root level by default (no `/wiki/` prefix)
- Nested paths in wikilinks are preserved: `[[folder/page]]` → `/folder/page`
- Case is normalized to lowercase
- Special characters are stripped except hyphens and slashes

### Callout Rendering

- Foldable callouts require JavaScript (works with Starlight by default)
- Some exotic callout types may not have custom styling
- Deeply nested markdown inside callouts may have spacing issues

## Troubleshooting

### Wikilinks not transforming

1. Check that `@flowershow/remark-wiki-link` is installed
2. Verify `astro.config.mjs` has the plugin configured
3. Restart the dev server after config changes
4. Check for syntax errors in wikilinks

### Callouts not styled

1. Verify `rehype-callouts` is installed
2. Check that plugin is configured in `rehypePlugins` array
3. Ensure `theme: 'obsidian'` is set in plugin options
4. Clear `.astro` cache directory
5. Inspect HTML for correct callout structure

### Images not loading

1. Ensure images are in `/public/attachments/`
2. Check that GitHub Wiki Sync downloaded the images
3. Verify image filename matches exactly (case-sensitive)
4. Check browser console for 404 errors

### Build errors

1. Check for valid markdown syntax
2. Ensure all wikilinks use proper format
3. Verify callout syntax is correct
4. Check for conflicting remark plugins

## Migration Guide

### From Standard Markdown

Obsidian syntax is additive - existing standard markdown continues to work:

```markdown
<!-- Standard markdown still works -->
[Link text](/path/to/page)
![Image alt](/path/to/image.png)

<!-- But you can now also use -->
[[page]]
![[image.png]]
```

### From Obsidian

Most Obsidian syntax works, but some features aren't supported:

| Obsidian Feature | Status | Alternative |
|------------------|--------|-------------|
| Wikilinks | ✅ Supported | - |
| Image embeds | ✅ Supported | - |
| Callouts | ✅ Supported | - |
| Note embeds | ❌ Not supported | Link to the note |
| DataView | ❌ Not supported | Static content |
| Custom plugins | ❌ Not supported | Use standard markdown |
| Tags | ⚠️ Frontmatter only | Use YAML frontmatter |

### From GitHub Wiki

If migrating from GitHub's wiki:

1. Replace GitHub wiki links with wikilinks:
   - `[Page](Page)` → `[[Page]]`
2. Update image references:
   - `![](image.png)` → `![[image.png]]`
3. Convert admonitions to callouts:
   - GitHub alerts → Obsidian callouts

## Examples

### Complete Page Example

```markdown
---
title: Getting Started
description: Quick start guide
---

# Getting Started

> [!tip]
> New to the project? Start with [[installation]] first.

## Overview

This guide will help you [[setup|set up]] the project. You'll learn:

- Basic configuration
- How to [[authentication|authenticate]]
- Working with [[api-overview|the API]]

## Prerequisites

> [!warning]
> Make sure you have Node.js 18+ installed before proceeding.

Before you begin, ensure you have:

1. Node.js (version 18 or higher)
2. npm or yarn package manager
3. A GitHub account

## Installation

> [!example] Quick Install
> ```bash
> npm install @breadchain/cli
> npm run setup
> ```

For detailed instructions, see the [[installation#detailed-steps|detailed installation guide]].

## Next Steps

Once installed, check out:

- [[configuration]] - Configure your environment
- [[first-project]] - Create your first project
- [[faq]] - Frequently asked questions

> [!success]
> You're all set! Start building something awesome.

## Need Help?

> [!question] Got questions?
> Join our community chat or check the [[troubleshooting]] guide.

Screenshot of the dashboard:
![[dashboard-screenshot.png|Main dashboard interface]]
```

## Additional Resources

- [Obsidian Documentation](https://help.obsidian.md/) - Official Obsidian docs
- [Flowershow remark-wiki-link](https://github.com/flowershow/remark-wiki-link) - Wikilink plugin source
- [rehype-callouts](https://github.com/lin-stephanie/rehype-callouts) - Callout plugin (maintained)
- [Starlight Documentation](https://starlight.astro.build/) - Framework docs
- [Astro Markdown](https://docs.astro.build/en/guides/markdown-content/) - Markdown in Astro

## Version History

- **v1.2** (2025-01-13) - Wiki prefix stripping and shortest path support
  - Added custom `remark-strip-wiki-prefix` plugin
  - Automatic removal of `wiki/` prefix from standard markdown links
  - Changed to `obsidian-short` path format for shortest path matching
  - Improved link resolution to match source content strategy
  - Fixed callout title layout (icon and text inline)

- **v1.1** (2025-01-13) - Updated to maintained plugins
  - Replaced `remark-obsidian-callout` with `rehype-callouts`
  - Built-in Obsidian theme with automatic dark mode
  - Improved callout styling and compatibility

- **v1.0** (2025-01-13) - Initial implementation
  - Wikilink support via @flowershow/remark-wiki-link
  - Callout support
  - Link resolution without wiki/ prefix
