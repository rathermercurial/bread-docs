# Obsidian Markdown Support

Comprehensive documentation for Obsidian-flavored markdown features in Breadchain Docs.

## Overview

Breadchain Docs now supports Obsidian-style markdown syntax, allowing you to write documentation using familiar Obsidian features like wikilinks, image embeds, and callouts. This is powered by custom remark plugins that transform Obsidian syntax into Starlight's native components during the build process.

**Key Architecture Decisions:**
- **File-based wikilink resolution** using a manifest generated from synced files
- **Native Starlight asides** for callouts instead of custom HTML/CSS
- **Custom TypeScript plugins** for full control and maintainability
- **Zero external dependencies** for Obsidian features (all custom implementations)

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

The wikilink resolver uses **file-based resolution** with a manifest of synced files:

1. **Manifest Generation**: During build, `github-wiki-sync` creates `.synced-files.json` containing all synced files
2. **File Matching**: Wikilinks are matched against actual files using multiple strategies:
   - Exact matches (with/without `.md` extension)
   - Directory + `index.md` patterns
   - Filename-only matching (shortest path wins)
   - Fuzzy matching (ends with target)
3. **Automatic wiki/ prefix stripping**: Links from source content with `wiki/` prefix are automatically cleaned
4. **Root-level resolution**: All links resolve to root level (`/page-name`, not `/wiki/page-name`)
5. **Slug transformation**:
   - Converts to lowercase
   - Replaces spaces with hyphens
   - Removes special characters (except slashes for nested paths)
   - Removes `.md` extensions and `/index` suffixes
6. **Image detection**: Automatically detects image files and routes them to `/attachments/`
7. **Fallback**: If no file match is found, falls back to slug-based resolution with a warning

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

### 3. Callouts (Asides)

Callouts are styled boxes that highlight important information. They use Obsidian's blockquote syntax and are transformed into **Starlight's native aside components**, ensuring consistent styling with the rest of your documentation.

#### Basic Callout Syntax

```markdown
> [!type]
> Content of the callout goes here.
> Can span multiple lines.
```

#### How It Works

Obsidian callouts are transformed at build time into Starlight's `:::note` directive syntax (internally as AST nodes). This means:
- **Native Starlight styling** is automatically applied
- **No custom CSS** required for callouts
- **Consistent with Starlight theme** and automatic dark mode support
- **All Starlight aside features** work (icons, colors, etc.)

#### Supported Callout Types

Obsidian callout types are mapped to Starlight aside types:

| Obsidian Type | Starlight Type | Use Case |
|---------------|----------------|----------|
| `note`, `info`, `question`, `todo`, `abstract`, `summary`, `quote` | `note` | General information |
| `tip`, `example`, `success` | `tip` | Helpful suggestions |
| `warning`, `caution` | `caution` | Potential issues |
| `danger`, `error`, `bug` | `danger` | Critical warnings |

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

The Obsidian support is implemented through a custom plugin pipeline:

```
1. GitHub Wiki Sync (Build Time)
   ↓ Downloads markdown files and images
   ↓ Generates .synced-files.json manifest
2. Starlight Content Loader
   ↓ Discovers content files
3. Remark Plugins (Markdown AST Processing)
   ↓ a. remark-strip-wiki-prefix (clean wiki/ from standard links)
   ↓ b. remark-obsidian-to-starlight (transform callouts to Starlight asides)
   ↓ c. remark-wikilinks (custom wikilink plugin with file-based resolution)
4. Starlight Processing
   ↓ Renders aside directives using native Starlight components
5. Final HTML Output
```

**Key Design Decisions:**
- **All plugins are custom TypeScript implementations** for full control
- **No external Obsidian plugin dependencies** (easier to maintain)
- **File-based wikilink resolution** using manifest from github-wiki-sync
- **Native Starlight integration** for callouts (better styling consistency)
- **Shared utilities** in `src/lib/markdown-utils.ts` to eliminate code duplication

### Plugins

#### remark-strip-wiki-prefix

**Location**: `src/plugins/remark-strip-wiki-prefix.ts`
**Type**: Custom TypeScript remark plugin

Transforms standard markdown links to strip `wiki/` prefix:
- Removes `wiki/` or `/wiki/` from link URLs
- Removes `.md` extensions
- Converts to slug format (lowercase, hyphens)
- Preserves anchors/hashes
- Routes images to `/attachments/`
- Ensures root-level paths (`/page-name`)

**Examples:**
```markdown
[text](wiki/page.md)      → [text](/page)
[text](/wiki/some-page)   → [text](/some-page)
[text](wiki/Page Name.md) → [text](/page-name)
![](wiki/image.png)       → ![](/attachments/image.png)
```

This plugin runs **first** to clean standard markdown links before other processing.

#### remark-obsidian-to-starlight

**Location**: `src/plugins/remark-obsidian-to-starlight.ts`
**Type**: Custom TypeScript remark plugin

Transforms Obsidian callouts into Starlight's native aside components:
- Detects `> [!type]` syntax in blockquotes
- Extracts callout type and optional title
- Preserves all content including inline formatting (bold, links, etc.)
- Handles multi-line callouts where content is merged into a single paragraph
- Maps Obsidian types to Starlight aside types
- Creates `containerDirective` AST nodes that Starlight renders as native asides

**Callout Type Mapping:**
```javascript
note, info, question, todo, abstract, summary, quote → note
tip, example, success → tip
warning, caution → caution
danger, error, bug → danger
```

**Note**: Foldable callouts (`-` and `+` markers) are detected but not currently implemented. The marker is removed from the title.

#### remark-wikilinks

**Location**: `src/plugins/remark-wikilinks.ts`
**Type**: Custom TypeScript remark plugin

Transforms Obsidian wikilinks and embeds using file-based resolution:
- Parses `[[target]]`, `[[target|alias]]`, `[[target#heading]]` syntax
- Handles image embeds `![[image.png]]`
- Uses `wikilink-resolver.ts` for file-based URL resolution
- Processes all nodes (paragraphs, headings, lists, etc.)
- Adds `.internal-link` CSS class to all wikilinks
- Works at AST level to preserve inline formatting

**Resolution Process:**
1. Parse wikilink syntax to extract target, alias, and heading
2. Strip `wiki/` prefix if present
3. Look up target in `.synced-files.json` manifest
4. Match using multiple strategies (exact, directory+index, filename-only, fuzzy)
5. Convert matched file path to URL slug
6. Add heading anchor if specified
7. Create link or image node in AST

#### Shared Utilities

**Location**: `src/lib/markdown-utils.ts`

Common functions used across multiple plugins:
- `isImageFile(filename)` - Detect image files by extension
- `stripWikiPrefix(path)` - Remove `wiki/` or `/wiki/` prefix
- `slugify(text)` - Convert text to URL-safe slug
- `removeIndexSuffix(path)` - Remove `/index.md` and `/index` suffixes
- `ensureLeadingSlash(path)` - Ensure path starts with `/`

**Location**: `src/lib/wikilink-resolver.ts`

File-based wikilink resolution:
- `loadManifestSync()` - Load `.synced-files.json` with caching
- `findDocumentFromLink(target, files)` - Match target against file list
- `resolveWikilink(filePath, heading?)` - Main resolution function

### Custom CSS

**File**: `src/styles/obsidian-callouts.css`

Provides minimal styling for:
- Internal wikilink styling (`.internal-link`)
- Broken link indicators (`.internal-link-new`)

**Note**: Callout/aside styling is provided entirely by Starlight's native aside components. No custom CSS is needed for callouts.

## Configuration

### astro.config.mjs

```javascript
import remarkStripWikiPrefix from './src/plugins/remark-strip-wiki-prefix.ts';
import remarkObsidianToStarlight from './src/plugins/remark-obsidian-to-starlight.ts';
import remarkWikilinks from './src/plugins/remark-wikilinks.ts';

export default defineConfig({
  markdown: {
    remarkPlugins: [
      // IMPORTANT: Order matters!
      remarkStripWikiPrefix,        // 1. Strip wiki/ prefix from standard links
      remarkObsidianToStarlight,    // 2. Transform callouts to Starlight asides
      remarkWikilinks,              // 3. Transform wikilinks (uses file-based resolution)
    ],
  },
  integrations: [
    githubWikiSync({
      // Generates .synced-files.json manifest during sync
      contentDir: 'src/content/docs',
      // ... other config
    }),
    starlight({
      customCss: ['./src/styles/obsidian-callouts.css'],
    }),
  ],
});
```

### Customizing Link Resolution

To change how wikilinks are resolved, modify `src/lib/wikilink-resolver.ts`:

```typescript
export function resolveWikilink(filePath: string, heading?: string): string {
  const manifest = loadManifestSync();

  if (manifest && manifest.files.length > 0) {
    const filePaths = manifest.files.map((f) => f.path);
    const cleanPath = stripWikiPrefix(filePath);
    const matchedFile = findDocumentFromLink(cleanPath, filePaths);

    if (matchedFile) {
      // Customize how matched files are converted to URLs
      let urlPath = removeIndexSuffix(matchedFile);
      urlPath = slugify(urlPath);  // Modify slugify() for different behavior
      resolvedPath = ensureLeadingSlash(urlPath);
    }
  }

  return heading ? `${resolvedPath}#${heading}` : resolvedPath;
}
```

### Customizing Callout Type Mapping

To change how Obsidian callout types map to Starlight aside types, edit `src/plugins/remark-obsidian-to-starlight.ts`:

```typescript
const calloutTypeMap: Record<string, string> = {
  note: 'note',
  tip: 'tip',
  info: 'note',
  warning: 'caution',
  caution: 'caution',
  danger: 'danger',
  // Add your custom mappings here
  custom: 'tip',
};

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

1. Check that `.synced-files.json` manifest exists in `src/content/docs/`
2. Verify `github-wiki-sync` integration is configured and ran successfully
3. Restart the dev server after config changes
4. Check for syntax errors in wikilinks
5. Look for warnings in build output (e.g., "File not found for link: X")

### Callouts not rendering as asides

1. Verify callout syntax starts with `> [!type]` exactly
2. Check that `remark-obsidian-to-starlight` is in `remarkPlugins` array
3. Ensure plugin runs **before** `remark-wikilinks` (order matters)
4. Clear `.astro` cache directory
5. Inspect HTML - should see `<aside class="starlight-aside">`

### Callout content missing

This was a known issue where callouts appeared but had no content:
- **Fixed in v2.0** - Content is now properly extracted from multi-line callouts
- If still occurring, ensure you're using the latest version of `remark-obsidian-to-starlight.ts`

### Images not loading

1. Ensure images are in `/public/attachments/`
2. Check that GitHub Wiki Sync downloaded the images
3. Verify image filename matches exactly (case-sensitive)
4. Check browser console for 404 errors

### Build errors

1. Check for valid markdown syntax
2. Ensure all wikilinks use proper format
3. Verify callout syntax is correct (must start with `> [!type]`)
4. Check `.synced-files.json` is being generated during build

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
- [Starlight Documentation](https://starlight.astro.build/) - Framework docs
- [Astro Markdown](https://docs.astro.build/en/guides/markdown-content/) - Markdown in Astro
- [remark](https://github.com/remarkjs/remark) - Markdown processor
- [unist-util-visit](https://github.com/syntax-tree/unist-util-visit) - AST traversal utility

## Version History

- **v2.0** (2025-01-14) - Complete custom implementation
  - **Breaking changes**: Removed all external Obsidian plugin dependencies
  - Replaced `@flowershow/remark-wiki-link` with custom `remark-wikilinks.ts`
  - Replaced `rehype-callouts` with custom `remark-obsidian-to-starlight.ts`
  - Implemented file-based wikilink resolution using manifest from `github-wiki-sync`
  - Callouts now transform to Starlight's native aside components for consistent styling
  - Fixed callout content extraction - properly handles multi-line callouts where markdown parser merges lines
  - Fixed inline formatting preservation in callouts (bold, links, emphasis, etc.)
  - Added shared utilities in `src/lib/markdown-utils.ts` to eliminate code duplication
  - Converted all plugins to TypeScript for better type safety
  - Created `src/lib/wikilink-resolver.ts` for sophisticated file matching strategies
  - All plugins now work at AST level instead of string manipulation
  - Production-ready implementation with full control over behavior

- **v1.3** (2025-01-13) - Fixed wikilink plugin API usage
  - Corrected plugin configuration to use proper API: `format` instead of `pathFormat`, `urlResolver` instead of `wikiLinkResolver`
  - Updated urlResolver function signature to match plugin spec: `({ filePath, isEmbed, heading }) => string`
  - This fixes the issue where wiki/ prefix was not being stripped from wikilinks
  - Cleaned and production-ready implementation

- **v1.2** (2025-01-13) - Wiki prefix stripping and shortest path support
  - Added custom `remark-strip-wiki-prefix` plugin
  - Automatic removal of `wiki/` prefix from standard markdown links
  - Changed to `shortestPossible` path format for shortest path matching
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
