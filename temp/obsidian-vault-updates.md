# Obsidian Vault Updates - Entity Data Migration

## Context

The bread-docs site loads entity data from Astro content collections. We need to copy the individual entity markdown files from the wiki directory structure into a `data/` folder that will be synced to the bread-docs repo.

## Critical Requirements

- ✅ **COPY files, DO NOT MOVE** - Source files must remain in their current wiki locations
- ✅ Create new `data/` folder at root level (OUTSIDE wiki folder)
- ✅ Organize copied files by entity type (person, organization, offer)
- ✅ Clean up index pages to remove duplicate H1 titles

## Directory Structure

### Source Locations (in wiki/)

Entity markdown files are currently located in:

1. **Marketplace Offers**: `wiki/about/bread-token/marketplace/`
   - Individual offer files (NOT the index)

2. **Angel Minters**: `wiki/solidarity-primitives/crowdstaking/angel-minters/`
   - Person and organization files (NOT the index)

3. **Member Projects**: `wiki/solidarity-primitives/crowdstaking/member-projects/`
   - Organization files (NOT the index)

### Target Structure (new data/ folder)

```
shared-obsidian/
├── data/                    <- CREATE THIS FOLDER
│   ├── person/             <- All person entities
│   │   └── *.md            <- Copied from angel-minters/
│   ├── organization/       <- All organization entities
│   │   └── *.md            <- Copied from member-projects/ and angel-minters/
│   └── offer/              <- All marketplace offers
│       └── *.md            <- Copied from marketplace/
└── wiki/                   <- LEAVE UNCHANGED (except index cleanup)
    └── ...
```

## Step-by-Step Instructions

### 1. Create Data Directory Structure

```bash
# At root of shared-obsidian repo
mkdir -p data/person
mkdir -p data/organization
mkdir -p data/offer
```

### 2. Copy Marketplace Offers

**Source**: `wiki/about/bread-token/marketplace/*.md` (EXCEPT index file)
**Destination**: `data/offer/`

```bash
# Copy all offer files to data/offer/
# Skip index.md or marketplace.md (the directory index)
# COPY ONLY - do not delete originals
```

**What to copy**: Individual offer markdown files
**What to skip**: The index/directory page

### 3. Copy Angel Minters

**Source**: `wiki/solidarity-primitives/crowdstaking/angel-minters/*.md` (EXCEPT index)
**Destinations**:
- Person files → `data/person/`
- Organization files → `data/organization/`

```bash
# Identify which files are people vs organizations
# Copy person files to data/person/
# Copy organization files to data/organization/
# Skip the index file
```

**How to identify**:
- Check frontmatter for entity type indicators
- People usually have names like "alice-chen.md", "bob-garcia.md"
- Organizations have names like "breadchain-cooperative.md"

### 4. Copy Member Projects

**Source**: `wiki/solidarity-primitives/crowdstaking/member-projects/*.md` (EXCEPT index)
**Destination**: `data/organization/`

```bash
# Copy all organization files to data/organization/
# Skip the index file
# Check for duplicates from angel-minters (orgs can be both)
```

### 5. Ensure Proper Frontmatter

All copied files must have frontmatter matching the Astro schema. Check that each file has:

**Person files** require:
```yaml
---
name: "Full Name"
description: "Brief description"
# ... other fields
---
```

**Organization files** require:
```yaml
---
name: "Organization Name"
description: "Brief description"
# ... other fields
---
```

**Offer files** require:
```yaml
---
name: "Offer Name"
description: "Brief description"
offeredBy: "Provider Name"
itemOffered: "What's being offered"
---
```

### 6. Remove H1 Titles from Copied Files

**CRITICAL**: All files in the `data/` folder must NOT have H1 headings.

For each copied file:
```markdown
# BEFORE (in wiki)
---
name: "Alice Chen"
---

# Alice Chen    <- REMOVE THIS LINE

## About
...

# AFTER (in data/)
---
name: "Alice Chen"
---

## About        <- Start with H2
...
```

**Reason**: Starlight displays the title from frontmatter. H1 in markdown creates duplicates.

### 7. Clean Up Wiki Index Pages

Update the three index pages in the wiki (leave the individual entity files unchanged):

**Files to update**:
1. `wiki/about/bread-token/marketplace.md` (or index.md in that folder)
2. `wiki/solidarity-primitives/crowdstaking/angel-minters.md` (or index.md)
3. `wiki/solidarity-primitives/crowdstaking/member-projects.md` (or index.md)

**Changes**:
- Remove H1 title if present
- Keep all other content
- These should provide context/introduction text

## Validation Checklist

Before committing:

- [ ] `data/` folder exists at repo root
- [ ] `data/person/` contains person markdown files
- [ ] `data/organization/` contains organization markdown files
- [ ] `data/offer/` contains offer markdown files
- [ ] ALL original files still in wiki/ (nothing deleted)
- [ ] NO H1 headings in any data/ files
- [ ] All data/ files have proper frontmatter
- [ ] Wiki index pages cleaned (no H1 titles)

## Example File Counts

If you have:
- 15 marketplace offers → 15 files in `data/offer/`
- 8 angel minters (5 people, 3 orgs) → 5 in `data/person/`, 3 in `data/organization/`
- 10 member projects → 10 in `data/organization/` (may overlap with angel minters)

**Note**: Organizations can be both angel minters AND member projects, so you may have duplicates to dedupe.

## Technical Notes

### GitHub Wiki Sync

The `data/` folder will be synced by the github-wiki-sync integration in bread-docs:

```typescript
githubWikiSync({
  wikiPath: 'wiki',           // Syncs wiki/ to src/content/docs
  // Also syncs data/ to src/data/
})
```

The integration should pick up the `data/` folder and copy it to `bread-docs/src/data/`.

### Content Collections

Astro will load files from `src/data/` using glob loaders:

```typescript
const person = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/person' }),
  schema: entity.extend({ /* ... */ }),
});
```

## Common Issues

**Issue**: "Which files are people vs organizations?"
**Solution**: Look at frontmatter or content. People have names, job titles. Organizations have "cooperative", "project", organizational structure.

**Issue**: "An organization is both an angel minter and member project"
**Solution**: Only copy it once to `data/organization/`. It can have both `isAngelMinter: true` and `isMemberProject: true` in frontmatter.

**Issue**: "There's no index file, files are directly in the folder"
**Solution**: Good! Copy all the entity files to the appropriate data/ subfolder.

## Example Commands

```bash
# Create structure
mkdir -p data/{person,organization,offer}

# Copy offers (example)
cp wiki/about/bread-token/marketplace/web-dev-services.md data/offer/
cp wiki/about/bread-token/marketplace/branding-services.md data/offer/

# Copy people (example)
cp wiki/solidarity-primitives/crowdstaking/angel-minters/alice-chen.md data/person/

# Copy organizations (example)
cp wiki/solidarity-primitives/crowdstaking/member-projects/breadchain-coop.md data/organization/

# Then remove H1 titles from copied files
# Then clean up wiki index pages
# Then commit
```

## Commit Message

```
Copy entity data to data/ folder for Astro collections

- Create data/ folder structure (person, organization, offer)
- Copy marketplace offers to data/offer/
- Copy angel minter entities to data/person/ and data/organization/
- Copy member project entities to data/organization/
- Remove H1 titles from all copied data files
- Clean up wiki index pages (remove duplicate H1s)
- Original wiki files remain unchanged
```
