import { visit } from 'unist-util-visit';

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
export default function remarkStripWikiPrefix() {
  return (tree) => {
    // Process both link and image nodes
    visit(tree, ['link', 'image'], (node) => {
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

        // Check if this is an image file
        const isImage = node.type === 'image' || isImageFile(url);

        // Strip leading 'wiki/' or '/wiki/'
        let hadWikiPrefix = false;
        if (url.startsWith('wiki/')) {
          url = url.substring(5); // Remove 'wiki/'
          hadWikiPrefix = true;
        } else if (url.startsWith('/wiki/')) {
          url = url.substring(6); // Remove '/wiki/'
          hadWikiPrefix = true;
        }

        // If no wiki prefix, leave as-is
        if (!hadWikiPrefix) {
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

        // For images, route to /attachments/ directory
        if (isImage) {
          // Extract just the filename (handle nested paths)
          const filename = url.split('/').pop();
          node.url = `/attachments/${filename}${hash}`;
        } else {
          // For regular links, convert to slug format (lowercase, hyphens)
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
      }
    });
  };
}

/**
 * Check if a filename is an image based on extension
 */
function isImageFile(filename) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'apng', 'bmp', 'ico'];
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext && imageExtensions.includes(ext);
}
