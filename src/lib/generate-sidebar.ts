import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

interface SidebarItem {
	label: string;
	link?: string;
	items?: SidebarItem[];
	collapsed?: boolean;
}

interface PageInfo {
	title: string;
	slug: string;
	isIndex: boolean;
}

/**
 * Parses frontmatter from markdown content using js-yaml (Astro's existing dependency)
 */
function parseFrontmatter(content: string): Record<string, any> {
	const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
	const match = content.match(frontmatterRegex);

	if (!match) {
		return {};
	}

	try {
		return (yaml.load(match[1]) as Record<string, any>) || {};
	} catch {
		return {};
	}
}

/**
 * Generates Starlight sidebar configuration from content directory structure.
 * Folders with index.md files are represented as linked entries using the index page's title.
 * Returns undefined if content directory doesn't exist (allows Starlight to auto-generate).
 */
export async function generateSidebar(
	contentDir: string
): Promise<SidebarItem[] | undefined> {
	const docsPath = path.join(process.cwd(), contentDir);

	// Check if content directory exists
	try {
		await fs.access(docsPath);
	} catch {
		// Content not synced yet (first build or dev mode without build)
		// Return undefined to let Starlight auto-generate the sidebar
		console.log('Content directory not found - Starlight will auto-generate sidebar');
		return undefined;
	}

	// Read directory structure and parse frontmatter
	const structure = await buildDirectoryStructure(docsPath, '');

	// Convert to Starlight sidebar format (depth 0 = top level)
	return convertToSidebarItems(structure, '', 0);
}

/**
 * Recursively builds directory structure with page information
 */
async function buildDirectoryStructure(
	basePath: string,
	relativePath: string
): Promise<Map<string, PageInfo | Map<string, any>>> {
	const fullPath = path.join(basePath, relativePath);
	const entries = await fs.readdir(fullPath, { withFileTypes: true });

	const structure = new Map<string, PageInfo | Map<string, any>>();

	for (const entry of entries) {
		const entryPath = path.join(relativePath, entry.name);

		if (entry.isDirectory()) {
			// Recursively process subdirectory
			const subStructure = await buildDirectoryStructure(basePath, entryPath);
			structure.set(entry.name, subStructure);
		} else if (entry.isFile() && entry.name.endsWith('.md')) {
			// Parse markdown file
			const fullFilePath = path.join(fullPath, entry.name);
			const content = await fs.readFile(fullFilePath, 'utf-8');
			const frontmatter = parseFrontmatter(content);

			// Normalize path separators to forward slashes for URLs
			// and remove .md and /index suffixes
			const slug = entryPath
				.replace(/\\/g, '/') // Convert backslashes to forward slashes
				.replace(/\.md$/, '') // Remove .md extension
				.replace(/\/index$/, '') // Remove /index suffix
				.replace(/^\//, ''); // Remove leading slash

			const isIndex = entry.name === 'index.md';
			const title = frontmatter.title || entry.name.replace(/\.md$/, '');

			structure.set(entry.name, {
				title,
				slug,
				isIndex,
			});
		}
	}

	return structure;
}

/**
 * Converts directory structure to Starlight sidebar format
 * @param structure - The directory structure map
 * @param parentSlug - Parent slug for building paths
 * @param depth - Current depth level (0 = top level)
 */
function convertToSidebarItems(
	structure: Map<string, PageInfo | Map<string, any>>,
	parentSlug: string = '',
	depth: number = 0
): SidebarItem[] {
	const items: SidebarItem[] = [];

	// Check if this structure itself has an index.md (it's a folder with index)
	const hasOwnIndex = structure.has('index.md');

	// At depth 0 (root level), skip wrapping in a folder group even if there's an index.md
	// This prevents the entire sidebar from being nested under a single top-level item
	if (hasOwnIndex && depth > 0) {
		// This Map represents a single folder with an index.md
		// Process it as a folder group
		const indexPage = structure.get('index.md') as PageInfo;
		const childItems: SidebarItem[] = [];

		// Process all entries except index.md
		const entries = Array.from(structure.entries())
			.filter(([name]) => name !== 'index.md')
			.sort((a, b) => {
				const aIsFolder = a[1] instanceof Map;
				const bIsFolder = b[1] instanceof Map;
				if (aIsFolder && !bIsFolder) return -1;
				if (!aIsFolder && bIsFolder) return 1;
				return a[0].localeCompare(b[0]);
			});

		for (const [name, value] of entries) {
			if (value instanceof Map) {
				// Subfolder - process recursively
				const subItems = convertToSidebarItems(value, `${indexPage.slug}/`, depth + 1);
				childItems.push(...subItems);
			} else {
				// Regular page
				const page = value as PageInfo;
				childItems.push({
					label: page.title,
					link: `/${page.slug}`,
				});
			}
		}

		// Create the folder group
		if (childItems.length > 0) {
			const folderItem: SidebarItem = {
				label: indexPage.title,
				items: [
					{
						label: indexPage.title,
						link: `/${indexPage.slug}`,
					},
					...childItems,
				],
			};

			// Nested folders (depth > 1) are collapsed by default
			// Top-level sidebar folders (depth 1) and root (depth 0) remain open
			if (depth > 1) {
				folderItem.collapsed = true;
			}

			return [folderItem];
		} else {
			// Folder only has index page
			return [
				{
					label: indexPage.title,
					link: `/${indexPage.slug}`,
				},
			];
		}
	}

	// No index.md - process as a collection of items
	// Sort entries: folders first, then files alphabetically
	const entries = Array.from(structure.entries()).sort((a, b) => {
		const aIsFolder = a[1] instanceof Map;
		const bIsFolder = b[1] instanceof Map;

		if (aIsFolder && !bIsFolder) return -1;
		if (!aIsFolder && bIsFolder) return 1;

		return a[0].localeCompare(b[0]);
	});

	for (const [name, value] of entries) {
		if (value instanceof Map) {
			// Subfolder - process recursively (will return folder group if it has index.md)
			// At depth 0, increment depth for subfolders so they create proper groups
			// At depth > 0, keep the same depth to avoid over-nesting
			const folderDepth = depth === 0 ? 1 : depth;
			const subItems = convertToSidebarItems(value, `${parentSlug}${name}/`, folderDepth);
			if (subItems.length > 0) {
				items.push(...subItems);
			}
		} else if (name !== 'index.md') {
			// Regular page (not index.md)
			const page = value as PageInfo;
			items.push({
				label: page.title,
				link: `/${page.slug}`,
			});
		}
	}

	return items;
}
