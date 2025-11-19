# Entity Collections Feature - Implementation Guide

**Feature Name:** Entity Collections & Relationships
**Status:** Implemented (Planning Phase Complete)
**Branch:** `claude/plan-entity-collections-017f1KyzKgyPzeb1tV3pWfhu`

## Overview

This document describes the implementation of entity collections for the Breadchain documentation site. Entity collections provide a structured data layer for people, organizations, and marketplace offers, separate from unstructured documentation content.

## Conceptual Model

### Entities vs Documentation

- **Documentation** (`docs` collection): Unstructured wiki content, guides, references
- **Entities** (data collections): Structured profiles and listings with typed schemas
  - **Person**: Contributors, angel minters, community members
  - **Organization**: Member projects, cooperatives, groups
  - **Offer**: Marketplace listings for goods and services

### Schema.org Alignment

The feature uses schema.org vocabulary as a foundation:

```
Thing (base)
├── Person (FOAF)
└── Organization (DOAP)

Offer
├── offeredBy → Person | Organization
└── makesOffer ← Person | Organization
```

This provides:
- **Semantic web alignment** for future extensibility
- **Common vocabulary** across different entity types
- **Flexibility** to adopt additional schema.org properties over time

## File Structure

```
bread-docs/
├── src/
│   ├── content.config.ts          # Collection schemas (MODIFIED)
│   ├── data/                      # Entity data (NEW)
│   │   ├── person/
│   │   │   ├── example-alice-chen.md
│   │   │   └── example-bob-garcia.md
│   │   ├── organization/
│   │   │   ├── breadchain-cooperative.md
│   │   │   └── local-harvest-coop.md
│   │   └── offer/
│   │       ├── web-development-services.md
│   │       ├── cooperative-branding-services.md
│   │       ├── wholesale-organic-produce.md
│   │       └── bread-token-rewards.md
│   └── lib/
│       └── entity-utils.ts        # Helper functions (NEW)
├── templates/
│   └── obsidian/                  # Obsidian templates (NEW)
│       ├── person-template.md
│       ├── organization-template.md
│       └── offer-template.md
└── docs/
    └── entity-collections.md      # This file
```

## Collection Schemas

### Base Entity Schema (Thing)

All entities (person and organization) share these base properties:

```typescript
{
  // Core identity
  name: string;                    // REQUIRED
  description?: string;
  url?: string;                    // Primary website/profile
  image?: string;                  // Profile photo or logo
  identifier?: string;             // Ethereum address or other unique ID
  sameAs?: string[];               // Array of profile URLs (GitHub, Twitter, etc.)

  // Common flags
  isAngelMinter: boolean;          // Default: false
}
```

### Person Collection

**Location:** `src/data/person/*.md`
**Schema:** Extends Thing with person-specific fields

```typescript
{
  // ... Thing properties

  // Person identity
  givenName?: string;
  familyName?: string;
  additionalName?: string;
  jobTitle?: string;

  // Relationships (supports both references and external strings)
  memberOf?: (Organization | string)[];
  worksFor?: (Organization | string)[];

  // Contact
  email?: string;

  // Web3 identity
  ensName?: string;
  ensAvatar?: string;

  // Custom flags
  isContributor: boolean;          // Default: false

  // Marketplace
  makesOffer?: Offer[];
}
```

**Use Cases:**
- Contributors directory (`isContributor: true`)
- Angel minters directory (`isAngelMinter: true`)
- Service providers in marketplace
- Author credits in documentation

### Organization Collection

**Location:** `src/data/organization/*.md`
**Schema:** Extends Thing with organization-specific fields

```typescript
{
  // ... Thing properties

  // Organization identity
  legalName?: string;
  alternateName?: string;
  logo?: string;

  // Relationships
  member?: (Person | string)[];
  parentOrganization?: Organization | string;
  subOrganization?: (Organization | string)[];

  // Contact
  email?: string;

  // Custom flags
  isMemberProject: boolean;        // Default: false

  // Marketplace
  makesOffer?: Offer[];
}
```

**Use Cases:**
- Member projects directory (`isMemberProject: true`)
- Angel minters directory (`isAngelMinter: true`)
- Cooperative network visualization
- Parent/child organization hierarchies

### Offer Collection

**Location:** `src/data/offer/*.md`
**Schema:** Marketplace offers aligned with schema.org/Offer

```typescript
{
  // Core offer info
  name: string;                    // REQUIRED
  description?: string;
  offeredBy: Person | Organization | string;  // REQUIRED
  itemOffered: string;             // REQUIRED - what's being offered

  // Pricing
  price?: string;                  // Flexible format
  priceCurrency: string;           // Default: "USD"
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | ...;

  // Temporal validity
  validFrom?: Date;
  validThrough?: Date;

  // Links
  url?: string;
  image?: string;

  // Categorization
  category?: string[];             // e.g., ["web-services", "cooperative-tech"]
}
```

**Use Cases:**
- Marketplace directory page
- Filter by category
- Show offers by provider
- Display availability status

## Entity Utility Functions

**File:** `src/lib/entity-utils.ts`

### Collection Aggregation

```typescript
// Get all entities (people + organizations) with unified type
const entities = await getAllEntities();
// Returns: Entity[] with discriminator field

// Get filtered subsets
const angelMinters = await getAngelMinters();
const contributors = await getContributors();
const memberProjects = await getMemberProjects();
```

### Reference Resolution

```typescript
// Resolve offer provider
const provider = await resolveOfferProvider(offer);
if (typeof provider !== 'string') {
  console.log(provider.data.name, provider.entityType);
}

// Resolve multiple references
const orgs = await resolveEntityReferences(person.data.memberOf);
```

### Entity Lookup

```typescript
// By Ethereum address
const entity = await getEntityByAddress('0x742d35...');

// By slug
const person = await getEntityBySlug('person', 'alice-chen');
```

### Display Helpers

```typescript
const displayName = getEntityDisplayName(entity);  // "Alice Chen"
const typeLabel = getEntityTypeLabel(entity);      // "Person"
const icon = getEntityIcon(entity);                // "👤"
```

## Example Entities

The implementation includes realistic example entities with cross-references:

### People
- **Alice Chen** - Contributor + Angel Minter, offers web services
- **Bob Garcia** - Contributor, offers design services

### Organizations
- **Breadchain Cooperative** - Member Project + Angel Minter, offers BREAD token
- **Local Harvest Coop** - Member Project, offers wholesale produce

### Offers
- Web Development Services (by Alice)
- Branding Services (by Bob)
- Wholesale Produce (by Local Harvest)
- BREAD Token Rewards (by Breadchain)

These demonstrate:
- ✅ Cross-references between entities
- ✅ Mixed entity types (people + orgs)
- ✅ Entities with multiple flags
- ✅ Offers connected to providers
- ✅ Realistic use cases

## Obsidian Templates

**Location:** `templates/obsidian/*.md`

Templates for creating new entities in Obsidian:

- `person-template.md` - Person entity template
- `organization-template.md` - Organization template
- `offer-template.md` - Marketplace offer template

Each template includes:
- Complete frontmatter structure
- Field descriptions and examples
- Usage notes and guidelines
- Common category tags (for offers)

**To use in Obsidian:**
1. Copy templates to `.obsidian/templates/` in source repository
2. Use Obsidian's template plugin to insert
3. Fill in fields and save to appropriate data directory

## Usage Patterns

### Display Mixed Entity Directory (Angel Minters)

```astro
---
// src/pages/angel-minters.astro
import { getAngelMinters } from '@/lib/entity-utils';
import EntityCard from '@/components/EntityCard.astro';

const angelMinters = await getAngelMinters();
---

<h1>Angel Minters</h1>
<div class="entity-grid">
  {angelMinters.map(entity => (
    <EntityCard entity={entity} />
  ))}
</div>
```

### Entity Profile Page

```astro
---
// src/pages/[collection]/[...slug].astro
import { resolveEntityReferences } from '@/lib/entity-utils';

const { entry, entityType } = Astro.props;
const { Content } = await entry.render();

const orgs = entityType === 'person'
  ? await resolveEntityReferences(entry.data.memberOf || [])
  : [];
---

<h1>{entry.data.name}</h1>
<Content />

{orgs.length > 0 && (
  <section>
    <h2>Member Of</h2>
    <ul>
      {orgs.map(org => (
        <li>
          {typeof org === 'string'
            ? org
            : <a href={`/organization/${org.slug}`}>{org.data.name}</a>
          }
        </li>
      ))}
    </ul>
  </section>
)}
```

### Marketplace Directory

```astro
---
import { getOffers } from '@/lib/entity-utils';

const webServices = await getOffers('web-services');
const food = await getOffers('food');
const all = await getOffers();
---

<h1>Marketplace</h1>

<section>
  <h2>Web Services</h2>
  {webServices.map(offer => <OfferCard offer={offer} />)}
</section>

<section>
  <h2>Food & Agriculture</h2>
  {food.map(offer => <OfferCard offer={offer} />)}
</section>
```

## Integration with Existing Features

### Wikilinks

Entity collections integrate with existing wikilink support:

```markdown
<!-- In documentation -->
Learn about [[Alice Chen]] and [[Breadchain Cooperative]].

Check out [[Web Development Services]] in the marketplace.
```

Wikilinks automatically resolve to entity pages across collections.

### GitHub Wiki Sync

**Future Enhancement:** Extend `github-wiki-sync.ts` to support multi-collection syncing:

```typescript
const syncMappings = [
  { sourcePath: 'wiki', targetPath: 'src/content/docs' },
  { sourcePath: 'data/person', targetPath: 'src/data/person' },
  { sourcePath: 'data/organization', targetPath: 'src/data/organization' },
  { sourcePath: 'data/offer', targetPath: 'src/data/offer' },
];
```

## Next Steps

### Phase 1: Testing & Validation
- [ ] Test entity collection loading
- [ ] Verify schema validation
- [ ] Test cross-references
- [ ] Validate example data

### Phase 2: Display Layer
- [ ] Create entity page template (`src/pages/[collection]/[...slug].astro`)
- [ ] Build directory pages:
  - [ ] `/angel-minters` - Mixed people + orgs
  - [ ] `/contributors` - People only
  - [ ] `/member-projects` - Organizations only
  - [ ] `/marketplace` - Offers
- [ ] Create reusable components:
  - [ ] `EntityCard.astro`
  - [ ] `OfferCard.astro`
  - [ ] `EntityList.astro`

### Phase 3: GitHub Sync Enhancement
- [ ] Modify `github-wiki-sync.ts` for multi-collection support
- [ ] Add collection mapping configuration
- [ ] Test sync from source repository
- [ ] Verify wikilink resolution across collections

### Phase 4: Documentation & Polish
- [ ] Update README with entity collections info
- [ ] Create content authoring guide
- [ ] Add search integration (if needed)
- [ ] Performance testing

## Design Decisions

### Why Separate Collections vs Single Entity Collection?

**Decision:** Three collections (person, organization, offer)

**Rationale:**
- ✅ Clear type distinction
- ✅ Specific schemas for each type
- ✅ Simple queries (`getCollection('person')`)
- ✅ Astro-native patterns
- ❌ Requires utility functions for polymorphic queries

**Alternative Considered:** Single `entity` collection with discriminated union
- ❌ More complex schema
- ❌ Schema duplication (Thing properties repeated)
- ✅ Simpler polymorphic queries

### Why Base Schema with `.extend()`?

**Decision:** Shared `entityBaseSchema` extended by person/organization

**Rationale:**
- ✅ DRY principle (Thing properties defined once)
- ✅ Easy to add common properties
- ✅ Clear schema.org alignment
- ✅ Type safety maintained

### Why Support Both References AND Strings?

**Decision:** `memberOf: (Organization | string)[]`

**Rationale:**
- ✅ Supports both internal entities AND external organizations
- ✅ Flexible for initial data entry
- ✅ Doesn't require all entities to exist in collections
- ✅ Graceful handling of missing references

Example:
```yaml
memberOf:
  - breadchain-cooperative    # Internal reference
  - "External Cooperative"    # External string
```

### Why `src/data/` Instead of `src/content/`?

**Decision:** Entity data in `src/data/`, docs in `src/content/docs/`

**Rationale:**
- ✅ Conceptual separation (structured data vs unstructured docs)
- ✅ Aligns with Astro 5 glob loader patterns
- ✅ Matches Obsidian source structure preference
- ✅ Clear organization

## Common Properties Reference

### Thing (Base)
- `name`, `description`, `url`, `image`, `identifier`, `sameAs`

### Person
- Thing + `givenName`, `familyName`, `jobTitle`, `memberOf`, `email`, `ensName`

### Organization
- Thing + `legalName`, `logo`, `member`, `parentOrganization`, `email`

### Offer
- `name`, `description`, `offeredBy`, `itemOffered`, `price`, `availability`, `category`

## Useful Flags

| Flag | Type | Use Case |
|------|------|----------|
| `isAngelMinter` | Person, Org | Filter for angel minters directory |
| `isContributor` | Person | Filter for contributors directory |
| `isMemberProject` | Org | Filter for member projects directory |

## Resources

- [Schema.org Thing](https://schema.org/Thing)
- [Schema.org Person](https://schema.org/Person)
- [Schema.org Organization](https://schema.org/Organization)
- [Schema.org Offer](https://schema.org/Offer)
- [FOAF Vocabulary](https://en.wikipedia.org/wiki/FOAF)
- [DOAP Vocabulary](https://en.wikipedia.org/wiki/DOAP)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro Loaders](https://docs.astro.build/en/reference/loader-reference/)
