import { visit } from 'unist-util-visit';
export function remarkStripObsidianComments() {
  return (tree) => {
    visit(tree, 'text', (node) => {
      node.value = node.value.replace(/%%[\s\S]*?%%/g, '');
    });
  };
}
