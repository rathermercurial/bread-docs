# Semantic Routing Implementation

**Date**: 2024-11-18
**Branch**: `claude/plan-entity-collections-017f1KyzKgyPzeb1tV3pWfhu`

## Overview

This implementation establishes semantic URL routing for entity collections, allowing entities to be displayed at user-friendly, contextual URLs while maintaining a single source of data.

## Architecture

### Core Concept: Astro Rewrites

Instead of duplicating page logic, we use Astro's **rewrite** feature to serve content from `/data/` routes at semantic wiki paths. This ensures:
- Single source of truth for rendering logic
- Content appears at multiple contextual URLs
- No code duplication

### URL Structure

**Data Routes** (canonical source):
```
/data/person/{slug}           # Person detail pages
/data/organization/{slug}     # Organization detail pages
/data/offer/{slug}            # Marketplace offer detail pages
```

**Semantic Routes** (public-facing):
```
/solidarity-primitives/crowdstaking/member-projects/{slug}
/solidarity-primitives/crowdstaking/angel-minters/{slug}
/about/bread-token/marketplace/{slug}
```

**Data Index Pages**:
```
/data                         # Collection overview
/data/person                  # All people
/data/organization            # All organizations
/data/offer                   # All marketplace offers
```

## Implementation Details

### 1. Semantic Dynamic Routes

Created three semantic route files that use `Astro.rewrite()`:

**File**: `src/pages/solidarity-primitives/crowdstaking/member-projects/[slug].astro`
```typescript
import { getMemberProjects } from '@/lib/entity-utils';

export async function getStaticPaths() {
  const memberProjects = await getMemberProjects();
  return memberProjects.map((org) => ({
    params: { slug: org.id },
  }));
}

const { slug } = Astro.params;

// Rewrite to the data route while keeping the semantic URL
return Astro.rewrite(`/data/organization/${slug}`);
```

**File**: `src/pages/solidarity-primitives/crowdstaking/angel-minters/[slug].astro`
```typescript
import { getAngelMinters } from '@/lib/entity-utils';

export async function getStaticPaths() {
  const angelMinters = await getAngelMinters();
  return angelMinters.map((entity) => ({
    params: { slug: entity.id },
    props: { collection: entity.collection },
  }));
}

const { slug } = Astro.params;
const { collection } = Astro.props;

// Rewrite to the appropriate data route (person or organization)
return Astro.rewrite(`/data/${collection}/${slug}`);
```

**File**: `src/pages/about/bread-token/marketplace/[slug].astro`
```typescript
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const offers = await getCollection('offer');
  return offers.map((offer) => ({
    params: { slug: offer.id },
  }));
}

const { slug } = Astro.params;

// Rewrite to the data route while keeping the semantic URL
return Astro.rewrite(`/data/offer/${slug}`);
```

### 2. URL Helper Functions

Added to `src/lib/entity-utils.ts`:

```typescript
export type EntityContext = 'member-project' | 'angel-minter';

/**
 * Get semantic URL path for an entity based on its context
 */
export function getEntitySemanticPath(entity: Entity, context: EntityContext): string {
  if (context === 'member-project') {
    return `/solidarity-primitives/crowdstaking/member-projects/${entity.id}`;
  } else {
    return `/solidarity-primitives/crowdstaking/angel-minters/${entity.id}`;
  }
}

/**
 * Get semantic URL path for a marketplace offer
 */
export function getOfferSemanticPath(offer: CollectionEntry<'offer'>): string {
  return `/about/bread-token/marketplace/${offer.id}`;
}
```

### 3. Card Component Updates

**EntityCard** now requires a `context` prop:

```astro
interface Props {
  entity: Entity;
  context: EntityContext;  // 'member-project' | 'angel-minter'
}

const { entity, context } = Astro.props;
const link = getEntitySemanticPath(entity, context);
```

**OfferCard** uses semantic path:

```astro
const link = getOfferSemanticPath(offer);
```

### 4. Collection Index Pages

Updated to pass context to EntityCard:

```astro
<!-- Angel Minters Index -->
{sortedMinters.map((entity) => (
  <EntityCard entity={entity} context="angel-minter" />
))}

<!-- Member Projects Index -->
{sortedProjects.map((project) => (
  <EntityCard entity={{...project, entityType: 'organization'}} context="member-project" />
))}
```

### 5. Markdown Content Slotting

Index pages now properly load and render markdown content from the docs collection:

```typescript
// Try both path variations to find the correct docs entry
let docEntry = await getEntry('docs', 'solidarity-primitives/crowdstaking/member-projects/index');
if (!docEntry) {
  docEntry = await getEntry('docs', 'solidarity-primitives/crowdstaking/member-projects');
}
const { Content: PageContent } = docEntry ? await render(docEntry) : { Content: null };
```

The PageContent component is rendered above the entity grid.

### 6. Data Index Pages

Created browsable index pages for the `/data/` routes:

**Main Index** (`/data/index.astro`):
- Overview of all collections with counts
- Cards linking to each collection type

**Collection Indices**:
- `/data/person/index.astro` - Lists all people
- `/data/organization/index.astro` - Lists all organizations (with badges for Member Project/Angel Minter)
- `/data/offer/index.astro` - Lists all marketplace offers

## Styling Improvements

### Text Contrast
Fixed low-contrast text colors to ensure WCAG AA compliance in both light and dark modes:

**Before**: `color: var(--sl-color-gray-3)` (low contrast in both modes)
**After**: `color: var(--sl-color-text)` (proper contrast)

**Files updated**:
- `src/pages/data/offer/[slug].astro`
- `src/pages/data/[collection]/[...slug].astro`

### Card Alignment
Added `align-items: start` to grid containers to ensure consistent card alignment:

```css
.entity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  align-items: start;  /* Ensures all cards align to top */
}
```

## Cleanup Performed

### Removed Development Crutches

**Hardcoded Lists Removed** from `src/lib/entity-utils.ts`:
- Removed `angelMinterOrgSlugs` array
- Removed `memberProjectOrgSlugs` array
- Functions now rely solely on `isAngelMinter` and `isMemberProject` flags in source data

**Obsolete Comments Removed** from `src/content.config.ts`:
- Removed references to hardcoded lists

### Schema Improvements

Added fallback names in transform functions to prevent undefined:

```typescript
.transform((data) => {
  if (!data.name && data.title) {
    data.name = data.title;
  }
  if (!data.name) {
    data.name = 'Unnamed Organization';  // Safety fallback
  }
  return data;
})
```

## Testing & Verification

### Build Results
- **82 pages** built successfully
- All routes generate correctly:
  - 9 angel minter pages
  - 6 member project pages
  - 5 marketplace offer pages
  - 4 data index pages
  - ~58 other documentation pages

### Route Verification

**Semantic routes working**:
```
/solidarity-primitives/crowdstaking/angel-minters/1hive ✓
/solidarity-primitives/crowdstaking/member-projects/citizen-wallet ✓
/about/bread-token/marketplace/cca-events ✓
```

**Data routes working**:
```
/data ✓
/data/person ✓
/data/organization ✓
/data/offer ✓
/data/organization/citizen-wallet ✓
```

### Content Verification

✅ Markdown content renders in index pages
✅ Cards link to semantic URLs (not /data URLs)
✅ Entity detail pages accessible at both semantic and data URLs
✅ Text has proper contrast in both light and dark modes
✅ Cards align consistently in grids

## How It Works for Developers

### Adding a New Semantic Route

1. Create a new dynamic route file in the appropriate location
2. Use `getStaticPaths()` to generate routes for relevant entities
3. Use `return Astro.rewrite('/data/...')` to serve content from data routes
4. Update card components to use the new semantic path

### Adding a New Entity

1. Add markdown file to `shared-obsidian/data/{collection}/`
2. Set appropriate flags (`isAngelMinter`, `isMemberProject`, etc.)
3. Content automatically appears in relevant indices
4. Semantic routes auto-generate on next build

### Updating Index Page Content

1. Edit the index.md file in `src/content/docs/{path}/`
2. Content automatically renders above the entity grid
3. No code changes needed

## Files Modified

### New Files
```
src/pages/solidarity-primitives/crowdstaking/member-projects/[slug].astro
src/pages/solidarity-primitives/crowdstaking/angel-minters/[slug].astro
src/pages/about/bread-token/marketplace/[slug].astro
src/pages/data/index.astro
src/pages/data/person/index.astro
src/pages/data/organization/index.astro
src/pages/data/offer/index.astro
```

### Modified Files
```
src/lib/entity-utils.ts
  - Added getEntitySemanticPath()
  - Added getOfferSemanticPath()
  - Removed hardcoded slug lists

src/components/entities/EntityCard.astro
  - Added context prop
  - Uses semantic path helper

src/components/entities/OfferCard.astro
  - Uses semantic path helper

src/pages/solidarity-primitives/crowdstaking/member-projects.astro
  - Fixed markdown content rendering
  - Added align-items to grid
  - Passes context to EntityCard

src/pages/solidarity-primitives/crowdstaking/angel-minters.astro
  - Fixed markdown content rendering
  - Added align-items to grid
  - Passes context to EntityCard

src/pages/about/bread-token/marketplace.astro
  - Fixed markdown content rendering
  - Added align-items to grid

src/pages/data/offer/[slug].astro
  - Fixed text contrast

src/pages/data/[collection]/[...slug].astro
  - Fixed text contrast

src/content.config.ts
  - Removed obsolete comments
  - Added fallback names in transforms
```

## Benefits

1. **SEO-Friendly URLs**: Entities appear at semantic, meaningful paths
2. **No Code Duplication**: Single source of truth for rendering logic
3. **Flexible Display**: Same entity can appear in multiple contexts
4. **Maintainable**: Changes to data routes automatically apply to all semantic routes
5. **Accessible Data**: /data routes provide direct access for debugging/browsing
6. **Improved UX**: Better contrast and alignment for readability

## Future Enhancements

Potential improvements for future iterations:

1. **Breadcrumbs**: Show navigation path for semantic routes
2. **Canonical URLs**: Add canonical meta tags to prevent SEO duplication
3. **Auto-detection**: Automatically detect context based on flags
4. **Related Entities**: Show related entities in detail pages
5. **Search Integration**: Include semantic paths in search results

## References

- [Astro Rewrites Documentation](https://docs.astro.build/en/guides/routing/#rewrites)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Entity Collections Implementation](./.docs/entity-collections-complete-implementation.md)
