/**
 * Shared markdown utilities for Obsidian markdown support
 *
 * Provides common functions used across:
 * - astro.config.mjs (urlResolver)
 * - src/plugins/remark-strip-wiki-prefix.js
 * - src/integrations/github-wiki-sync.ts
 */

/**
 * Check if a filename represents an image file based on extension
 * @param filename - The filename or path to check
 * @returns true if the file is an image
 */
export function isImageFile(filename: string): boolean {
	const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'apng', 'bmp', 'ico'];
	const ext = filename.split('.').pop()?.toLowerCase();
	return ext ? imageExtensions.includes(ext) : false;
}

/**
 * Strip wiki/ or /wiki/ prefix from a path
 * @param path - The path to process
 * @returns Path with wiki prefix removed, or original path if no prefix found
 */
export function stripWikiPrefix(path: string): string {
	if (path.startsWith('wiki/')) {
		return path.substring(5);
	}
	if (path.startsWith('/wiki/')) {
		return path.substring(6);
	}
	return path;
}

/**
 * Convert text to a URL-safe slug
 * @param text - The text to slugify
 * @returns Slugified text (lowercase, hyphens, alphanumeric only)
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^\w\-\/]/g, '');
}

/**
 * Remove /index, /index.md, or .md suffix from a path
 * @param path - The path to process
 * @returns Path with suffix removed
 */
export function removeIndexSuffix(path: string): string {
	if (path.endsWith('/index.md')) {
		return path.substring(0, path.length - 9);
	}
	if (path.endsWith('/index')) {
		return path.substring(0, path.length - 6);
	}
	if (path.endsWith('.md')) {
		return path.substring(0, path.length - 3);
	}
	return path;
}

/**
 * Ensure a path has a leading slash
 * @param path - The path to process
 * @returns Path with leading slash
 */
export function ensureLeadingSlash(path: string): string {
	return path.startsWith('/') ? path : `/${path}`;
}
