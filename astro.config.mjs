// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import githubWikiSync from './src/integrations/github-wiki-sync.ts';
import { loadEnv } from 'vite';
import wikiLinkPlugin from '@flowershow/remark-wiki-link';
import rehypeCallouts from 'rehype-callouts';
import remarkStripWikiPrefix from './src/plugins/remark-strip-wiki-prefix.js';

// Load environment variables
const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

// Helper function to check if a link target is an image file
function isImageFile(name) {
	const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'apng', 'bmp', 'ico'];
	const ext = name.split('.').pop()?.toLowerCase();
	return ext && imageExtensions.includes(ext);
}

// https://astro.build/config
export default defineConfig({
	markdown: {
		remarkPlugins: [
			// Strip wiki/ prefix from standard markdown links
			remarkStripWikiPrefix,
			// Transform Obsidian wikilinks to standard links (shortest path)
			[
				wikiLinkPlugin,
				{
					pathFormat: 'raw', // Use raw format to process paths as-is
					aliasDivider: '|',
					wikiLinkResolver: (name) => {
						// Handle image embeds: ![[image.png]] -> /attachments/image.png
						if (isImageFile(name)) {
							const filename = name.split('/').pop(); // Handle paths like 'folder/image.png'
							return [`/attachments/${filename}`];
						}

						// Handle page links: [[Page Name]] -> /page-name (root level, shortest path)
						// Strip any wiki/ prefix if present in the wikilink itself
						let linkName = name;
						if (linkName.startsWith('wiki/')) {
							linkName = linkName.substring(5);
						} else if (linkName.startsWith('/wiki/')) {
							linkName = linkName.substring(6);
						}

						const slug = linkName
							.toLowerCase()
							.replace(/\s+/g, '-') // spaces to hyphens
							.replace(/[^\w\-\/]/g, ''); // remove special chars, keep slashes for nested paths

						// Ensure leading slash for root-level path
						if (!slug.startsWith('/')) {
							return [`/${slug}`];
						}
						return [slug];
					},
					// Add CSS class to all wiki links for styling
					className: 'internal-link',
					// Add CSS class to links that don't have matching pages
					newClassName: 'internal-link-new',
				},
			],
		],
		rehypePlugins: [
			// Transform Obsidian callouts/admonitions (uses Obsidian theme by default)
			[
				rehypeCallouts,
				{
					theme: 'obsidian',
				},
			],
		],
	},
	integrations: [
		// Sync wiki content from GitHub before build
		githubWikiSync({
			token: env.GITHUB_TOKEN || '',
			owner: env.GITHUB_REPO_OWNER || 'BreadchainCoop',
			repo: env.GITHUB_REPO_NAME || 'shared-obsidian',
			wikiPath: env.GITHUB_WIKI_PATH || 'wiki',
			contentDir: 'src/content/docs',
			attachmentsDir: 'public/attachments',
		}),
		starlight({
			title: 'Breadchain Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/BreadchainCoop' }],
			// No sidebar config - Starlight auto-generates all content at root level
			customCss: [
				// Custom styles for Obsidian callouts and wikilinks
				'./src/styles/obsidian-callouts.css',
			],
		}),
	],
});
