# Data Collections Quick Start

Get started with organizations and contributors collections in 5 minutes.

## TL;DR

1. Organize data files in GitHub repo: `data/organizations/` and `data/contributors/`
2. Create JSON or Markdown files with required fields
3. Collections automatically sync on build
4. Query with `getCollection('organizations')` or `getCollection('contributors')`

## Prerequisites

✅ GitHub token with read access to source repository
✅ Repository structure: `data/organizations/` and `data/contributors/`
✅ Environment variables configured in `.env`

## Step 1: Set Up Source Repository

In your `BreadchainCoop/shared-obsidian` repository:

```bash
mkdir -p data/organizations
mkdir -p data/contributors
```

## Step 2: Create Your First Organization

**File:** `data/organizations/example.json`

```json
{
  "id": "example",
  "name": "Example Project",
  "description": "A sample organization",
  "isMemberProject": true,
  "isAngelMinter": false,
  "isMarketplace": false,
  "website": "https://example.com",
  "tags": ["example"],
  "status": "active"
}
```

## Step 3: Create Your First Contributor

**File:** `data/contributors/example-user.json`

```json
{
  "id": "example-user",
  "name": "Example User",
  "bio": "A sample contributor",
  "githubUsername": "example-user",
  "roles": ["Contributor"],
  "organizations": ["example"],
  "isActive": true
}
```

## Step 4: Build and Test

```bash
# Install dependencies (first time only)
npm install

# Run a build (loaders execute during build)
npm run build

# Check for errors
npm run typecheck
```

## Step 5: Query Collections in Pages

```astro
---
// src/pages/test.astro
import { getCollection } from 'astro:content';

const orgs = await getCollection('organizations');
const contributors = await getCollection('contributors');
---

<h1>Collections Test</h1>
<p>Organizations: {orgs.length}</p>
<p>Contributors: {contributors.length}</p>

<h2>Organizations</h2>
<ul>
  {orgs.map((org) => (
    <li>{org.data.name} - {org.data.description}</li>
  ))}
</ul>

<h2>Contributors</h2>
<ul>
  {contributors.map((c) => (
    <li>{c.data.name} - {c.data.bio}</li>
  ))}
</ul>
```

## Common Queries

### Get all member projects
```typescript
const members = await getCollection('organizations',
  (org) => org.data.isMemberProject
);
```

### Get all angel minters
```typescript
const angels = await getCollection('organizations',
  (org) => org.data.isAngelMinter
);
```

### Get organizations that are both
```typescript
const both = await getCollection('organizations',
  (org) => org.data.isMemberProject && org.data.isAngelMinter
);
```

### Get active contributors
```typescript
const active = await getCollection('contributors',
  (c) => c.data.isActive
);
```

### Get specific organization
```typescript
const breadchain = await getEntry('organizations', 'breadchain');
```

## File Formats

### JSON (Simple)
```json
{
  "id": "my-id",
  "name": "My Name",
  "description": "My description",
  "isMemberProject": true,
  "isAngelMinter": false,
  "isMarketplace": false
}
```

### Markdown (With Content)
```markdown
---
id: my-id
name: My Name
description: My description
isMemberProject: true
isAngelMinter: false
isMarketplace: false
---

# Extended Content

Additional markdown content here...
```

## Enabling Enrichment

To enable enrichment (ENS, Hats Protocol, GitHub profiles):

1. Edit `src/content.config.ts`
2. Change `enableEnrichment` setting:

```typescript
organizations: defineCollection({
  loader: createOrganizationsLoader({
    // ...
    enableEnrichment: 'blockchain', // or 'social', 'full'
  }),
  // ...
}),
```

3. Enable specific plugins in `src/lib/enrichment-plugins.ts`:

```typescript
export const ensEnrichmentPlugin: EnrichmentPlugin = {
  name: 'ens-enrichment',
  enabled: true, // ← Change to true
  // ...
};
```

4. Implement the enrichment logic (see architecture docs)

## Environment Variables

Required in `.env`:

```env
GITHUB_TOKEN=ghp_your_token_here
GITHUB_REPO_OWNER=BreadchainCoop
GITHUB_REPO_NAME=shared-obsidian

# Optional: customize paths
ORGANIZATIONS_PATH=data/organizations
CONTRIBUTORS_PATH=data/contributors
```

## Troubleshooting

### Collections not loading?
- ✅ Check: Run `npm run build` (not dev mode)
- ✅ Check: Verify files exist in GitHub repo
- ✅ Check: Review build logs for errors

### TypeScript errors?
- ✅ Run: `npm run typecheck`
- ✅ Check: Schema matches data structure
- ✅ Check: Required fields are present

### Data not updating?
- ✅ Clear cache: Delete `.astro/` directory
- ✅ Rebuild: `npm run build`
- ✅ Check: GitHub repo has latest changes

## Next Steps

- 📖 Read [Architecture Documentation](./data-collections-architecture.md)
- 📝 See [Examples](./data-collection-examples.md)
- 🔌 Add [Enrichment Plugins](./data-collections-architecture.md#adding-enrichment-sources)

## File Structure Reference

```
BreadchainCoop/shared-obsidian/
├── wiki/                           # Existing docs
├── data/
│   ├── organizations/
│   │   ├── breadchain.json        # JSON format
│   │   ├── project-2.md           # Markdown format
│   │   └── ...
│   └── contributors/
│       ├── alice.json
│       ├── bob.md
│       └── ...
└── README.md
```

```
bread-docs/
├── src/
│   ├── content.config.ts          # ← Collection definitions
│   ├── loaders/
│   │   ├── organizations-loader.ts
│   │   └── contributors-loader.ts
│   ├── lib/
│   │   ├── data-loader-base.ts    # ← Base loader
│   │   └── enrichment-plugins.ts  # ← Plugin system
│   └── pages/
│       └── your-pages.astro       # ← Query collections here
├── docs/
│   ├── data-collections-architecture.md
│   ├── data-collection-examples.md
│   └── data-collections-quick-start.md (this file)
└── package.json
```

## Support

For detailed documentation, see:
- [Architecture Guide](./data-collections-architecture.md)
- [Examples](./data-collection-examples.md)
- [Astro Content Collections Docs](https://docs.astro.build/en/guides/content-collections/)
