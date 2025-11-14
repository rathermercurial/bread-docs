import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Link, Image } from 'mdast';
import { isImageFile, stripWikiPrefix, slugify, ensureLeadingSlash } from '../lib/markdown-utils.js';

/**
 * Remark plugin to strip 'wiki/' prefix from markdown links and images
 *
 * Transforms:
 * - [text](wiki/page.md) -> [text](/page)
 * - [text](wiki/page) -> [text](/page)
 * - [text](/wiki/page) -> [text](/page)
 * - ![alt](wiki/image.png) -> ![alt](/attachments/image.png)
 * - ![alt](/wiki/image.png) -> ![alt](/attachments/image.png)
 *
 * Handles both relative and absolute wiki paths, removes .md extension,
 * and converts to root-level paths matching the site structure.
 */
const remarkStripWikiPrefix: Plugin<[], Root> = () => {
  return (tree: Root) => {
    // Process both link and image nodes
    visit(tree, ['link', 'image'], (node) => {
      // Type guard to ensure node is Link or Image
      if (node.type !== 'link' && node.type !== 'image') {
        return;
      }

      if (!node.url) {
        return;
      }

      let url = node.url;

      // Skip external links (http/https)
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return;
      }

      // Skip anchor-only links
      if (url.startsWith('#')) {
        return;
      }

      // Check if URL has wiki prefix
      if (!url.startsWith('wiki/') && !url.startsWith('/wiki/')) {
        return;
      }

      // Check if this is an image file
      const isImage = node.type === 'image' || isImageFile(url);

      // Strip wiki/ prefix
      url = stripWikiPrefix(url);

      // Remove .md extension if present
      if (url.endsWith('.md')) {
        url = url.substring(0, url.length - 3);
      }

      // Extract hash/anchor if present
      const hashIndex = url.indexOf('#');
      let hash = '';
      if (hashIndex !== -1) {
        hash = url.substring(hashIndex);
        url = url.substring(0, hashIndex);
      }

      // For images, route to /attachments/ directory
      if (isImage) {
        // Extract just the filename (handle nested paths)
        const filename = url.split('/').pop();
        node.url = `/attachments/${filename}${hash}`;
      } else {
        // For regular links, convert to slug format and ensure leading slash
        const slug = slugify(url);
        const path = ensureLeadingSlash(slug);
        node.url = path + hash;
      }
    });
  };
};

export default remarkStripWikiPrefix;
