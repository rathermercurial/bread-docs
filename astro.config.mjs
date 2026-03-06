// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightPageActions from 'starlight-page-actions';
import starlightMarkdownBlocks, { Draft } from 'starlight-markdown-blocks';
import { remarkStripObsidianComments } from './remarkStripObsidianComments.mjs';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [
      starlight({
          plugins: [
              starlightPageActions({
                  baseUrl: 'https://docs.bread.coop/',
                  share: true,
                  prompt: 'Please read and summarize the following documentation page: {url}',
                  actions: {
                      chatgpt: true,
                      claude: true,
                      t3chat: true,
                      v0: true,
                      markdown: true,
                  },
              }),
              starlightMarkdownBlocks({
                  blocks: {
                      draft: Draft(),
                  },
              }),
          ],
          title: 'Bread Docs',
          customCss: [
              // Path to Tailwind CSS entry with Starlight integration
              './src/styles/global.css',
          ],
          components: {
              // Override SiteTitle with Bread logo
              SiteTitle: './src/overrides/SiteTitle.astro',
          },
          social: [
              { icon: 'github', label: 'GitHub', href: 'https://github.com/BreadchainCoop' },
              { icon: 'discord', label: 'Discord', href: 'https://discord.gg/bread' },
          ],
          sidebar: [
              { label: 'About', autogenerate: { directory: 'about' } },
              { label: 'Solidarity Primitives', autogenerate: { directory: 'solidarity-primitives' } },
              { label: 'Bread Cooperative', autogenerate: { directory: 'bread-cooperative' } },
          ],
      }),
	],

  markdown: {
    remarkPlugins: [remarkStripObsidianComments],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
