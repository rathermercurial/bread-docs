# GitHub Wiki Sync Integration

Astro integration that automatically syncs markdown content and attachments from a private GitHub repository into your Starlight documentation site.

## Features

- **Automatic Content Sync** - Downloads markdown files from a specified directory in your GitHub repository
- **Intelligent Caching** - Hybrid caching system minimizes API calls and only downloads changed content
- **Attachment Management** - Automatically downloads referenced images and assets
- **Readme Filtering** - Excludes readme.md files from sync
- **Build-Only Execution** - Only runs during `astro build`, not during dev/preview modes
- **Error Handling** - Clear error messages and troubleshooting guidance

## Installation

The integration is already included in this project. Required dependencies:

```bash
npm install octokit
```

## Configuration

### 1. Environment Variables

Create a `.env` file in your project root:

```env
GITHUB_TOKEN=ghp_your_personal_access_token_here
GITHUB_REPO_OWNER=BreadchainCoop
GITHUB_REPO_NAME=shared-obsidian
GITHUB_WIKI_PATH=wiki
```

**Required:**
- `GITHUB_TOKEN` - Personal Access Token or GitHub App credentials
- `GITHUB_REPO_OWNER` - Repository owner (organization or user)
- `GITHUB_REPO_NAME` - Repository name

**Optional:**
- `GITHUB_WIKI_PATH` - Subdirectory containing wiki content (default: `wiki`)

### 2. GitHub Token Setup

**For Development/Testing (Personal Access Token):**

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scope: **repo** (Full control of private repositories)
4. Generate and copy the token
5. Add to your `.env` file

**For Production (GitHub App):**

GitHub App authentication is supported but not yet configured. The integration will automatically detect and use app credentials when available.

### 3. Astro Configuration

The integration is already configured in `astro.config.mjs`:

```javascript
import githubWikiSync from './src/integrations/github-wiki-sync.ts';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

export default defineConfig({
  integrations: [
    githubWikiSync({
      token: env.GITHUB_TOKEN || '',
      owner: env.GITHUB_REPO_OWNER || 'BreadchainCoop',
      repo: env.GITHUB_REPO_NAME || 'shared-obsidian',
      wikiPath: env.GITHUB_WIKI_PATH || 'wiki',
      contentDir: 'src/content/docs',
      attachmentsDir: 'public/attachments',
    }),
    starlight({
      // ...starlight config
    }),
  ],
});
```

## How It Works

### Content Syncing

1. **During Build** (`npm run build`):
   - Connects to GitHub using your token
   - Fetches all markdown files from the `wiki/` directory
   - Downloads referenced images and attachments
   - Writes files to `src/content/docs/` for Starlight to process

2. **During Dev/Preview** (`npm run dev` or `npm run preview`):
   - **Skips sync** to avoid slow startups
   - Uses previously synced content
   - Run `npm run build` to refresh content

### Intelligent Caching

The integration uses a **hybrid caching system** to minimize API calls and downloads:

#### Level 1: Repository-Level Caching (Fast Path)
- Checks the latest commit SHA of the repository
- If unchanged since last sync AND all local files exist:
  - **Skips entire sync** (1 API call total)
  - Instant build completion

#### Level 2: File-Level Caching (Incremental)
- Compares individual file SHAs from the repository tree
- Only downloads files that have changed
- Significantly faster for small updates

#### Level 3: Attachment Tree Indexing
- Indexes all images in the repository from the tree API
- Looks up attachments by filename (no extra API calls)
- Caches attachment SHAs for change detection
- Warns about duplicate filenames

### Cache Storage

**Location:** `.astro/github-wiki-cache.json` (automatically gitignored)

**Cache Structure:**
```json
{
  "version": 1,
  "repositorySha": "abc123...",
  "lastSync": "2025-11-09T10:00:00Z",
  "files": {
    "page.md": {
      "sha": "def456...",
      "syncedAt": "2025-11-09T10:00:00Z",
      "localPath": "/absolute/path/to/src/content/docs/page.md"
    }
  },
  "attachments": {
    "image.png": {
      "sha": "ghi789...",
      "sourceUrl": "attachments/image.png",
      "syncedAt": "2025-11-09T10:00:00Z",
      "localPath": "/absolute/path/to/public/attachments/image.png",
      "referencedBy": []
    }
  }
}
```

### Performance

**Scenario 1: No Changes (Best Case)**
```
API Calls: 1 (commit SHA check)
Downloads: 0
Time: < 1 second
```

**Scenario 2: 1 File Changed (Out of 50 files, 20 images)**
```
API Calls: 4 (commit + tree + changed file + changed image)
Downloads: 2
Time Saved: ~95%
vs Without Cache: 72+ API calls
```

**Scenario 3: Full Rebuild (Cache Cleared)**
```
API Calls: Same as initial build
Downloads: All files
Result: Rebuilds cache for next time
```

## Usage

### First Time Setup

1. Configure your `.env` file with GitHub credentials
2. Run your first build:

```bash
npm run build
```

Expected output:
```
[github-wiki-sync] Starting GitHub wiki sync...
[github-wiki-sync] Repository: BreadchainCoop/shared-obsidian
[github-wiki-sync] Using branch: main
[github-wiki-sync] Indexed 20 attachments in repository
[github-wiki-sync] Found 50 wiki files
[github-wiki-sync] Syncing: page1.md
[github-wiki-sync] Syncing: page2.md
...
[github-wiki-sync] Files: 50 synced, 0 cached
[github-wiki-sync] Attachments: 15 synced, 0 cached
[github-wiki-sync] Cache updated: 50 files, 15 attachments tracked
[github-wiki-sync] GitHub wiki sync completed successfully
```

### Subsequent Builds (No Changes)

```bash
npm run build
```

Expected output:
```
[github-wiki-sync] Starting GitHub wiki sync...
[github-wiki-sync] Repository SHA unchanged since last sync
[github-wiki-sync] All 50 files and 15 attachments present - skipping sync
```

### Development Workflow

```bash
# Sync content from GitHub
npm run build

# Start dev server (uses cached content)
npm run dev

# Make changes in GitHub, then rebuild to sync
npm run build
```

## File Handling

### Included Files
- All `.md` files in the `wiki/` directory
- Images referenced by markdown files (multiple formats supported)
- Nested subdirectories are preserved

### Excluded Files
- `readme.md` files (case-insensitive)
- Files outside the `wiki/` directory
- Non-markdown files (except referenced images)

### Supported Image Formats
- `jpg`, `jpeg`, `png`, `gif`, `svg`, `webp`, `apng`, `bmp`, `ico`

### Image Reference Detection

The integration detects images referenced in these formats:

**Wikilinks (Obsidian-style):**
```markdown
![[image.png]]
![[folder/image.png]]
![[image.png|alt text]]
```

**Standard Markdown:**
```markdown
![alt text](image.png)
![alt text](folder/image.png)
```

**Note:** External URLs (`http://`, `https://`) are ignored.

## Cache Management

### Manual Cache Invalidation

Force a full re-sync by deleting the cache file:

```bash
rm .astro/github-wiki-cache.json
npm run build
```

### Automatic Cache Invalidation

The cache is automatically invalidated when:
- Cache file is corrupted or missing
- Cache version doesn't match (after updates)
- Repository commit SHA changes (triggers incremental sync)

### Cache Behavior

**Deleted Files:**
- Automatically removed from local filesystem
- Removed from cache

**Unreferenced Attachments:**
- Automatically deleted if no markdown files reference them
- Keeps the `public/attachments/` directory clean

**Renamed Files:**
- Treated as delete + add
- Old file removed, new file downloaded

## Troubleshooting

### Error: "GITHUB_TOKEN is not set"

**Cause:** Missing or incorrect environment variable.

**Solution:**
1. Verify `.env` file exists in project root
2. Check that `GITHUB_TOKEN` is set correctly
3. Restart your terminal/IDE to reload environment

### Error: "Not Found"

**Cause:** Token doesn't have access to the repository.

**Solutions:**
1. Verify token has `repo` scope for private repositories
2. Confirm repository owner and name are correct
3. Check token hasn't expired
4. Ensure you have access to the repository

### Slow Builds

**Cause:** Cache not being used or large repository.

**Solutions:**
1. Check `.astro/github-wiki-cache.json` exists
2. Verify cache is being hit (look for "cached" messages in logs)
3. Consider reducing number of attachments if possible

### Missing Images

**Cause:** Image not found in repository or ambiguous filename.

**Solutions:**
1. Check build logs for "Image not found" warnings
2. Verify image exists in repository
3. Look for "Duplicate image filename" warnings
4. Use unique filenames for all images

### Duplicate Image Warnings

**Example:**
```
[github-wiki-sync] Duplicate image filename: logo.png
[github-wiki-sync]   - assets/logo.png
[github-wiki-sync]   - images/logo.png
```

**Solution:** Rename one of the images to have a unique filename.

## API Rate Limits

### GitHub API Limits

**Personal Access Token:**
- 5,000 requests/hour

**GitHub App:**
- 15,000 requests/hour

### Cache Impact

**Without Caching:**
- ~72+ API calls per build (50 files + 20 images)
- 69 builds/hour max (PAT)

**With Caching (no changes):**
- 1 API call per build
- 5,000 builds/hour max (PAT)

**With Caching (1 file changed):**
- 4 API calls per build
- 1,250 builds/hour max (PAT)

The caching system keeps you well within rate limits for typical usage.

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        env:
          GITHUB_TOKEN: ${{ secrets.WIKI_GITHUB_TOKEN }}
          GITHUB_REPO_OWNER: BreadchainCoop
          GITHUB_REPO_NAME: shared-obsidian
          GITHUB_WIKI_PATH: wiki
        run: npm run build

      - name: Deploy
        # Your deployment step here
```

**Important:** Store `GITHUB_TOKEN` as a GitHub Secret, not in your workflow file.

## Architecture

### File Structure

```
bread-docs/
├── src/
│   ├── content/
│   │   └── docs/              # Synced wiki files written here
│   │       ├── page1.md
│   │       ├── page2.md
│   │       └── ...
│   ├── integrations/
│   │   └── github-wiki-sync.ts    # Main integration
│   └── lib/
│       └── github-cache.ts        # Cache utilities
├── public/
│   └── attachments/           # Synced images written here
│       ├── image1.png
│       └── ...
├── .astro/
│   └── github-wiki-cache.json # Cache metadata (gitignored)
├── .env                       # GitHub credentials (gitignored)
└── astro.config.mjs          # Integration configuration
```

### Data Flow

```
GitHub Repository (wiki/)
         ↓
   Octokit API Client
         ↓
   Cache Check (SHA comparison)
         ↓
   ┌─────────────┬──────────────┐
   ↓             ↓              ↓
Markdown Files  Tree Index  Attachments
   ↓             ↓              ↓
src/content/  (in memory)  public/attachments/
   ↓                            ↓
Starlight        ←──────────────┘
   ↓
Static Site
```

## Future Enhancements

Potential improvements (not yet implemented):

- **GitHub App Support** - Enhanced authentication for organizations
- **Webhook Integration** - Real-time sync on repository changes
- **Partial Sync** - Sync specific directories or file patterns
- **Conflict Resolution** - Handle local modifications
- **Link Transformation** - Process Obsidian wikilinks (separate feature planned)

## License

Same as parent project.

## Support

For issues or questions, please open an issue in the repository.
