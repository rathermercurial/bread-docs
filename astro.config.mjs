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
					format: 'shortestPossible',
					aliasDivider: '|',
					urlResolver: ({ filePath, isEmbed, heading }) => {
						console.log('[urlResolver] Input:', { filePath, isEmbed, heading });

						// Handle image embeds: ![[image.png]] -> /attachments/image.png
						if (isEmbed && isImageFile(filePath)) {
							const filename = filePath.split('/').pop();
							const result = `/attachments/${filename}`;
							console.log('[urlResolver] Image output:', result);
							return result;
						}

						// Strip wiki/ prefix and /index suffix
						let linkName = filePath;
						if (linkName.startsWith('wiki/')) {
							linkName = linkName.substring(5);
							console.log('[urlResolver] Stripped wiki/ prefix, now:', linkName);
						} else if (linkName.startsWith('/wiki/')) {
							linkName = linkName.substring(6);
							console.log('[urlResolver] Stripped /wiki/ prefix, now:', linkName);
						}

						// Remove /index or /index.md suffix
						if (linkName.endsWith('/index.md')) {
							linkName = linkName.substring(0, linkName.length - 9);
						} else if (linkName.endsWith('/index')) {
							linkName = linkName.substring(0, linkName.length - 6);
						} else if (linkName.endsWith('.md')) {
							linkName = linkName.substring(0, linkName.length - 3);
						}

						// Convert to slug format
						const slug = linkName
							.toLowerCase()
							.replace(/\s+/g, '-')
							.replace(/[^\w\-\/]/g, '');

						// Ensure leading slash
						const result = slug.startsWith('/') ? `/${slug}` : slug;

						// Append heading anchor if present
						const finalUrl = heading ? `${result}#${heading}` : result;
						console.log('[urlResolver] Final output:', finalUrl);
						return finalUrl;
					},
					className: 'internal-link',
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
