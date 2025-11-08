// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import wikiLinkPlugin from '@flowershow/remark-wiki-link';
import githubWikiSync from './src/integrations/github-wiki-sync.ts';

// Helper to determine if link is an image
function isImageFile(name) {
	const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'apng', 'bmp', 'ico'];
	const ext = name.split('.').pop()?.toLowerCase();
	return ext && imageExts.includes(ext);
}

// https://astro.build/config
export default defineConfig({
	integrations: [
		// Sync wiki content from GitHub before build
		githubWikiSync({
			token: process.env.GITHUB_TOKEN || '',
			owner: process.env.GITHUB_REPO_OWNER || 'BreadchainCoop',
			repo: process.env.GITHUB_REPO_NAME || 'shared-obsidian',
			wikiPath: process.env.GITHUB_WIKI_PATH || 'wiki',
			contentDir: 'src/content/docs',
			attachmentsDir: 'public/attachments',
		}),
		starlight({
			title: 'Breadchain Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/BreadchainCoop' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
				{
					label: 'Wiki',
					autogenerate: { directory: 'wiki' },
				},
			],
		}),
	],
	markdown: {
		remarkPlugins: [
			[
				wikiLinkPlugin,
				{
					pathFormat: 'obsidian-absolute',
					aliasDivider: '|',
					// Custom resolver for wiki links and images
					wikiLinkResolver: (name) => {
						// Handle image links: [[image.png]] -> /attachments/image.png
						if (isImageFile(name)) {
							const filename = name.split('/').pop(); // Handle subdirs
							return [`/attachments/${filename}`];
						}

						// Handle page links: [[Page Name]] -> /wiki/page-name
						const slug = name
							.toLowerCase()
							.replace(/\s+/g, '-')
							.replace(/[^\w-]/g, ''); // Remove special chars

						return [`/wiki/${slug}`];
					},
				},
			],
		],
	},
});
