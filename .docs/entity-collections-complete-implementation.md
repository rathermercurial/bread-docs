# Entity Collections - Complete Implementation Documentation

**Branch**: `claude/plan-entity-collections-017f1KyzKgyPzeb1tV3pWfhu`
**Date**: November 16, 2025
**Status**: Complete

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Schema Design](#schema-design)
4. [File Structure](#file-structure)
5. [Components](#components)
6. [Pages](#pages)
7. [Implementation Details](#implementation-details)
8. [Integration Points](#integration-points)
9. [Execution Timeline](#execution-timeline)
10. [Testing & Validation](#testing--validation)

---

## Overview

This implementation converts Breadchain entity data (people, organizations, marketplace offers) from static wiki pages to structured Astro content collections. The system provides:

- **Type-safe data management** with Zod schema validation
- **Dynamic page generation** for entities and index pages
- **Bidirectional relationships** between entities and offers
- **Starlight theme integration** with proper dark/light mode support
- **Wiki content integration** for index pages

### Key Features

- ✅ Schema.org-aligned entity schemas (Person, Organization, Offer)
- ✅ Markdown-sourced data with frontmatter validation
- ✅ Dynamic routing for entity detail pages
- ✅ Index pages with card grid displays
- ✅ Wiki content slotting for contextual information
- ✅ Full dark/light mode support
- ✅ Single-column, accessible layouts

---

## Architecture

### Data Flow

```
Markdown Files (src/data/)
    ↓
Astro Content Collections (glob loader)
    ↓
Zod Schema Validation
    ↓
Type-safe Collection Entries
    ↓
Dynamic Page Generation
    ↓
Rendered HTML with Starlight Theme
```

### Collection Types

1. **Person** - Individual contributors, angel minters
2. **Organization** - Cooperatives, member projects
3. **Offer** - Marketplace goods and services

### Relationships

```
Person ←→ Organization (memberOf, worksFor, member)
Person/Organization → Offer (makesOffer, offeredBy)
Organization ← Organization (parentOrganization)
```

---

## Schema Design

### Base Entity Schema

**File**: `src/content.config.ts`

All entities share a common base schema:

```typescript
const entity = z.object({
  // Core identity
  name: z.string().describe('Entity name'),
  description: z.string().optional().describe('Entity description'),
  url: z.string().url().optional().describe('Primary URL'),
  image: z.string().optional().describe('Profile image or logo'),
  identifier: z.string().optional().describe('Ethereum address or unique ID'),
  sameAs: z.array(z.string().url()).optional().default([]),

  // Contact
  email: z.string().email().optional().describe('Contact email'),

  // Web3 identity
  ensName: z.string().optional().describe('ENS name'),

  // Filtering flags
  isAngelMinter: z.boolean().default(false).describe('Angel Minter status'),
});
```

**Design Principles**:
- Minimalist approach - only properties actively used in the UI
- Schema.org vocabulary alignment for extensibility
- Support for both internal references and external strings
- Web3-aware (ENS names, Ethereum addresses)

### Person Schema

Extends base entity with:

```typescript
{
  jobTitle: z.string().optional(),
  memberOf: z.array(z.union([reference('organization'), z.string()])),
  worksFor: z.array(z.union([reference('organization'), z.string()])),
  isContributor: z.boolean().default(false),
  makesOffer: z.array(reference('offer')),
}
```

**Key Properties**:
- `jobTitle`: Displayed on cards as subtitle
- `memberOf/worksFor`: Bidirectional org relationships
- `isContributor`: Filter flag for contributors page
- `makesOffer`: Links to marketplace offerings

### Organization Schema

Extends base entity with:

```typescript
{
  member: z.array(z.union([reference('person'), z.string()])),
  parentOrganization: z.union([reference('organization'), z.string()]),
  isMemberProject: z.boolean().default(false),
  makesOffer: z.array(reference('offer')),
}
```

**Key Properties**:
- `member`: Organization members (inverse of memberOf)
- `parentOrganization`: For hierarchical structures
- `isMemberProject`: Filter flag for member-projects page

### Offer Schema

Standalone schema (does not extend entity):

```typescript
{
  name: z.string(),
  description: z.string().optional(),
  offeredBy: z.union([reference('person'), reference('organization'), z.string()]),
  itemOffered: z.string(),
  url: z.string().url().optional(),
  image: z.string().optional(),
}
```

**Key Properties**:
- `offeredBy`: Links back to person/organization (bidirectional with makesOffer)
- `itemOffered`: Short summary of what's offered
- Removed: price, availability, category (per user requirements)

### Removed Properties

Properties removed during implementation for simplicity:

**Person**:
- `givenName`, `familyName` (use single `name` field)
- `ensAvatar` (redundant with `image`)

**Organization**:
- `legalName`, `alternateName` (use single `name` field)
- `logo` (duplicate of `image`)
- `subOrganization` (inverse not needed)

**Offer**:
- `price`, `priceCurrency`, `availability` (moved to markdown content)
- `validFrom`, `validThrough` (temporal validity not needed)
- `category` (removed per user request)

---

## File Structure

### Data Collections

```
src/data/
├── person/
│   ├── example-alice-chen.md
│   └── example-bob-garcia.md
├── organization/
│   ├── breadchain-cooperative.md
│   └── local-harvest-coop.md
└── offer/
    ├── bread-token-rewards.md
    ├── cooperative-branding-services.md
    ├── web-development-services.md
    └── wholesale-organic-produce.md
```

### Components

```
src/components/entities/
├── EntityCard.astro      # Person/Organization cards
└── OfferCard.astro       # Marketplace offer cards
```

### Pages

```
src/pages/
├── [collection]/
│   └── [...slug].astro   # Dynamic entity detail pages
├── offer/
│   └── [slug].astro      # Offer detail pages
├── marketplace.astro      # Marketplace index
├── angel-minters.astro    # Angel minters index
├── member-projects.astro  # Member projects index
└── contributors.astro     # Contributors index
```

### Utilities

```
src/lib/
└── entity-utils.ts       # Collection queries, filtering, relationships
```

---

## Components

### EntityCard.astro

**Location**: `src/components/entities/EntityCard.astro`

**Purpose**: Display person or organization in card format

**Props**:
```typescript
interface Props {
  entity: Entity; // Person or Organization with entityType discriminator
}
```

**Features**:
- Avatar or placeholder icon (👤 for person, 🏢 for organization)
- Entity name (primary heading)
- Job title for people (subtitle)
- Description (truncated to 2 lines)
- Dark/light mode responsive
- Removed: Type badges, Angel Minter badges, etc.

**Styling**:
- Background: `--sl-color-bg-nav`
- Border: `--sl-color-gray-5`
- Hover: Lift effect with accent border
- Text colors: gray-2 (light), gray-4 (dark)

### OfferCard.astro

**Location**: `src/components/entities/OfferCard.astro`

**Purpose**: Display marketplace offer in card format

**Props**:
```typescript
interface Props {
  offer: CollectionEntry<'offer'>;
}
```

**Features**:
- Offer image (180px height, object-fit: cover)
- Offer name (primary heading)
- Provider attribution ("by [provider]")
- Description (truncated to 3 lines)
- Uniform sizing across all cards

**Removed**:
- Price display
- Availability badges
- Category tags

---

## Pages

### Dynamic Entity Pages

**Location**: `src/pages/[collection]/[...slug].astro`

**Purpose**: Detail pages for individual people and organizations

**Features**:
- Single-column layout (max-width: 800px)
- Starlight sidebar navigation (restored)
- Profile image header
- Markdown content rendering
- Relationship sections (memberOf, worksFor, members, offers)
- Contact & links section
- Web3 identity section (ENS, address)

**Layout**:
- Header: Centered image
- Content: Markdown from data file
- Relationships: Collapsible sections with links
- Contact: Email, website, social links
- Web3: ENS name, Ethereum address

**Important**:
- NO `hasSidebar={false}` - left navigation must be present
- NO H1 in markdown - Starlight displays title

### Offer Detail Pages

**Location**: `src/pages/offer/[slug].astro`

**Purpose**: Detail pages for marketplace offerings

**Features**:
- Single-column layout (max-width: 800px)
- Offer image header
- "What's Offered" section with itemOffered
- Markdown content rendering
- Provider section with link to entity
- Call-to-action button

**Removed**:
- Price/availability metadata
- Category tags
- Two-column sidebar layout

### Index Pages

All index pages follow the same pattern:

**marketplace.astro** - All offers
**angel-minters.astro** - Entities with `isAngelMinter: true`
**member-projects.astro** - Organizations with `isMemberProject: true`
**contributors.astro** - People with `isContributor: true`

**Structure**:
```astro
// 1. Load and sort entities
const entities = await getFilteredEntities();

// 2. Try to load wiki content
let pageContent = null;
try {
  const docEntry = await getEntry('docs', 'path/to/index');
  if (docEntry) {
    const { Content } = await render(docEntry);
    pageContent = Content;
  }
} catch (e) {}

// 3. Render
<StarlightPage>
  {pageContent && <div class="page-content"><pageContent /></div>}
  <div class="card-grid">
    {entities.map(e => <Card />)}
  </div>
</StarlightPage>
```

**Wiki Content Paths**:
- Marketplace: `docs/about/bread-token/marketplace`
- Angel Minters: `docs/solidarity-primitives/crowdstaking/angel-minters`
- Member Projects: `docs/solidarity-primitives/crowdstaking/member-projects`

**Important**:
- Wiki markdown must NOT contain H1 headings
- Content displays ABOVE card grids
- Gracefully handles missing wiki files

---

## Implementation Details

### Content Loading

**Collection Definition** (`src/content.config.ts`):

```typescript
const person = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/person' }),
  schema: entity.extend({ /* person-specific */ }),
});
```

**Glob Pattern**: Loads all `.md` files from data directory
**Validation**: Zod schema runs on build
**Type Generation**: Automatic TypeScript types

### Dynamic Routing

**Entity Pages** - Uses `getStaticPaths()`:

```typescript
export async function getStaticPaths() {
  const people = await getCollection('person');
  const orgs = await getCollection('organization');

  return [
    ...people.map(p => ({
      params: { collection: 'person', slug: p.id },
      props: { entry: p, entityType: 'person' },
    })),
    ...orgs.map(o => ({
      params: { collection: 'organization', slug: o.id },
      props: { entry: o, entityType: 'organization' },
    })),
  ];
}
```

**Routes Generated**:
- `/person/example-alice-chen`
- `/organization/breadchain-cooperative`
- `/offer/web-development-services`

### Relationship Resolution

**Utility** (`src/lib/entity-utils.ts`):

```typescript
export async function resolveEntityReferences(
  refs: unknown[]
): Promise<(Entity | string)[]> {
  const resolved = await Promise.all(
    refs.map(ref => resolveEntityReference(ref))
  );
  return resolved.filter((r): r is Entity | string => r !== null);
}
```

**Handles**:
- Internal references: `{ collection: 'organization', id: 'breadchain-cooperative' }`
- External strings: `"External Organization Name"`
- Mixed arrays of both

### Markdown Rendering

**Pattern**:

```typescript
const { Content, headings } = await render(entry);

// In template:
<Content />
```

**Features**:
- Automatic TOC generation from headings
- Starlight components available
- Remark/rehype plugin processing

### Dark/Light Mode

**CSS Variables**:
- Text: `--sl-color-text`, `--sl-color-text-accent`
- Backgrounds: `--sl-color-bg-nav`, `--sl-color-bg-sidebar`
- Grays: `--sl-color-gray-2` (light), `--sl-color-gray-4` (dark)

**Pattern**:

```css
.element {
  color: var(--sl-color-gray-2);
}

:global([data-theme='dark']) .element {
  color: var(--sl-color-gray-4);
}
```

---

## Integration Points

### Astro Content Collections

**Config**: `src/content.config.ts`
**Loader**: `glob()` from `astro/loaders`
**Validation**: Zod schemas
**References**: `reference()` helper for relationships

### Starlight Theme

**Component**: `StarlightPage` wrapper
**Props**: `frontmatter`, `headings`
**Sidebar**: Default left sidebar (NO `hasSidebar={false}`)
**Styling**: Starlight CSS variables

### GitHub Wiki Sync

**Integration**: `githubWikiSync` from `src/integrations/github-wiki-sync.ts`
**Source**: Remote Obsidian vault (shared-obsidian repo)
**Destination**: `src/content/docs`
**Sync**: Pre-build hook

**Expected Wiki Files**:
- `wiki/about/bread-token/marketplace.md`
- `wiki/solidarity-primitives/crowdstaking/angel-minters.md`
- `wiki/solidarity-primitives/crowdstaking/member-projects.md`

**Requirements**:
- NO H1 headings in wiki markdown
- Content provides context for index pages
- Files synced on build

---

## Execution Timeline

### Phase 1: Initial Setup
- ✅ Created content collection schemas
- ✅ Set up glob loaders for markdown files
- ✅ Created example data files
- ✅ Implemented entity utility functions

### Phase 2: Component Development
- ✅ Built EntityCard component
- ✅ Built OfferCard component
- ✅ Implemented dark/light mode styling
- ✅ Removed badges and unnecessary UI elements

### Phase 3: Page Implementation
- ✅ Created dynamic entity detail pages
- ✅ Created offer detail pages
- ✅ Built index pages (marketplace, angel-minters, member-projects, contributors)
- ✅ Integrated wiki content loading

### Phase 4: Schema Refinement
- ✅ Renamed `entityBaseSchema` to `entity`
- ✅ Moved `email` and `ensName` to base schema
- ✅ Removed unused properties (givenName, familyName, legalName, etc.)
- ✅ Simplified offer schema (removed pricing, availability, category)

### Phase 5: UI Polish
- ✅ Fixed dark mode text readability (gray-2 → gray-4)
- ✅ Removed all badges from cards and detail pages
- ✅ Converted detail pages to single-column layout
- ✅ Restored left sidebar navigation
- ✅ Removed duplicate H1 titles from data files

### Phase 6: Documentation
- ✅ Created Obsidian vault update instructions
- ✅ Documented complete implementation
- ✅ Prepared execution prompt for shared-obsidian repo

---

## Testing & Validation

### Schema Validation

**Test**: Run `npm run build`
**Expected**: No Zod validation errors
**Validates**: All data files match schemas

### Page Generation

**Test**: Check build output
**Expected**: All entity pages generated
**Routes**:
- `/person/*` - All person entities
- `/organization/*` - All organization entities
- `/offer/*` - All offers
- `/marketplace`, `/angel-minters`, `/member-projects`, `/contributors`

### Dark/Light Mode

**Test**: Toggle theme in browser
**Expected**: All text readable in both modes
**Check**:
- Card body text (should be gray-4 in dark mode)
- Section headings
- Links and accents

### Relationships

**Test**: Click relationship links
**Expected**: Navigate to correct entity pages
**Check**:
- memberOf links → organization pages
- worksFor links → organization pages
- member links → person pages
- offers links → offer pages

### Wiki Integration

**Test**: Build with wiki content synced
**Expected**: Index pages show wiki content above cards
**Fallback**: Gracefully handle missing wiki files

---

## Next Steps

### Immediate (Required for Production)

1. **Update Obsidian Vault** (shared-obsidian repo):
   - Remove H1 titles from marketplace.md, angel-minters.md, member-projects.md
   - Create files if they don't exist
   - Use templates from `temp/obsidian-vault-updates.md`

2. **Verify Build**:
   - Run full build with wiki sync
   - Test all generated pages
   - Validate dark/light mode

### Future Enhancements (Optional)

1. **Add Filtering**: Filter marketplace by type, location, etc.
2. **Add Search**: Full-text search across entities
3. **Add Pagination**: For large entity lists
4. **Add RSS**: Generate RSS feeds for marketplace updates
5. **Add Analytics**: Track popular offerings and entities

---

## File Reference

### Core Files

| File | Purpose |
|------|---------|
| `src/content.config.ts` | Schema definitions, collection setup |
| `src/lib/entity-utils.ts` | Utility functions for queries and relationships |
| `src/components/entities/EntityCard.astro` | Person/organization card component |
| `src/components/entities/OfferCard.astro` | Marketplace offer card component |
| `src/pages/[collection]/[...slug].astro` | Dynamic entity detail pages |
| `src/pages/offer/[slug].astro` | Offer detail pages |
| `src/pages/marketplace.astro` | Marketplace index |
| `src/pages/angel-minters.astro` | Angel minters index |
| `src/pages/member-projects.astro` | Member projects index |
| `src/pages/contributors.astro` | Contributors index |

### Data Files

| Directory | Contents |
|-----------|----------|
| `src/data/person/` | Person entity markdown files |
| `src/data/organization/` | Organization entity markdown files |
| `src/data/offer/` | Marketplace offer markdown files |

### Documentation

| File | Purpose |
|------|---------|
| `docs/entity-collections-complete-implementation.md` | This document |
| `temp/obsidian-vault-updates.md` | Instructions for wiki updates |
| `temp/claude-code-prompt.md` | Execution prompt for shared-obsidian |

---

## Commit History

1. `8b59e9f` - Simplify entity schemas per content collection best practices
2. `67e069d` - Fix marketplace cards: remove price and availability badges
3. `f971bfb` - Polish entity collections: improve dark mode, remove badges, clean schemas
4. `6404685` - Comprehensive dark/light mode readability improvements
5. `614cd02` - Restore left sidebar and remove duplicate page titles

---

## Success Criteria

- ✅ All entity data validated by Zod schemas
- ✅ Dynamic pages generated for all entities
- ✅ Cards display uniformly with correct styling
- ✅ Dark/light mode text is readable
- ✅ Relationships resolve correctly
- ✅ Wiki content loads on index pages
- ✅ No duplicate page titles
- ✅ Left sidebar navigation present
- ✅ Single-column accessible layouts
- ✅ No badges or unnecessary UI clutter

**Status**: Implementation complete. Ready for wiki updates and production deployment.

---

## Update: Semantic Routing Implementation (2024-11-18)

The entity collections system has been enhanced with semantic routing to provide user-friendly URLs. See [Semantic Routing Implementation](./semantic-routing-implementation.md) for complete details.

### Key Changes

**Semantic URLs Added**:
- Member projects now accessible at `/solidarity-primitives/crowdstaking/member-projects/{slug}`
- Angel minters at `/solidarity-primitives/crowdstaking/angel-minters/{slug}`
- Marketplace offers at `/about/bread-token/marketplace/{slug}`

**Data Routes Enhanced**:
- Added `/data/` index pages for browsing all collections
- Collections accessible at `/data/person`, `/data/organization`, `/data/offer`

**Implementation Method**:
- Uses Astro rewrites to serve `/data/` content at semantic URLs
- Single source of truth maintained in `/data/` routes
- No code duplication

See the [Semantic Routing Implementation documentation](./semantic-routing-implementation.md) for architecture details, implementation guide, and usage examples.

