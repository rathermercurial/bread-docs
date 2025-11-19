// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import githubWikiSync from './src/integrations/github-wiki-sync.ts';
import { loadEnv } from 'vite';
import remarkStripWikiPrefix from './src/plugins/remark-strip-wiki-prefix.ts';
import remarkObsidianToStarlight from './src/plugins/remark-obsidian-to-starlight.ts';
import remarkWikilinks from './src/plugins/remark-wikilinks.ts';
import { generateSidebar } from './src/lib/generate-sidebar.ts';

// Load environment variables
const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

// Generate sidebar from content directory
const sidebar = await generateSidebar('src/content/docs');

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
		// Sync content from GitHub before build (wiki docs, entity data, attachments)
		githubWikiSync({
			token: env.GITHUB_TOKEN || '',
			owner: env.GITHUB_REPO_OWNER || 'BreadchainCoop',
			repo: env.GITHUB_REPO_NAME || 'shared-obsidian',
			syncPaths: [
				{ sourcePath: env.GITHUB_WIKI_PATH || 'wiki', targetDir: 'src/content/docs' },
				{ sourcePath: 'data', targetDir: 'src/content/data' },
			],
			attachmentsDir: 'public/attachments',
		}),
		starlight({
			title: 'Breadchain Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/BreadchainCoop' }],
			// Custom sidebar - folder entries link to their index pages
			sidebar: sidebar,
			components: {
				// Custom components for theme and search
				ThemeSelect: './src/components/overrides/ThemeSelect.astro',
				Search: './src/components/overrides/Search.astro',
				// Override Sidebar to use custom SidebarSublist with clickable folder labels
				Sidebar: './src/components/starlight/Sidebar.astro',
			},
			customCss: [
				'./src/styles/bread-theme.css',
				'./src/styles/obsidian-callouts.css',
			],
		}),
	],
});
