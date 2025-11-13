import { visit } from 'unist-util-visit';

/**
 * Remark plugin to strip 'wiki/' prefix from markdown links
 *
 * Transforms:
 * - [text](wiki/page.md) -> [text](/page)
 * - [text](wiki/page) -> [text](/page)
 * - [text](/wiki/page) -> [text](/page)
 *
 * Handles both relative and absolute wiki paths, removes .md extension,
 * and converts to root-level paths matching the site structure.
 */
export default function remarkStripWikiPrefix() {
  return (tree) => {
    visit(tree, 'link', (node) => {
      if (node.url) {
        let url = node.url;

        // Skip external links (http/https)
        if (url.startsWith('http://') || url.startsWith('https://')) {
          return;
        }

        // Skip anchor-only links
        if (url.startsWith('#')) {
          return;
        }

        // Strip leading 'wiki/' or '/wiki/'
        if (url.startsWith('wiki/')) {
          url = url.substring(5); // Remove 'wiki/'
        } else if (url.startsWith('/wiki/')) {
          url = url.substring(6); // Remove '/wiki/'
        } else {
          // No wiki prefix, leave as-is
          return;
        }

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

        // Convert to slug format (lowercase, hyphens)
        url = url
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-\/]/g, '');

        // Ensure leading slash for root-level path
        if (!url.startsWith('/')) {
          url = '/' + url;
        }

        // Re-attach hash/anchor
        node.url = url + hash;
      }
    });
  };
}
