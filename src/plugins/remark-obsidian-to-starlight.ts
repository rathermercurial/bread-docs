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

      // Get the inline children of the first paragraph
      const firstParagraph = firstChild as Paragraph;
      const inlineChildren = firstParagraph.children;

      // Check if the first inline node is a text node starting with [!type]
      if (!inlineChildren || inlineChildren.length === 0) return;

      const firstInline = inlineChildren[0];
      if (firstInline.type !== 'text') return;

      const firstTextNode = firstInline as Text;
      const calloutMatch = firstTextNode.value.match(/^\[!(\w+)\]([-+])?\s*(.*)?$/m);

      if (!calloutMatch) {
        // Not a callout - skip this blockquote
        return;
      }

      const [fullMatch, type, , titleText] = calloutMatch;
      const calloutInfo = { type: type.toLowerCase(), title: titleText?.trim() || undefined };

      // Map Obsidian type to Starlight type
      const starlightType = calloutTypeMap[calloutInfo.type] || 'note';

      // Build the directive content
      const directiveChildren: any[] = [];

      // Remove the callout marker from the first text node and keep remaining content
      const textAfterMarker = firstTextNode.value.replace(/^\[!\w+\]([-+])?\s*[^\n]*\n?/, '').trim();

      // Build content from the modified first paragraph
      const contentInlineNodes: any[] = [];

      // If there's text after the marker in the first text node, keep it
      if (textAfterMarker) {
        contentInlineNodes.push({ type: 'text', value: textAfterMarker });
      }

      // Add all remaining inline nodes from the first paragraph (after the first text node)
      for (let i = 1; i < inlineChildren.length; i++) {
        contentInlineNodes.push(inlineChildren[i]);
      }

      // If we have content from the first paragraph, create a paragraph node
      if (contentInlineNodes.length > 0) {
        directiveChildren.push({
          type: 'paragraph',
          children: contentInlineNodes,
        });
      }

      // Add all subsequent children from the blockquote (other paragraphs, lists, etc.)
      for (let i = 1; i < node.children.length; i++) {
        directiveChildren.push(node.children[i]);
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
