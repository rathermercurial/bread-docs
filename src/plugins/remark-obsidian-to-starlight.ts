import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Blockquote, Paragraph, Text } from 'mdast';

/**
 * Remark plugin to transform Obsidian callouts to Starlight asides
 *
 * Transforms Obsidian callout syntax:
 *   > [!note] Title
 *   > Content
 *
 * Into Starlight aside directive nodes that will be rendered by Starlight's aside component
 *
 * Supports all Obsidian callout types and maps them to Starlight aside types
 */

// Map Obsidian callout types to Starlight aside types
const calloutTypeMap: Record<string, string> = {
  note: 'note',
  tip: 'tip',
  info: 'note',
  warning: 'caution',
  caution: 'caution',
  danger: 'danger',
  error: 'danger',
  bug: 'danger',
  example: 'tip',
  quote: 'note',
  success: 'tip',
  question: 'note',
  todo: 'note',
  abstract: 'note',
  summary: 'note',
};

/**
 * Parse an Obsidian callout header line
 * Format: [!type] Optional Title
 * Or: [!type]+ Optional Title (expanded)
 * Or: [!type]- Optional Title (collapsed)
 */
function parseCalloutHeader(text: string): { type: string; title?: string } | null {
  // Match [!type] or [!type]+ or [!type]-
  const match = text.match(/^\[!(\w+)\]([-+])?\s*(.*)?$/);
  if (!match) return null;

  const [, type, , title] = match;
  return {
    type: type.toLowerCase(),
    title: title?.trim() || undefined,
  };
}

/**
 * Extract ALL text content from a node, recursively traversing inline elements
 */
function extractText(node: any): string {
  if (node.type === 'text') {
    return node.value;
  }

  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractText).join('');
  }

  return '';
}

/**
 * Transform Obsidian callouts to Starlight aside directive nodes
 */
const remarkObsidianToStarlight: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'blockquote', (node: Blockquote, index, parent) => {
      if (!parent || index === undefined) return;

      // Check if first child is a paragraph starting with [!type]
      const firstChild = node.children[0];
      if (!firstChild || firstChild.type !== 'paragraph') {
        // Not a callout - regular blockquote
        return;
      }

      const firstText = extractText(firstChild);
      const calloutInfo = parseCalloutHeader(firstText);

      if (!calloutInfo) {
        // Blockquote doesn't start with [!type] - not an Obsidian callout
        console.debug(`[obsidian-to-starlight] Skipping blockquote, first line: "${firstText.substring(0, 50)}"`);
        return;
      }

      // Map Obsidian type to Starlight type
      const starlightType = calloutTypeMap[calloutInfo.type] || 'note';

      // Build the directive content (skip the header line, keep rest of blockquote content)
      const directiveChildren: any[] = [];

      for (let i = 1; i < node.children.length; i++) {
        directiveChildren.push(node.children[i]);
      }

      // Helper to get preview of node content
      const getNodePreview = (n: any): string => {
        if (n.type === 'paragraph') return extractText(n).substring(0, 50);
        if (n.type === 'list') return `[list with ${n.children?.length || 0} items]`;
        if (n.type === 'code') return '[code block]';
        return `[${n.type}]`;
      };

      console.debug(`[obsidian-to-starlight] Transforming callout:`, {
        type: calloutInfo.type,
        title: calloutInfo.title,
        totalChildren: node.children.length,
        contentChildren: directiveChildren.length,
        firstChildPreview: getNodePreview(node.children[0]),
        childPreviews: node.children.map(getNodePreview),
      });

      if (directiveChildren.length === 0) {
        console.warn(`[obsidian-to-starlight] Callout has no content children!`, {
          type: calloutInfo.type,
          title: calloutInfo.title,
          totalChildren: node.children.length,
        });
      }

      // Create directive node in the format Starlight expects
      // This matches the format that remark-directive creates from :::note syntax
      const directiveNode: any = {
        type: 'containerDirective',
        name: starlightType,
        children: directiveChildren,
      };

      // Add title as attribute if present (Starlight format: :::note[Title])
      if (calloutInfo.title) {
        directiveNode.attributes = {
          '': calloutInfo.title, // Empty string key for the label syntax
        };
      }

      // Replace the blockquote with the directive
      parent.children[index] = directiveNode;
    });
  };
};

export default remarkObsidianToStarlight;
