import { NodeType } from '../../transfer/TransferrableNodes.js';
import { Element } from './Element.js';
import { Node } from './Node.js';

export function getPreviousElementSibling(node: Node): Element | null {
  const parentNodes = node.parentNode && node.parentNode.childNodes;
  if (!parentNodes) {
    return null;
  }

  for (let i = parentNodes.indexOf(node) - 1; i >= 0; i--) {
    const node = parentNodes[i];
    if (node.nodeType === NodeType.ELEMENT_NODE) {
      return node as Element;
    }
  }
  return null;
}

export function getNextElementSibling(node: Node): Element | null {
  const parentNodes = node.parentNode && node.parentNode.childNodes;
  if (!parentNodes) {
    return null;
  }

  for (let i = parentNodes.indexOf(node) + 1; i < parentNodes.length; i++) {
    const node = parentNodes[i];
    if (node.nodeType === NodeType.ELEMENT_NODE) {
      return node as Element;
    }
  }
  return null;
}
