# Execution Prompt for Claude Code (shared-obsidian repo)

Copy this prompt and paste it to Claude Code when working in `F:\projects\shared-obsidian`:

---

I need you to copy entity markdown files from the wiki directory structure into a new `data/` folder for Astro content collections.

**CRITICAL RULES**:
1. **COPY ONLY** - DO NOT delete or move files from their wiki locations
2. Create `data/` folder at repo root (NOT inside wiki/)
3. Organize by entity type: person/, organization/, offer/
4. Remove H1 titles from copied files (Starlight displays titles automatically)
5. Clean up wiki index pages (remove H1 titles)

**STEP 1: Create directory structure**
```bash
mkdir -p data/person
mkdir -p data/organization
mkdir -p data/offer
```

**STEP 2: Copy marketplace offers**
- **Source**: `wiki/about/bread-token/marketplace/*.md` (individual offers, NOT index)
- **Destination**: `data/offer/`
- **Action**: Copy all offer files, skip index/directory page

**STEP 3: Copy angel minters**
- **Source**: `wiki/solidarity-primitives/crowdstaking/angel-minters/*.md` (NOT index)
- **Destinations**:
  - Person files → `data/person/`
  - Organization files → `data/organization/`
- **Action**: Identify file type from frontmatter/content, copy to appropriate folder

**STEP 4: Copy member projects**
- **Source**: `wiki/solidarity-primitives/crowdstaking/member-projects/*.md` (NOT index)
- **Destination**: `data/organization/`
- **Action**: Copy org files (may overlap with angel minters - dedupe)

**STEP 5: Remove H1 titles from ALL copied data/ files**
```markdown
# BEFORE
---
name: "Alice Chen"
---

# Alice Chen    <- REMOVE THIS

## About

# AFTER
---
name: "Alice Chen"
---

## About
```

**STEP 6: Clean up wiki index pages**
- `wiki/about/bread-token/marketplace.md` (or index.md in that folder)
- `wiki/solidarity-primitives/crowdstaking/angel-minters.md` (or index.md)
- `wiki/solidarity-primitives/crowdstaking/member-projects.md` (or index.md)

Remove H1 titles, keep all other content.

**Validation**:
- [ ] data/ folder exists with person/, organization/, offer/ subdirectories
- [ ] All entity files copied (counts should match source directories minus indices)
- [ ] NO H1 headings in data/ files
- [ ] Original wiki files UNCHANGED (still exist in their locations)
- [ ] Wiki index pages cleaned (no H1)

**Commit message**: "Copy entity data to data/ folder for Astro collections"

Refer to `temp/obsidian-vault-updates.md` in bread-docs repo for detailed instructions and examples.

---

After pasting this prompt, Claude Code will handle the file copying and cleanup.
