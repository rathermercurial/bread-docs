# Execution Prompt for Claude Code (shared-obsidian repo)

Copy this prompt and paste it to Claude Code when working in `F:\projects\shared-obsidian`:

---

I need you to update three wiki pages for Starlight compatibility. The bread-docs site now loads these pages as content above dynamically generated entity card grids, and Starlight displays page titles automatically, so we need to remove any H1 headings.

**Tasks**:

1. **Check and update these three files** (remove H1 titles if present, create if missing):
   - `wiki/about/bread-token/marketplace.md`
   - `wiki/solidarity-primitives/crowdstaking/angel-minters.md`
   - `wiki/solidarity-primitives/crowdstaking/member-projects.md`

2. **For existing files**: Remove any H1 heading (`# Title`) at the start of the file. Keep all other content.

3. **For missing files**: Create them with introductory content (NO H1 heading). The content should explain what the section is about and how to participate.

**Content guidelines**:
- Marketplace: Explain the cooperative marketplace, how it works, how to list offerings
- Angel Minters: Explain crowdstaking, what angel minting is, how to participate
- Member Projects: Explain what member projects are, benefits, how to join

**Important**:
- NO H1 headings (`# Title`) - Starlight handles page titles
- H2 and below are fine for section headings
- Create directory structure if needed
- Commit with message: "Remove duplicate H1 titles from entity index pages for Starlight compatibility"

Refer to `temp/obsidian-vault-updates.md` in the bread-docs repo for detailed examples and templates.

---

After pasting this prompt, Claude Code will handle the file updates in the shared-obsidian repo.
