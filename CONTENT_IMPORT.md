# Content Import: Obsidian Wiki → Astro Starlight

Context document for the coding agent performing the initial content migration from `shared-obsidian/wiki/` into `bread-docs/src/content/docs/`.

---

## Overview

Migrate 47 Obsidian markdown files from the Bread Cooperative wiki into Astro Starlight, preserving folder structure, converting Obsidian-specific syntax, handling images, and updating the Starlight sidebar configuration.

**Source**: `/home/rm/work/repos/bread/shared-obsidian/wiki/`
**Images**: `/home/rm/work/repos/bread/shared-quartz/content/attachments/` (106 files, the existing Quartz site's asset folder)
**Destination docs**: `/home/rm/work/repos/bread/bread-docs/src/content/docs/`
**Destination images**: `/home/rm/work/repos/bread/bread-docs/public/images/`
**Starlight config**: `/home/rm/work/repos/bread/bread-docs/astro.config.mjs`

---

## Source: Wiki Structure

All 47 markdown files to import (exclude `readme.md`):

```
wiki/
├── index.md                          → docs/index.md (replaces existing index.mdx)
│
├── about/
│   ├── index.md                      → docs/about/index.md
│   ├── contact.md                    → docs/about/contact.md
│   ├── manifesto.md                  → docs/about/manifesto.md
│   ├── roadmap.md                    → docs/about/roadmap.md
│   └── bread-token/
│       ├── index.md                  → docs/about/bread-token/index.md
│       ├── gardens-setup.md          → docs/about/bread-token/gardens-setup.md
│       └── marketplace/
│           ├── index.md              → docs/about/bread-token/marketplace/index.md
│           ├── cca-events.md         → docs/about/bread-token/marketplace/cca-events.md
│           ├── cl-discord.md         → docs/about/bread-token/marketplace/cl-discord.md
│           ├── dandelion-events.md   → docs/about/bread-token/marketplace/dandelion-events.md
│           ├── giveth-donations.md   → docs/about/bread-token/marketplace/giveth-donations.md
│           └── tbs-dao.md            → docs/about/bread-token/marketplace/tbs-dao.md
│
├── bread-cooperative/
│   ├── index.md                      → docs/bread-cooperative/index.md
│   ├── contributors/
│   │   ├── index.md                  → docs/bread-cooperative/contributors/index.md
│   │   ├── contributor-onboarding.md → docs/bread-cooperative/contributors/contributor-onboarding.md
│   │   └── how-to-eigenlayer.md      → docs/bread-cooperative/contributors/how-to-eigenlayer.md
│   ├── governance/
│   │   ├── index.md                  → docs/bread-cooperative/governance/index.md
│   │   ├── bread-constitution.md     → docs/bread-cooperative/governance/bread-constitution.md
│   │   └── operational-annex.md      → docs/bread-cooperative/governance/operational-annex.md
│   └── sourdough-systems/
│       ├── index.md                  → docs/bread-cooperative/sourdough-systems/index.md
│       └── gas-killer.md             → docs/bread-cooperative/sourdough-systems/gas-killer.md
│
└── solidarity-primitives/
    ├── index.md                      → docs/solidarity-primitives/index.md
    ├── stacks.md                     → docs/solidarity-primitives/stacks.md
    └── crowdstaking/
        ├── index.md                  → docs/solidarity-primitives/crowdstaking/index.md
        ├── how-to-become-a-member-project.md → docs/solidarity-primitives/crowdstaking/how-to-become-a-member-project.md
        ├── angel-minters/
        │   ├── index.md              → docs/solidarity-primitives/crowdstaking/angel-minters/index.md
        │   ├── 1hive.md              → docs/solidarity-primitives/crowdstaking/angel-minters/1hive.md
        │   ├── commons-hub.md        → docs/solidarity-primitives/crowdstaking/angel-minters/commons-hub.md
        │   ├── gnosis-dao.md         → docs/solidarity-primitives/crowdstaking/angel-minters/gnosis-dao.md
        │   ├── layer.md              → docs/solidarity-primitives/crowdstaking/angel-minters/layer.md
        │   ├── mask-network.md       → docs/solidarity-primitives/crowdstaking/angel-minters/mask-network.md
        │   ├── othentic.md           → docs/solidarity-primitives/crowdstaking/angel-minters/othentic.md
        │   ├── token-engineering-commons.md → docs/solidarity-primitives/crowdstaking/angel-minters/token-engineering-commons.md
        │   ├── toucan.md             → docs/solidarity-primitives/crowdstaking/angel-minters/toucan.md
        │   └── yieldnest.md          → docs/solidarity-primitives/crowdstaking/angel-minters/yieldnest.md
        ├── member-projects/
        │   ├── index.md              → docs/solidarity-primitives/crowdstaking/member-projects/index.md
        │   ├── bread-co-op.md        → docs/solidarity-primitives/crowdstaking/member-projects/bread-co-op.md
        │   ├── citizen-wallet.md     → docs/solidarity-primitives/crowdstaking/member-projects/citizen-wallet.md
        │   ├── crypto-commons-association.md → docs/solidarity-primitives/crowdstaking/member-projects/crypto-commons-association.md
        │   ├── refi-dao.md           → docs/solidarity-primitives/crowdstaking/member-projects/refi-dao.md
        │   ├── shared-treasury.md    → docs/solidarity-primitives/crowdstaking/member-projects/shared-treasury.md
        │   └── symbiota-coop.md      → docs/solidarity-primitives/crowdstaking/member-projects/symbiota-coop.md
        └── yield-governance/
            ├── index.md              → docs/solidarity-primitives/crowdstaking/yield-governance/index.md
            ├── voting-power.md       → docs/solidarity-primitives/crowdstaking/yield-governance/voting-power.md
            └── lp-vaults.md          → docs/solidarity-primitives/crowdstaking/yield-governance/lp-vaults.md
```

**Exclude**: `wiki/readme.md` — internal publishing notes, not public content.

---

## Images

**Copy all files** from `shared-quartz/content/attachments/` to `bread-docs/public/images/`.

106 files total: mostly `.webp`, plus a few `.pdf` and one `.json`. Copy everything as-is; non-image files will simply be unused.

Files include both descriptive names (`bread_imagine_banner.webp`, `voting-power-timeline.webp`) and generic names (`image.webp`, `image 1.webp`, `image 2.webp`, etc.). Filenames with spaces are common — preserve them exactly.

Reference images in converted markdown using absolute public paths: `/images/filename.webp`

---

## Transformation Rules

### 1. Frontmatter

**Remove** these Obsidian-specific fields entirely:
- `share`
- `fileClass`
- `alias`

**Convert** `permalink` → `slug`: preserves existing published URLs. `slug` is a reserved Astro content collections field set directly in frontmatter; it does **not** need to be added to `docsSchema()`.
- `permalink: "angel-minters"` → `slug: "angel-minters"`

**Map** ordering fields to Starlight's sidebar frontmatter:
- `folderOrder: N` → `sidebar:\n  order: N`
- `noteOrder: N` → `sidebar:\n  order: N`

**Keep as-is**: `title`, `description`

Example input:
```yaml
---
title: Angel Minter Program
share: true
folderOrder: 1
permalink: "angel-minters"
---
```

Example output:
```yaml
---
title: Angel Minter Program
slug: "angel-minters"
sidebar:
  order: 1
---
```

**Files with a `permalink` and their resulting slugs/URLs:**

| Source file | `permalink` → `slug` | Final URL |
|---|---|---|
| `about/contact.md` | `contact` | `/contact/` |
| `about/manifesto.md` | `manifesto` | `/manifesto/` |
| `about/roadmap.md` | `roadmap` | `/roadmap/` |
| `about/bread-token/index.md` | `token` | `/token/` |
| `about/bread-token/gardens-setup.md` | `gardens-setup` | `/gardens-setup/` |
| `about/bread-token/marketplace/index.md` | `marketplace` | `/marketplace/` |
| `solidarity-primitives/crowdstaking/index.md` | `solidarity-fund` | `/solidarity-fund/` |
| `solidarity-primitives/crowdstaking/how-to-become-a-member-project.md` | `how-to-become-a-member-project` | `/how-to-become-a-member-project/` |
| `solidarity-primitives/crowdstaking/angel-minters/index.md` | `angel-minters` | `/angel-minters/` |
| `solidarity-primitives/crowdstaking/member-projects/index.md` | `member-projects` | `/member-projects/` |
| `solidarity-primitives/crowdstaking/yield-governance/voting-power.md` | `voting-power` | `/voting-power/` |

All other files: `slug` is derived from file path (e.g., `bread-cooperative/governance/bread-constitution.md` → `/bread-cooperative/governance/bread-constitution/`).

### 2. Wiki Links

All `[[...]]` wikilinks must be converted to standard markdown links using **root-relative paths** (starting with `/`). Root-relative paths avoid computing per-file relative depths and work from any nesting level.

**Critical**: links must use the **slug-based URL** when the destination file has a `permalink` (which becomes `slug` after conversion) — not the file path. See the slug table in section 1 above.

**Conversion approach — two-pass**:
1. Scan all destination files for `slug` frontmatter values to build a lookup map: `filename/path → URL`
2. Convert all `[[...]]` patterns using the lookup map below

**Link format**:
- With display text: `[[target|Display Text]]` → `[Display Text](/resolved-url/)`
- Without display text: `[[target]]` → `[Display Text](/resolved-url/)` (use the display text from the table, or the last path segment capitalized)
- Links ending in `/index` → strip `/index` (e.g., `/about/bread-token/` not `/about/bread-token/index/`)

**Complete wikilink resolution table:**

| Wikilink pattern | Resolved URL | Notes |
|---|---|---|
| `[[wiki/index]]` or `[[wiki/index\|...]]` | `/` | Root/home |
| `[[wiki/about/bread-token/index]]` or `\|...` | `/token/` | slug override |
| `[[wiki/solidarity-primitives/index]]` or `\|...` | `/solidarity-primitives/` | path-derived |
| `[[wiki/solidarity-primitives/crowdstaking/index]]` or `\|...` | `/solidarity-fund/` | slug override |
| `[[wiki/solidarity-primitives/crowdstaking/yield-governance/index]]` or `\|...` | `/solidarity-primitives/crowdstaking/yield-governance/` | path-derived |
| `[[wiki/about/bread-token/marketplace/index]]` or `\|...` | `/marketplace/` | slug override |
| `[[wiki/bread-cooperative/index]]` or `\|...` | `/bread-cooperative/` | path-derived |
| `[[wiki/solidarity-primitives/crowdstaking/angel-minters/index]]` or `\|...` | `/angel-minters/` | slug override |
| `[[wiki/solidarity-primitives/crowdstaking/member-projects/index]]` or `\|...` | `/member-projects/` | slug override |
| `[[wiki/bread-cooperative/sourdough-systems/index]]` or `\|...` | `/bread-cooperative/sourdough-systems/` | path-derived |
| `[[contact]]` or `[[contact\|...]]` | `/contact/` | slug override |
| `[[roadmap]]` or `[[roadmap\|...]]` | `/roadmap/` | slug override |
| `[[stacks]]` or `[[stacks\|...]]` | `/solidarity-primitives/stacks/` | path-derived |
| `[[contributor-onboarding]]` or `\|...` | `/bread-cooperative/contributors/contributor-onboarding/` | path-derived |
| `[[how-to-become-a-member-project]]` or `\|...` | `/how-to-become-a-member-project/` | slug override |
| `[[gas-killer]]` or `[[gas-killer\|...]]` | `/bread-cooperative/sourdough-systems/gas-killer/` | path-derived |
| `[[gardens-setup]]` or `[[gardens-setup\|...]]` | `/gardens-setup/` | slug override |
| `[[voting-power]]` or `[[voting-power\|...]]` | `/voting-power/` | slug override |
| `[[citizen-wallet]]` or `[[citizen-wallet\|...]]` | `/solidarity-primitives/crowdstaking/member-projects/citizen-wallet/` | path-derived |
| `[[Patron Hall of Fame]]` or `\|...` | *(page does not exist)* | Remove link, keep display text |

### 3. Image Embeds

Obsidian image embed syntax:
```
![[bread_imagine_banner.webp]]
![[image 1.webp]]
![[voting-power-timeline.webp]]
```

Convert to standard markdown using the public images path:
```md
![bread_imagine_banner](/images/bread_imagine_banner.webp)
![image 1](/images/image 1.webp)
![voting-power-timeline](/images/voting-power-timeline.webp)
```

For the alt text, use the filename without extension. Files with spaces in names: URL-encode spaces in the `src` attribute — use `%20`: `![image 1](/images/image%201.webp)`.

Some files reference images that may not exist in the attachments folder (e.g., `Bread Cooperative_Coop_Network_and_site_Badge.webp` — note the different casing vs `Breadchain_Coop_Network_and_site_Badge.webp`). If an exact match can't be found, keep the embed and add an HTML comment: `<!-- image not found: original name -->`.

### 4. Obsidian Callouts

Obsidian callout syntax is not supported by Starlight. Convert to Starlight's `:::type[Title]` directive syntax.

**Also install `starlight-markdown-blocks`** — needed for the `Draft` block (used in section 5 below for Obsidian comment handling):

```bash
npm i starlight-markdown-blocks
```

Add to `astro.config.mjs` in the `starlight()` plugins array:
```js
import starlightMarkdownBlocks, { Draft } from 'starlight-markdown-blocks';

// inside starlight({ plugins: [...] }):
starlightMarkdownBlocks({
  blocks: {
    draft: Draft(),
  },
})
```

Note: `starlight-markdown-blocks` does **not** parse Obsidian `> [!type]` syntax — it uses `:::block-name` syntax alongside Starlight's native asides. Callout conversion still requires the `:::type[Title]` directive approach below.

**Input format:**
```
> [!info] Title text
> Body content line 1
> Body content line 2
```

**Output format (Starlight aside directive):**
```
:::note[Title text]
Body content line 1
Body content line 2
:::
```

**Callout type mapping:**
| Obsidian | Starlight directive |
|----------|-----------|
| `[!info]` | `:::note` |
| `[!note]` | `:::note` |
| `[!important]` | `:::caution` |
| `[!warning]` | `:::caution` |
| `[!tip]` | `:::tip` |
| `[!danger]` | `:::danger` |
| `[!abstract]` | `:::note` |
| `[!todo]` | `:::note` |

If no title is present after the callout type (e.g., `> [!info]` with no following text on the same line), omit the `[...]` label: `:::note`.

**Multi-line callout bodies**: Obsidian callouts continue on consecutive `> ` prefixed lines. Collect all consecutive `> ` lines following the `> [!type]` opener as the body.

Some callouts in the wiki are used as "link cards" — they contain just a title and a URL:
```
> [!info] Bread Crowdstaking
> Bake and burn BREAD.
> [https://app.breadchain.xyz/](https://app.breadchain.xyz/)
```
Convert these the same way as regular callouts.

### 5. Obsidian Comments

**Important**: Obsidian `%% ... %%` comments are **not** standard markdown and **will render as visible text** in Astro — remark treats `%%` as literal characters (not a CommonMark construct). They must be handled explicitly.

**Good news**: Grep of all wiki content files confirms `%% ... %%` only appears in `wiki/readme.md`, which is excluded from the import. No content files being imported contain this syntax.

**During import conversion**: If any `%% ... %%` block contains substantive draft content (multiple lines of prose/markdown) → convert to `:::draft\n...\n:::` (using the `Draft` block from `starlight-markdown-blocks` installed in section 4). Otherwise strip entirely.

**Add a runtime safety net** — create `remarkStripObsidianComments.mjs` in the project root:

```js
// remarkStripObsidianComments.mjs
import { visit } from 'unist-util-visit';
export function remarkStripObsidianComments() {
  return (tree) => {
    visit(tree, 'text', (node) => {
      node.value = node.value.replace(/%%[\s\S]*?%%/g, '');
    });
  };
}
```

Add to `astro.config.mjs`:
```js
import { remarkStripObsidianComments } from './remarkStripObsidianComments.mjs';

// in defineConfig markdown config:
markdown: {
  remarkPlugins: [remarkStripObsidianComments],
},
```

### 6. The Home Page (`docs/index.md`)

The source `wiki/index.md` has `fileClass: file` (not an index page in the Quartz sense — it's the root entry point). Convert it as a regular content page.

**Delete** the existing `docs/index.mdx` (it's the Starlight boilerplate splash template).

**Create** `docs/index.md` from `wiki/index.md` with full transformation rules applied.

The resulting frontmatter should be minimal:
```yaml
---
title: Bread Cooperative Wiki
---
```

### 7. Delete Template Files

Remove the boilerplate files that came with the Starlight scaffold:
- `docs/index.mdx` (replaced by converted wiki/index.md)
- `docs/guides/example.md`
- `docs/reference/example.md`
- `docs/guides/` directory (if empty after removing example)
- `docs/reference/` directory (if empty after removing example)

---

## Sidebar Configuration

Update `astro.config.mjs` to reflect the new content structure. Replace the existing placeholder `sidebar` array with autogenerate entries for each top-level section, ordered by the wiki's `folderOrder` values:

```js
sidebar: [
  {
    label: 'About',
    autogenerate: { directory: 'about' },
  },
  {
    label: 'Solidarity Primitives',
    autogenerate: { directory: 'solidarity-primitives' },
  },
  {
    label: 'Bread Cooperative',
    autogenerate: { directory: 'bread-cooperative' },
  },
],
```

The `sidebar.order` frontmatter values (converted from `folderOrder`/`noteOrder`) will control ordering within each autogenerated group.

---

## Starlight Frontmatter Reference

Valid Starlight frontmatter fields (from `docsSchema()`):

```yaml
title: string           # required for all pages
description: string     # optional, used for SEO meta
sidebar:
  label: string         # override the sidebar label
  order: number         # sort order within its group (lower = first)
  hidden: boolean       # hide from sidebar
  badge: string|object  # add a badge
tableOfContents: boolean|object  # override TOC behavior
template: doc|splash    # page template (default: doc)
hero: object            # splash template hero config
head: []                # inject extra <head> elements
editUrl: string|boolean # override edit link
prev: boolean|string|object  # previous page nav
next: boolean|string|object  # next page nav
pagefind: boolean       # include in search
draft: boolean          # mark as draft (hidden in prod)
```

Only use `title`, `description`, and `sidebar.order` unless the source frontmatter has relevant values that map to other fields.

---

## Starlight Aside Directives (for reference)

Starlight uses `remark-directive` which is included by default. Aside syntax:

```md
:::note
A note.
:::

:::tip[Custom Title]
A tip with a custom title.
:::

:::caution
A warning.
:::

:::danger
A danger warning.
:::
```

These render as styled aside boxes. No MDX required — plain `.md` files support this syntax.

---

## Summary of Steps

1. **Copy images**: `shared-quartz/content/attachments/*` → `bread-docs/public/images/`
2. **Delete boilerplate**: Remove `docs/index.mdx`, `docs/guides/`, `docs/reference/`
3. **Create directory structure** in `docs/` mirroring the wiki
4. **For each wiki `.md` file** (except `readme.md`):
   - Copy to destination path (see mapping above)
   - Clean frontmatter (remove Obsidian fields, map ordering to `sidebar.order`)
   - Convert wiki links to standard markdown links
   - Convert image embeds to `![alt](/images/filename.webp)`
   - Convert Obsidian callouts to Starlight aside directives
   - Strip `%% comment %%` blocks (or convert substantive draft content to `:::draft\n...\n:::`)
5. **Update `astro.config.mjs`**: Replace sidebar config with the 3-section autogenerate structure; add `starlightMarkdownBlocks` plugin; add `remarkStripObsidianComments` remark plugin

---

## Notes & Edge Cases

- **File `wiki/index.md`** has no `folderOrder` — omit `sidebar.order` from its frontmatter
- **Files without `title`** in frontmatter: check the H1 heading and use it as `title`, or derive from filename
- **Mixed link styles**: Some files use both `[[wiki/path]]` and short `[[name]]` wikilinks on the same page
- **`[[Patron Hall of Fame]]`** (in angel-minters/index.md line 142) references a page that doesn't exist in the wiki — convert to plain text or remove the link
- **`[[wiki/index]]`** self-references the root — convert to `/` or `/index`
- **Image names with spaces**: URL-encode in the src attribute (`image%201.webp`)
- **Trailing spaces in callout lines**: Some callouts use `  ` (two trailing spaces) for line breaks — preserve these in the converted output
- **`readme.md`** at `wiki/readme.md` — **do not import** (internal publishing notes)
- The Quartz site's `ignorePatterns` excluded `readme.md` files; do the same here
