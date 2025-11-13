// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import githubWikiSync from './src/integrations/github-wiki-sync.ts';
import { loadEnv } from 'vite';
import wikiLinkPlugin from '@flowershow/remark-wiki-link';
import rehypeCallouts from 'rehype-callouts';
import remarkStripWikiPrefix from './src/plugins/remark-strip-wiki-prefix.ts';
import { isImageFile, stripWikiPrefix, slugify, removeIndexSuffix, ensureLeadingSlash } from './src/lib/markdown-utils.ts';

// Load environment variables
const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

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
						// Handle image embeds: ![[image.png]] -> /attachments/image.png
						if (isEmbed && isImageFile(filePath)) {
							const filename = filePath.split('/').pop();
							return `/attachments/${filename}`;
						}

						// Process the path using shared utilities
						let linkName = stripWikiPrefix(filePath);
						linkName = removeIndexSuffix(linkName);
						const slug = slugify(linkName);
						const result = ensureLeadingSlash(slug);

						// Append heading anchor if present
						return heading ? `${result}#${heading}` : result;
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
