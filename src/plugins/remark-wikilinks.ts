import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Text, Link, Image } from 'mdast';
import { isImageFile } from '../lib/markdown-utils.js';
import { resolveWikilink } from '../lib/wikilink-resolver.js';

/**
 * Remark plugin to transform Obsidian-style wikilinks to standard markdown links
 *
 * Transforms:
 * - [[Page Name]] -> [Page Name](/page-name)
 * - [[Page Name|Alias]] -> [Alias](/page-name)
 * - [[wiki/page]] -> [page](/page)
 * - ![[Image.png]] -> ![Image](/attachments/Image.png)
 * - [[Page#heading]] -> [Page](/page#heading)
 *
 * This is a custom implementation to replace @flowershow/remark-wiki-link
 * Based on patterns from astro-loader-obsidian's wikilink parsing
 */

interface WikilinkMatch {
  fullMatch: string;
  isEmbed: boolean;
  target: string;
  alias?: string;
  heading?: string;
}

/**
 * Parse wikilinks from text content
 * Regex pattern inspired by astro-loader-obsidian
 */
function parseWikilinks(text: string): WikilinkMatch[] {
  const matches: WikilinkMatch[] = [];
  // Matches: [[target]] or [[target|alias]] or ![[target]]
  const regex = /(!)?\[\[([^\]]+?)\]\]/g;

  let match;
  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, embedMarker, content] = match;
    const isEmbed = embedMarker === '!';

    // Split by | for alias
    const [targetPart, ...aliasParts] = content.split('|');
    const alias = aliasParts.length > 0 ? aliasParts.join('|') : undefined;

    // Split by # for heading
    const [target, heading] = targetPart.split('#');

    matches.push({
      fullMatch,
      isEmbed,
      target: target.trim(),
      alias,
      heading,
    });
  }

  return matches;
}

/**
 * Replace wikilinks in text node with markdown links
 */
function replaceWikilinksinText(text: string): (Text | Link | Image)[] {
  const wikilinks = parseWikilinks(text);

  if (wikilinks.length === 0) {
    // No wikilinks, return original text
    return [{
      type: 'text',
      value: text,
    }];
  }

  const nodes: (Text | Link | Image)[] = [];
  let lastIndex = 0;

  for (const wikilink of wikilinks) {
    const matchIndex = text.indexOf(wikilink.fullMatch, lastIndex);

    // Add text before the wikilink
    if (matchIndex > lastIndex) {
      nodes.push({
        type: 'text',
        value: text.substring(lastIndex, matchIndex),
      });
    }

    // Resolve the wikilink
    const linkText = wikilink.alias || wikilink.target.split('/').pop() || wikilink.target;

    if (wikilink.isEmbed && isImageFile(wikilink.target)) {
      // Image embed: ![[image.png]]
      const filename = wikilink.target.split('/').pop();
      nodes.push({
        type: 'image',
        url: `/attachments/${filename}`,
        alt: linkText,
      });
    } else {
      // Regular link or document embed
      const url = resolveWikilink(wikilink.target, wikilink.heading);

      nodes.push({
        type: 'link',
        url,
        children: [{
          type: 'text',
          value: linkText,
        }],
        data: {
          hProperties: {
            className: wikilink.isEmbed ? 'internal-link-embed' : 'internal-link',
          },
        },
      });
    }

    lastIndex = matchIndex + wikilink.fullMatch.length;
  }

  // Add remaining text after last wikilink
  if (lastIndex < text.length) {
    nodes.push({
      type: 'text',
      value: text.substring(lastIndex),
    });
  }

  return nodes;
}

/**
 * Remark plugin to transform wikilinks
 */
const remarkWikilinks: Plugin<[], Root> = () => {
  return (tree: Root) => {
    // Process ALL nodes that can contain text, not just paragraphs
    visit(tree, (node: any) => {
      // Process nodes that have children (paragraph, heading, listItem, blockquote, etc.)
      if (!node.children || !Array.isArray(node.children)) {
        return;
      }

      let modified = false;
      const newChildren: any[] = [];

      for (const child of node.children) {
        if (child.type === 'text') {
          const replacements = replaceWikilinksinText(child.value);

          if (replacements.length > 1 || replacements[0].type !== 'text' || replacements[0].value !== child.value) {
            // Wikilinks were found and replaced
            modified = true;
            newChildren.push(...replacements);
          } else {
            // No wikilinks, keep original
            newChildren.push(child);
          }
        } else {
          // Not a text node, keep as-is
          newChildren.push(child);
        }
      }

      if (modified) {
        node.children = newChildren;
      }
    });
  };
};

export default remarkWikilinks;
