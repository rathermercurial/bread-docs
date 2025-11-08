# GitHub Vault Content Loader Implementation Plan

## Overview
Build a custom Astro content loader with integration to fetch wiki content and attachments from the private `shared-obsidian` repository via GitHub API. Uses intelligent filtering to only download referenced attachments.

---

## Architecture: Hybrid Integration + Loader

Based on feasibility research, the implementation uses three components:

**Component 1: Content Loader** - Fetches markdown content
- Fetches repository tree via GitHub API
- Downloads markdown files from wiki/ directory
- Extracts frontmatter & content
- Stores in Astro DataStore (no file writing)
- Returns collection entries

**Component 2: Astro Integration** - Downloads static assets
- Runs during `astro:build:start` hook
- Reads DataStore from loader
- Parses markdown to extract image references
- Downloads only referenced images to `public/attachments/`

**Component 3: Remark Plugin** - Processes Obsidian syntax
- Uses `@flowershow/remark-wiki-link` package
- Converts `[[wikilinks]]` to standard links
- Converts `![[images]]` to `<img>` tags
- Configured in `astro.config.mjs`

---

## Authentication Strategy

**Development/Testing:**
- Personal Access Token (PAT)
- Simple setup: `GITHUB_TOKEN=ghp_xxx`
- Quick iteration for initial development

**Production (Organization):**
- GitHub App (organization-owned)
- Not tied to individual user accounts
- Better for team/organization scenarios
- Credentials: App ID + Private Key + Installation ID
- Loader supports both methods via conditional logic

---

## Flowershow Remark Plugin Integration

### How Remark Plugins Work in Astro

**Processing Pipeline:**
Remark plugins operate during the Markdown compilation phase. When configured in `astro.config.mjs`, they're applied when Astro processes Markdown files—whether imported directly or queried through content collections.

The pipeline works as follows:
1. Raw Markdown is parsed into an AST (Abstract Syntax Tree)
2. Configured remark plugins transform the AST
3. Rehype plugins further process the resulting HTML
4. Final HTML is rendered to pages or components

**Timing:**
- Plugins run at **build time**, not runtime
- Transformations happen once during static site generation
- For content collections, plugins process content when the collection is loaded

**Integration with Content Collections:**
- Plugins work seamlessly with Astro's content layer
- Modify markdown before it's stored in the collection
- Can add/modify frontmatter via `file.data.astro.frontmatter`
- Plugin order matters—some depend on others running first

### @flowershow/remark-wiki-link Specifics

**What It Does:**
The plugin converts Obsidian-style wiki syntax into standard markdown/HTML nodes:

| Input Syntax | Transformation | Output |
|-------------|----------------|---------|
| `[[Page Name]]` | Internal link | `<a href="/page-name">Page Name</a>` |
| `[[target\|custom text]]` | Aliased link | `<a href="/target">custom text</a>` |
| `[[link#heading]]` | Anchored link | `<a href="/link#heading">link</a>` |
| `![[image.png]]` | Image embed | `<img src="/attachments/image.png">` |
| `![[Document.pdf]]` | Document embed | Fallback to text (planned for future) |

**Supported Image Formats:**
jpg, jpeg, png, apng, webp, gif, svg, bmp, ico

**Configuration Options:**

```typescript
{
  // Path resolution strategy
  format: "regular" | "shortestPossible",  // Default: "regular"

  // URL list for matching wikilinks (for validation)
  permalinks: Array<string>,  // Default: []

  // CSS class for all wiki links
  className: string,  // Default: "internal"

  // CSS class for links without matching permalink
  newClassName: string,  // Default: "new"

  // Custom path resolution function
  wikiLinkResolver: (name: string) => [string],

  // Separator between target and alias
  aliasDivider: string,  // Default: "|"

  // Path formatting style
  pathFormat: "obsidian-absolute" | "obsidian-short" | string
}
```

### Using Outside Flowershow

**Standalone Capability:**
The plugin is **completely standalone** and has no dependencies on the Flowershow framework. It's a pure remark plugin that works with any unified/remark pipeline.

**Installation:**
```bash
npm install @flowershow/remark-wiki-link
# OR use the @portaljs version (same maintainers)
npm install @portaljs/remark-wiki-link
```

**Basic Astro Integration:**
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import wikiLinkPlugin from '@flowershow/remark-wiki-link';

export default defineConfig({
  markdown: {
    remarkPlugins: [
      [wikiLinkPlugin, {
        pathFormat: 'obsidian-absolute',
        wikiLinkResolver: (name) => {
          // Convert wiki link name to URL path
          // name = "Page Name" from [[Page Name]]
          const slug = name.toLowerCase().replace(/\s+/g, '-');
          return [`/wiki/${slug}`];
        }
      }]
    ]
  }
});
```

**Advanced Configuration for Our Use Case:**

For the Breadchain wiki integration, we'll need custom resolution for both page links and image links:

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import wikiLinkPlugin from '@flowershow/remark-wiki-link';
import { getCollection } from 'astro:content';

// Helper to determine if link is an image
function isImageFile(name) {
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'apng', 'bmp', 'ico'];
  const ext = name.split('.').pop()?.toLowerCase();
  return ext && imageExts.includes(ext);
}

export default defineConfig({
  markdown: {
    remarkPlugins: [
      [wikiLinkPlugin, {
        pathFormat: 'obsidian-absolute',
        aliasDivider: '|',

        // Custom resolver for wiki links and images
        wikiLinkResolver: (name) => {
          // Handle image links: [[image.png]] -> /attachments/image.png
          if (isImageFile(name)) {
            const filename = name.split('/').pop(); // Handle subdirs
            return [`/attachments/${filename}`];
          }

          // Handle page links: [[Page Name]] -> /wiki/page-name
          const slug = name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, ''); // Remove special chars

          return [`/wiki/${slug}`];
        },

        // Optional: Provide permalinks for validation
        // (will add "new" class to links not in this list)
        permalinks: [] // Can populate from getCollection() if needed
      }]
    ]
  }
});
```

### Practical Examples

**Input Markdown (Obsidian format):**
```markdown
# My Wiki Page

Check out [[Another Page]] for more information.

Here's an image: ![[screenshot.png]]

Or with custom text: [[Another Page|click here]]

Heading anchor: [[Page#section|jump to section]]
```

**Output HTML (after remark processing):**
```html
<h1>My Wiki Page</h1>

<p>Check out <a href="/wiki/another-page" class="internal">Another Page</a> for more information.</p>

<p>Here's an image: <img src="/attachments/screenshot.png" alt="screenshot.png"></p>

<p>Or with custom text: <a href="/wiki/another-page" class="internal">click here</a></p>

<p>Heading anchor: <a href="/wiki/page#section" class="internal">jump to section</a></p>
```

### Integration with Dynamic Routes

The plugin works perfectly with Astro's dynamic routing. Here's how it all connects:

**1. Content Collection (src/content.config.ts):**
```typescript
const wiki = defineCollection({
  loader: githubVaultLoader({...}),
  schema: z.object({
    title: z.string(),
    // ... other fields
  })
});
```

**2. Dynamic Route (src/pages/wiki/[slug].astro):**
```astro
---
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const wikiPages = await getCollection('wiki');
  return wikiPages.map(page => ({
    params: { slug: page.id },
    props: { page }
  }));
}

const { page } = Astro.props;
const { Content } = await page.render();
---

<article>
  <h1>{page.data.title}</h1>
  <Content />
</article>
```

**3. Wikilinks Automatically Resolve:**
- `[[Another Page]]` → `/wiki/another-page` (matches route pattern)
- Page exists at that route due to getStaticPaths()
- Links work seamlessly without manual mapping

### Potential Issues and Solutions

**Issue 1: Broken Links (404s)**
- **Cause:** Wikilink refers to page that doesn't exist in collection
- **Solution:** Use `permalinks` option to validate, add CSS for `.new` class
- **Example:**
  ```css
  a.new { color: red; text-decoration: dotted; }
  a.new::after { content: " (missing)"; }
  ```

**Issue 2: Image Paths Don't Match**
- **Cause:** Obsidian uses different folder structure than deployed site
- **Solution:** Normalize paths in `wikiLinkResolver` to always use `/attachments/`
- Our integration handles this by downloading to `public/attachments/`

**Issue 3: Case Sensitivity**
- **Cause:** `[[Page Name]]` vs `[[page name]]` create different URLs
- **Solution:** Normalize to lowercase in resolver (shown above)
- Store both formats in loader metadata if needed

**Issue 4: Special Characters in Filenames**
- **Cause:** Obsidian allows spaces, special chars; URLs need slugification
- **Solution:** Use consistent slugification in both resolver and route params
- **Example:** `[[My Page (2024)!]]` → `my-page-2024`

### Performance Considerations

**Build Time:**
- Remark plugins add minimal overhead (typically <100ms per file)
- Plugin runs once per markdown file during build
- Cached between builds if content unchanged

**Development Mode:**
- Hot reload works normally
- Plugin re-runs only on changed files
- Fast iteration cycle maintained

---

## File Structure

```
bread-docs/
├── src/
│   ├── content.config.ts          # Content collections with loader
│   ├── loaders/
│   │   └── github-vault.ts        # Custom GitHub loader (data only)
│   ├── integrations/
│   │   └── github-assets.ts       # Asset download integration
│   ├── pages/
│   │   └── wiki/
│   │       └── [slug].astro       # Dynamic wiki pages
│   └── components/
│       └── WikiNote.astro         # Note display component
├── public/
│   └── attachments/               # Downloaded images (created at build)
├── astro.config.mjs               # Config + integrations + remark
├── .env                           # GitHub credentials (gitignored)
└── temp/
    └── github-loader-plan.md      # This plan document
```

---

## Implementation Steps

### 1. Setup Development Authentication
- Create Personal Access Token for testing
- Permissions: Read access to `BreadchainCoop/shared-obsidian`
- Add to `.env`:
  ```bash
  GITHUB_TOKEN=ghp_xxxxxxxxxxxx
  GITHUB_REPO_OWNER=BreadchainCoop
  GITHUB_REPO_NAME=shared-obsidian
  ```
- Verify `.env` in `.gitignore`

### 2. Install Dependencies
```bash
npm install octokit @octokit/auth-app @flowershow/remark-wiki-link unist-util-visit
```

### 3. Remove Existing Example Content
- Delete `src/content/docs/` directory completely

### 4. Create GitHub Vault Loader
Create `src/loaders/github-vault.ts`:
- Factory function supporting both PAT and GitHub App auth
- Fetch repository tree using `octokit.rest.git.getTree()`
- Filter for markdown files in `wiki/` subdirectory
- For each markdown file:
  - Fetch content via `octokit.rest.repos.getContent()`
  - Parse frontmatter and extract metadata
  - Store in DataStore via `store.set()`
- Implement caching using `meta` store
- Store digests to skip unchanged files
- Extract image references and store in metadata

### 5. Create GitHub Assets Integration
Create `src/integrations/github-assets.ts`:
- Export Astro integration with `astro:build:start` hook
- Access content collection data from loader
- Parse markdown files to extract image references:
  - Wikilinks: `![[image.png]]`
  - Markdown: `![](path/image.png)`
- Build set of unique referenced attachments
- Download each via GitHub API to `public/attachments/`
- Handle base64 decoding for binary files
- Create directories as needed

### 6. Configure Content Collection
Update `src/content.config.ts`:
- Import custom loader
- Define `wiki` collection with loader
- Configure schema for frontmatter fields
- Pass auth config from environment variables

### 7. Configure Astro with Integration and Remark
Update `astro.config.mjs`:
- Import and add custom integration
- Configure `@flowershow/remark-wiki-link` plugin
- Set up wikilink resolver to map Obsidian paths to Astro URLs
- Configure image path transformation to `/attachments/`

### 8. Create Dynamic Wiki Pages
Create `src/pages/wiki/[slug].astro`:
- Use `getCollection('wiki')` for static paths
- Render markdown content with wikilinks automatically transformed
- Display frontmatter metadata
- Handle page layout

### 9. Test with PAT
- Run `astro dev` locally
- Verify authentication works
- Confirm only `wiki/` content loads
- Check attachments are downloaded (only referenced ones)
- Test various Obsidian link formats:
  - `[[Page Name]]` → links to /wiki/page-name
  - `![[image.png]]` → renders image from /attachments/
  - `[[Page|alias]]` → displays custom text
  - `[[Page#heading]]` → includes fragment identifier

### 10. Setup GitHub App (Production - Later Phase)
- Create GitHub App in BreadchainCoop organization
- Configure permissions: Contents (Read), Metadata (Read)
- Install app on `shared-obsidian` repository
- Generate private key
- Store credentials as GitHub Secrets:
  ```
  GITHUB_APP_ID
  GITHUB_APP_PRIVATE_KEY
  GITHUB_APP_INSTALLATION_ID
  ```
- Update loader to detect and use App credentials

### 11. Configure CI/CD
Update `.github/workflows/deploy.yml`:
- For PAT approach: Use repository secret
- For GitHub App: Use `actions/create-github-app-token@v1`
- Set environment variables for build
- Verify builds succeed with private repo access

### 12. Documentation
- Document PAT setup for local development
- Document GitHub App setup for production
- List required environment variables
- Provide troubleshooting guide
- Include examples of supported Obsidian syntax
- Document wikilink resolver customization

---

## Key Implementation Details

### Authentication Factory:
```typescript
function createOctokit(config) {
  if (config.token) {
    return new Octokit({ auth: config.token });
  } else {
    return new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: config.appId,
        privateKey: config.privateKey,
        installationId: config.installationId,
      },
    });
  }
}
```

### Caching Strategy:
```typescript
const lastSha = meta.get('wiki-tree-sha');
const currentSha = await getCurrentCommitSha();

if (lastSha === currentSha) {
  logger.info('No changes, skipping fetch');
  return;
}

// Fetch and process...
meta.set('wiki-tree-sha', currentSha);
```

### Attachment Filtering:
```typescript
// In integration, parse markdown to extract images
function extractImageReferences(markdown) {
  const images = new Set();

  // Wikilinks: ![[image.png]]
  const wikiPattern = /!\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g;
  for (const match of markdown.matchAll(wikiPattern)) {
    images.add(match[1].trim().split('/').pop());
  }

  // Markdown: ![](path)
  const mdPattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  for (const match of markdown.matchAll(mdPattern)) {
    images.add(match[2].trim().split('/').pop());
  }

  return Array.from(images);
}
```

---

## Why This Architecture

**Loader Only Stores Data:**
- Astro loaders cannot write files to filesystem
- Designed for DataStore interaction only
- Appropriate separation of concerns

**Integration Downloads Files:**
- Astro integrations have full filesystem access
- `astro:build:start` hook runs before build
- Can create files in `public/` directory
- Proper place for static asset management

**Remark Plugin Processes Syntax:**
- Runs during markdown rendering
- Handles Obsidian-specific syntax
- Proven, maintained package available
- Integrates with Astro's markdown pipeline
- Standalone—no Flowershow framework required
- Works seamlessly with content collections

---

## Production Migration Path

1. Develop and test with PAT locally
2. Deploy to CI/CD with PAT (stored as secret)
3. Create GitHub App when ready for production
4. Switch environment variables to App credentials
5. No code changes needed (loader supports both)

---

## Performance Optimizations

**Efficient API Usage:**
- Use Tree API (1 call) instead of listing files (N calls)
- Download only referenced attachments
- Implement caching with commit SHA comparison
- Use content digests to skip unchanged entries

**Build Performance:**
- Tree API: 1 call for entire repository structure
- Content API: ~N calls for markdown files
- Attachment downloads: ~M calls (only referenced)
- Total: Approximately 1 + N + M calls per build
- With caching: 1-2 calls if no changes

**Rate Limits:**
- PAT: 5,000 requests/hour
- GitHub App: 15,000 requests/hour
- Caching reduces calls to near-zero for unchanged content

---

## Next Steps After Approval

1. Set up development environment and PAT
2. Install required dependencies
3. Implement loader (core functionality)
4. Implement integration (asset downloads)
5. Configure remark plugin with custom resolver
6. Test end-to-end locally
7. Deploy to staging/production
