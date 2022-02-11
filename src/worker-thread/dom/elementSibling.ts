import { NodeType } from '../../transfer/TransferrableNodes';
import { Element } from './Element';
import { Node } from './Node';

export function getPreviousElementSibling(node: Node): Element | null {
  let parentNodes = node.parentNode && node.parentNode.childNodes;
  if (!parentNodes) {
    return null;
  }

  for (let i = parentNodes.indexOf(node) - 1; i >= 0; i--) {
    let node = parentNodes[i];
    if (node.nodeType === NodeType.ELEMENT_NODE) {
      return node as Element;
    }
  }
  return null;
}

export function getNextElementSibling(node: Node): Element | null {
  let parentNodes = node.parentNode && node.parentNode.childNodes;
  if (!parentNodes) {
    return null;
  }

  for (let i = parentNodes.indexOf(node) + 1; i < parentNodes.length; i++) {
    let node = parentNodes[i];
    if (node.nodeType === NodeType.ELEMENT_NODE) {
      return node as Element;
    }
  }
  return null;
}
