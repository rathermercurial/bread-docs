# Data Collections Architecture

## Overview

This document describes the data collections architecture for Breadchain Docs, including the unified organizations collection, contributors collection, and the extensible enrichment plugin system.

## Architecture Principles

1. **Separation of Concerns**: Data fetching, parsing, transformation, and enrichment are separate, composable phases
2. **Extensibility**: Plugin pattern allows adding enrichment sources without modifying core code
3. **Reusability**: Base loader can be configured for any GitHub directory
4. **Type Safety**: Full TypeScript support with Zod schemas
5. **Future-Proof**: Designed to add enrichment later without rewrites

## Collections

### Organizations Collection

**Unified collection** for entities that can be:
- Member projects
- Angel minters
- Marketplace listings
- Or any combination (e.g., both member project AND angel minter)

Uses boolean flags (`isMemberProject`, `isAngelMinter`, `isMarketplace`) instead of separate collections.

**Location:** `src/content.config.ts` → `organizations`

**Schema:** See `src/content.config.ts:15-59`

**Loader:** `src/loaders/organizations-loader.ts`

#### Querying Organizations

```typescript
import { getCollection } from 'astro:content';

// Get all member projects
const memberProjects = await getCollection('organizations',
  (org) => org.data.isMemberProject
);

// Get all angel minters
const angelMinters = await getCollection('organizations',
  (org) => org.data.isAngelMinter
);

// Get organizations that are BOTH member projects AND angel minters
const both = await getCollection('organizations',
  (org) => org.data.isMemberProject && org.data.isAngelMinter
);

// Get all marketplace listings
const marketplace = await getCollection('organizations',
  (org) => org.data.isMarketplace
);

// Get a specific organization
const breadchain = await getEntry('organizations', 'breadchain');
```

### Contributors Collection

Collection for contributor profiles with support for enrichment from multiple sources:
- Markdown content from source files
- Ethereum addresses & ENS names
- Hats Protocol roles
- GitHub profiles
- Social media accounts

**Location:** `src/content.config.ts` → `contributors`

**Schema:** See `src/content.config.ts:65-109`

**Loader:** `src/loaders/contributors-loader.ts`

#### Querying Contributors

```typescript
import { getCollection, getEntry } from 'astro:content';

// Get all active contributors
const activeContributors = await getCollection('contributors',
  (c) => c.data.isActive
);

// Get contributors with Hats Protocol roles
const hatsMembers = await getCollection('contributors',
  (c) => c.data.hatsRoles.length > 0
);

// Get contributor by ID
const contributor = await getEntry('contributors', 'alice');

// Get contributors for a specific organization
const breadchainContributors = await getCollection('contributors',
  (c) => c.data.organizations.includes('breadchain')
);
```

## Core Components

### 1. Base Data Loader (`src/lib/data-loader-base.ts`)

Reusable loader factory that:
- Fetches files from GitHub directories
- Parses content (JSON, Markdown, YAML)
- Applies enrichment plugins
- Stores in Astro's content layer

**Key function:**
```typescript
createGitHubDataLoader<T>(options: GitHubDataLoaderOptions<T>): Loader
```

**Features:**
- Generic: works with any data type
- Cacheable: leverages Astro's content layer caching
- Extensible: plugin system for enrichment
- Type-safe: full TypeScript support

### 2. Enrichment Plugin System (`src/lib/enrichment-plugins.ts`)

Plugin interface for adding data from external sources:

```typescript
interface EnrichmentPlugin<T extends BaseDataEntry> {
  name: string;
  enabled: boolean;
  enrich(entry: T, context: EnrichmentContext): Promise<T>;
  enrichBatch?(entries: T[], context: EnrichmentContext): Promise<T[]>;
}
```

**Plugins execute in order** and can:
- Modify entry data
- Fetch from external APIs
- Transform or validate fields
- Add computed properties

**Included plugins** (currently disabled):
- `ensEnrichmentPlugin` - Resolve ENS names for Ethereum addresses
- `hatsProtocolPlugin` - Fetch Hats Protocol roles
- `githubProfilePlugin` - Enrich from GitHub API
- `ethereumValidationPlugin` - Validate/normalize addresses
- `metadataPlugin` - Add timestamps, slugs (enabled by default)

### 3. Collection-Specific Loaders

#### Organizations Loader (`src/loaders/organizations-loader.ts`)

```typescript
createOrganizationsLoader({
  owner: 'BreadchainCoop',
  repo: 'shared-obsidian',
  token: process.env.GITHUB_TOKEN,
  path: 'data/organizations',
  enableEnrichment: 'minimal' | 'blockchain' | 'social' | 'full'
})
```

#### Contributors Loader (`src/loaders/contributors-loader.ts`)

```typescript
createContributorsLoader({
  owner: 'BreadchainCoop',
  repo: 'shared-obsidian',
  token: process.env.GITHUB_TOKEN,
  path: 'data/contributors',
  enableEnrichment: 'minimal' | 'blockchain' | 'social' | 'full'
})
```

## File Formats

Both collections support **JSON** and **Markdown** files:

### JSON Format

```json
{
  "id": "breadchain",
  "name": "Breadchain Cooperative",
  "description": "A decentralized cooperative...",
  "isMemberProject": true,
  "isAngelMinter": true,
  "ethereumAddress": "0x...",
  "ensName": "breadchain.eth",
  "tags": ["cooperative", "defi", "dao"]
}
```

### Markdown Format (with frontmatter)

```markdown
---
id: breadchain
name: Breadchain Cooperative
description: A decentralized cooperative...
isMemberProject: true
isAngelMinter: true
ethereumAddress: "0x..."
ensName: breadchain.eth
tags: [cooperative, defi, dao]
---

# Extended Content

This markdown content can be rendered on organization detail pages...

## Features
- Feature 1
- Feature 2
```

## Source Repository Structure

Expected structure in `BreadchainCoop/shared-obsidian`:

```
shared-obsidian/
├── wiki/                    # Existing docs (unchanged)
├── data/
│   ├── organizations/
│   │   ├── breadchain.md
│   │   ├── project-2.json
│   │   └── ...
│   └── contributors/
│       ├── alice.md
│       ├── bob.json
│       └── ...
└── README.md
```

## Adding Enrichment Sources

To add a new enrichment source (e.g., ENS resolution), follow these steps:

### Step 1: Create or Enable a Plugin

**Option A: Enable existing plugin**

Edit `src/lib/enrichment-plugins.ts`:

```typescript
export const ensEnrichmentPlugin: EnrichmentPlugin = {
  name: 'ens-enrichment',
  enabled: true, // ← Change to true
  // ... implementation
};
```

**Option B: Create new plugin**

Add to `src/lib/enrichment-plugins.ts`:

```typescript
export const myCustomPlugin: EnrichmentPlugin = {
  name: 'my-custom-enrichment',
  enabled: true,

  async enrich(entry, context) {
    const { logger, octokit, cache } = context;

    // Your enrichment logic here
    if (entry.someField) {
      const data = await fetchExternalData(entry.someField);
      entry.enrichedData = data;
      logger.info(`Enriched ${entry.id}`);
    }

    return entry;
  },

  // Optional: batch enrichment for efficiency
  async enrichBatch(entries, context) {
    // Fetch data for all entries in one API call
    const results = await batchFetchExternalData(entries);
    // Apply results to entries
    return entries.map((entry, i) => ({
      ...entry,
      enrichedData: results[i],
    }));
  },
};
```

### Step 2: Add Plugin to Preset (Optional)

Edit `src/lib/enrichment-plugins.ts`:

```typescript
export const enrichmentPresets = {
  // ... existing presets

  custom: [
    metadataPlugin,
    myCustomPlugin,
  ],
};
```

### Step 3: Enable in Collection Config

Edit `src/content.config.ts`:

**Option A: Use preset**
```typescript
organizations: defineCollection({
  loader: createOrganizationsLoader({
    // ...
    enableEnrichment: 'blockchain', // ← Enable preset
  }),
  schema: organizationsSchema,
}),
```

**Option B: Add plugin directly**

Edit loader implementation to accept custom plugins:

```typescript
// In organizations-loader.ts
export function createOrganizationsLoader(options: {
  // ... existing options
  customPlugins?: EnrichmentPlugin[];
}) {
  return createGitHubDataLoader<OrganizationEntry>({
    // ... existing config
    enrichmentPlugins: [
      ...enrichmentPresets[enrichmentPreset],
      ...(options.customPlugins || []),
    ],
  });
}
```

### Step 4: Update Schema (if adding new fields)

Edit `src/content.config.ts`:

```typescript
const organizationsSchema = z.object({
  // ... existing fields

  // Add new enriched fields
  enrichedData: z.string().optional(),
});
```

### Step 5: Install Dependencies (if needed)

```bash
npm install ethers  # For ENS
npm install @hatsprotocol/sdk-v1-core  # For Hats Protocol
# etc.
```

## Enrichment Plugin Examples

### ENS Resolution Example

```typescript
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

export const ensEnrichmentPlugin: EnrichmentPlugin = {
  name: 'ens-enrichment',
  enabled: true,

  async enrich(entry, context) {
    if (!entry.ethereumAddress) return entry;

    try {
      const client = createPublicClient({
        chain: mainnet,
        transport: http(),
      });

      const ensName = await client.getEnsName({
        address: entry.ethereumAddress,
      });

      if (ensName) {
        entry.ensName = ensName;
        context.logger.info(`ENS resolved: ${entry.id} → ${ensName}`);
      }
    } catch (error) {
      context.logger.warn(`ENS lookup failed for ${entry.id}: ${error}`);
    }

    return entry;
  },
};
```

### Hats Protocol Example

```typescript
import { HatsClient } from '@hatsprotocol/sdk-v1-core';

export const hatsProtocolPlugin: EnrichmentPlugin = {
  name: 'hats-protocol',
  enabled: true,

  async enrich(entry, context) {
    if (!entry.ethereumAddress) return entry;

    try {
      const hatsClient = new HatsClient({
        // ... config
      });

      const hats = await hatsClient.getWearerHats({
        wearer: entry.ethereumAddress,
      });

      entry.hatsRoles = hats.map((hat) => ({
        hatId: hat.id,
        hatName: hat.details.name,
        organization: hat.tree.id,
        treeId: hat.tree.id,
      }));

      context.logger.info(`Hats roles found: ${entry.id} → ${hats.length} roles`);
    } catch (error) {
      context.logger.warn(`Hats lookup failed for ${entry.id}: ${error}`);
    }

    return entry;
  },
};
```

## Configuration

### Environment Variables

Add to `.env`:

```env
# Existing variables
GITHUB_TOKEN=your_token
GITHUB_REPO_OWNER=BreadchainCoop
GITHUB_REPO_NAME=shared-obsidian

# Data collection paths (optional)
ORGANIZATIONS_PATH=data/organizations
CONTRIBUTORS_PATH=data/contributors
```

### Collection Configuration

Edit `src/content.config.ts` to:
- Change source paths
- Enable/disable enrichment
- Switch enrichment presets
- Add custom plugins

## Build Process

1. **Astro build starts** → Loaders execute
2. **GitHub data fetch** → Files downloaded from configured paths
3. **Parsing** → JSON/Markdown converted to typed objects
4. **Enrichment** → Enabled plugins run (if any)
5. **Storage** → Data stored in Astro's content layer
6. **Caching** → Astro caches for fast rebuilds
7. **Static generation** → Pages generated from collections

## Performance Considerations

### Caching

- Astro's content layer provides automatic caching
- Loaders only run on builds (not on dev)
- Enrichment results are cached between builds

### Batch Processing

- Use `enrichBatch()` for efficient API calls
- Single RPC call for multiple addresses (ENS)
- Rate limit handling for GitHub API

### Selective Enrichment

Start with `minimal` preset, add enrichment as needed:

```typescript
// Fast builds, no external API calls
enableEnrichment: 'minimal'

// Add specific enrichment
enableEnrichment: 'social'  // GitHub profiles only
enableEnrichment: 'blockchain'  // ENS + Hats only

// Everything (slower builds)
enableEnrichment: 'full'
```

## Testing

### Verify Collections

```bash
# Build and check for errors
npm run build

# Check TypeScript types
npm run typecheck
```

### Query in Component

```astro
---
// src/pages/test.astro
import { getCollection } from 'astro:content';

const orgs = await getCollection('organizations');
const contributors = await getCollection('contributors');
---

<pre>
Organizations: {orgs.length}
Contributors: {contributors.length}
</pre>
```

## Migration Guide

### From Separate Directories

If you currently have separate directories for member-projects, angel-minters, marketplace:

1. **Consolidate** into `data/organizations/`
2. **Add boolean flags** to each file:
   ```json
   {
     "isMemberProject": true,
     "isAngelMinter": false,
     "isMarketplace": false
   }
   ```
3. **Update queries** to filter by flags instead of collection name

### Adding New Data

To add a new organization or contributor:

1. Create file in GitHub repo: `data/organizations/myproject.md`
2. Add frontmatter with required fields
3. Commit to GitHub
4. Rebuild site (loaders fetch automatically)

## Troubleshooting

### Loader Not Running

- Check: Loaders only run during builds, not in dev mode
- Fix: Run `npm run build` to trigger loaders

### Missing Data

- Check: Verify file exists in GitHub repo at configured path
- Check: Ensure file has valid JSON/frontmatter
- Check: Check build logs for parsing errors

### Enrichment Not Working

- Check: Verify plugin is `enabled: true`
- Check: Ensure enrichment preset includes the plugin
- Check: Check API keys/tokens for external services
- Check: Review build logs for enrichment errors

### Type Errors

- Run: `npm run typecheck`
- Check: Ensure schema matches data structure
- Fix: Update schema in `content.config.ts`

## Extension Points

The architecture provides these extension points:

1. **Custom Parsers** - Handle new file formats
2. **Enrichment Plugins** - Add new data sources
3. **Enrichment Presets** - Group plugins for common use cases
4. **Custom Loaders** - Create specialized loaders
5. **Schema Extensions** - Add new fields to collections

## Future Enhancements

Possible future additions:

- **Live Collections** - Real-time data updates (Astro 5.10+)
- **Webhook Integration** - Auto-rebuild on GitHub changes
- **Multi-Source Loading** - Combine GitHub + CMS + API data
- **Advanced Caching** - Redis/external cache for enrichment
- **GraphQL Support** - Query collections via GraphQL

## Resources

- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro Content Loader API](https://docs.astro.build/en/reference/content-loader-reference/)
- [ENS Documentation](https://docs.ens.domains/)
- [Hats Protocol Documentation](https://docs.hatsprotocol.xyz/)

## Support

For questions or issues:
- Review this documentation
- Check build logs for errors
- Consult Astro docs for content collections
- Open issue in GitHub repository
