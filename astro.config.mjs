// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import githubWikiSync from './src/integrations/github-wiki-sync.ts';
import { loadEnv } from 'vite';
import remarkStripWikiPrefix from './src/plugins/remark-strip-wiki-prefix.ts';
import remarkObsidianToStarlight from './src/plugins/remark-obsidian-to-starlight.ts';
import remarkWikilinks from './src/plugins/remark-wikilinks.ts';

// Load environment variables
const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
	markdown: {
		remarkPlugins: [
			// Strip wiki/ prefix from standard markdown links
			remarkStripWikiPrefix,
			// Transform Obsidian callouts to Starlight asides
			remarkObsidianToStarlight,
			// Transform Obsidian wikilinks to standard links (custom implementation)
			remarkWikilinks,
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
