# Obsidian Vault Updates - Entity Collection Integration

## Context

The bread-docs site now has entity collection pages (marketplace, angel-minters, member-projects) that:
1. Display dynamically generated card grids from data collections
2. Attempt to load and display markdown content from wiki docs ABOVE the card grids
3. Use Starlight's native page title rendering

## Required Changes

You need to update three index pages in the shared-obsidian wiki to ensure they work correctly with the entity collection integration.

## File Locations

The pages are expected at these paths in the wiki:

1. **Marketplace Index**: `wiki/about/bread-token/marketplace.md`
2. **Angel Minters Directory**: `wiki/solidarity-primitives/crowdstaking/angel-minters.md`
3. **Member Projects Directory**: `wiki/solidarity-primitives/crowdstaking/member-projects.md`

## Changes Required

### 1. Remove Duplicate H1 Titles

**CRITICAL**: Starlight already displays page titles from frontmatter. Any H1 (`# Title`) in the markdown will create a duplicate title.

**Action**: If any of these files exist and have H1 titles, remove them completely.

**Example**:
```markdown
<!-- BEFORE -->
# Marketplace

Welcome to the Breadchain marketplace...

<!-- AFTER -->
Welcome to the Breadchain marketplace...
```

### 2. Ensure Files Exist

If any of these three files don't exist yet, they should be created with appropriate introductory content (no H1 title).

### 3. Content Guidelines

Each page should contain:
- **Introduction paragraph**: Explain what this section is about
- **Context**: Why this exists in the Breadchain ecosystem
- **How to participate** (if applicable): Instructions for getting listed
- **NO H1 heading**: Let Starlight handle the title

## Example Content Templates

### Marketplace (`wiki/about/bread-token/marketplace.md`)

```markdown
The Breadchain Marketplace connects cooperative projects, mutual aid organizations, and solidarity economy participants through a decentralized exchange of goods, services, and offerings.

## How It Works

Members of the Breadchain network can list their offerings in the marketplace, making them discoverable to other cooperatives and community members. The marketplace operates on principles of transparency, mutual aid, and solidarity economics.

## Getting Listed

To add your offering to the marketplace, create a markdown file in the appropriate data collection with your offer details including description, what you're offering, and how to connect.
```

### Angel Minters (`wiki/solidarity-primitives/crowdstaking/angel-minters.md`)

```markdown
Angel Minters are community members and organizations who participate in Breadchain's crowdstaking mechanism, providing solidarity funding to support cooperative projects and mutual aid networks.

## What is Angel Minting?

Angel Minting is Breadchain's approach to community-driven funding, where participants stake BREAD tokens to support projects aligned with cooperative and solidarity economy principles.

## Becoming an Angel Minter

Community members can become Angel Minters by participating in the crowdstaking protocol and supporting member projects through token staking.
```

### Member Projects (`wiki/solidarity-primitives/crowdstaking/member-projects.md`)

```markdown
Member Projects are cooperatives, mutual aid organizations, and solidarity economy initiatives that are part of the Breadchain network and participate in the crowdstaking ecosystem.

## What are Member Projects?

Member Projects represent the core of Breadchain's cooperative network - organizations building solidarity economy infrastructure, providing mutual aid, and advancing cooperative principles.

## Joining as a Member Project

Cooperatives and solidarity economy projects can apply to become Member Projects, gaining access to crowdstaking support, marketplace visibility, and network resources.
```

## Execution Instructions for Claude Code

When you run this in the shared-obsidian repo (`F:\projects\shared-obsidian`):

1. **Search for existing files**:
   - Look for `wiki/about/bread-token/marketplace.md`
   - Look for `wiki/solidarity-primitives/crowdstaking/angel-minters.md`
   - Look for `wiki/solidarity-primitives/crowdstaking/member-projects.md`

2. **For each existing file**:
   - Read the file
   - Check if it starts with an H1 (`# Title`)
   - If yes, remove the H1 line (and any blank lines immediately after it)
   - Preserve all other content

3. **For each missing file**:
   - Create the directory structure if needed
   - Create the file with appropriate template content (see examples above)
   - Ensure NO H1 heading is present

4. **Commit changes**:
   - Review all changes
   - Commit with message: "Remove duplicate H1 titles from entity index pages for Starlight compatibility"
   - Push to the shared-obsidian repo

## Validation

After making changes, verify:
- ✅ No files contain H1 headings (`# Title`)
- ✅ All three required files exist
- ✅ Content is meaningful and provides context
- ✅ Files are in correct wiki directory structure

## Technical Notes

- The bread-docs site loads these files via `getEntry('docs', 'path/to/file')`
- The path is relative to the wiki sync location
- Content is rendered ABOVE the dynamically generated card grids
- Starlight's page title comes from the route/page name, not markdown H1
