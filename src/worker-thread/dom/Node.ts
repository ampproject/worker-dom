import { store as storeNodeMapping, storeOverride as storeOverrideNodeMapping } from '../nodes';
import { mutate } from '../MutationObserver';
import { MutationRecordType } from '../MutationRecord';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { Document } from './Document';
import { NodeType, TransferredNode } from '../../transfer/TransferrableNodes';
import { TransferrableMutationType, TransferrableObjectType } from '../../transfer/TransferrableMutation';
import { EventTarget } from '../event-subscription/EventTarget';

export type NodeName = '#comment' | '#document' | '#document-fragment' | '#text' | string;
export type NamespaceURI = string;

/**
 * Propagates a property change for a Node to itself and all childNodes.
 * @param node Node to start applying change to
 * @param property Property to modify
 * @param value New value to apply
 */
export const propagate = (node: Node, property: string | number, value: any): void => {
  node[property] = value;
  node.childNodes.forEach((child) => propagate(child, property, value));
};

// https://developer.mozilla.org/en-US/docs/Web/API/Node
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
//
// Please note, in this implmentation Node doesn't extend EventTarget.
// This is intentional to reduce the number of classes.

export abstract class Node extends EventTarget {
  [index: string]: any; // TODO(choumx): Remove this typing escape hatch.
  public ownerDocument: Node; // TODO(choumx): Should be a Document.
  // https://drafts.csswg.org/selectors-4/#scoping-root
  public [TransferrableKeys.scopingRoot]: Node;
  public nodeType: NodeType;
  public nodeName: NodeName;
  public childNodes: Node[] = [];
  public parentNode: Node | null = null;
  public isConnected: boolean = false;
  public [TransferrableKeys.index]: number;
  public [TransferrableKeys.transferredFormat]: TransferredNode;
  public [TransferrableKeys.creationFormat]: Array<number>;
  public abstract cloneNode(deep: boolean): Node;

  constructor(nodeType: NodeType, nodeName: NodeName, ownerDocument: Node | null, overrideIndex?: number) {
    super(ownerDocument as Document);
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    this.ownerDocument = ownerDocument || this;
    this[TransferrableKeys.scopingRoot] = this;
    if (process.env.SERVER) {
      return;
    }

    this[TransferrableKeys.index] = overrideIndex ? storeOverrideNodeMapping(this, overrideIndex) : storeNodeMapping(this);
    this[TransferrableKeys.transferredFormat] = [this[TransferrableKeys.index]];
  }

  [TransferrableKeys.serializeAsTransferrableObject](): number[] {
    return [TransferrableObjectType.HTMLElement, this[TransferrableKeys.index]];
  }

  // Unimplemented Properties
  // Node.baseURI – https://developer.mozilla.org/en-US/docs/Web/API/Node/baseURI

  // Unimplemented Methods
  // Node.compareDocumentPosition() – https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
  // Node.getRootNode() – https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode
  // Node.isDefaultNamespace() – https://developer.mozilla.org/en-US/docs/Web/API/Node/isDefaultNamespace
  // Node.isEqualNode() – https://developer.mozilla.org/en-US/docs/Web/API/Node/isEqualNode
  // Node.isSameNode() – https://developer.mozilla.org/en-US/docs/Web/API/Node/isSameNode
  // Node.lookupPrefix() – https://developer.mozilla.org/en-US/docs/Web/API/Node/lookupPrefix
  // Node.lookupNamespaceURI() – https://developer.mozilla.org/en-US/docs/Web/API/Node/lookupNamespaceURI
  // Node.normalize() – https://developer.mozilla.org/en-US/docs/Web/API/Node/normalize

  // Implemented at Element/Text layer
  // Node.nodeValue – https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeValue
  // Node.cloneNode – https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode

  /**
   * Getter returning the text representation of Element.childNodes.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
   * @return text from all childNodes.
   */
  get textContent(): string {
    return this.getTextContent();
  }

  /**
   * Use `this.getTextContent()` instead of `super.textContent` to avoid incorrect or expensive ES5 transpilation.
   */
  protected getTextContent(): string {
    let textContent = '';
    const childNodes = this.childNodes;

    if (childNodes.length) {
      childNodes.forEach((childNode) => (textContent += childNode.textContent));
      return textContent;
    }
    return '';
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/firstChild
   * @return Node's first child in the tree, or null if the node has no children.
   */
  get firstChild(): Node | null {
    return this.childNodes[0] || null;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/lastChild
   * @return The last child of a node, or null if there are no child elements.
   */
  get lastChild(): Node | null {
    return this.childNodes[this.childNodes.length - 1] || null;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling
   * @return node immediately following the specified one in it's parent's childNodes, or null if one doesn't exist.
   */
  get nextSibling(): Node | null {
    if (this.parentNode === null) {
      return null;
    }

    const parentChildNodes = this.parentNode.childNodes;
    return parentChildNodes[parentChildNodes.indexOf(this) + 1] || null;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/previousSibling
   * @return node immediately preceding the specified one in its parent's childNodes, or null if the specified node is the first in that list.
   */
  get previousSibling(): Node | null {
    if (this.parentNode === null) {
      return null;
    }

    const parentChildNodes = this.parentNode.childNodes;
    return parentChildNodes[parentChildNodes.indexOf(this) - 1] || null;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/hasChildNodes
   * @return boolean if the Node has childNodes.
   */
  public hasChildNodes(): boolean {
    return this.childNodes.length > 0;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/contains
   * @param otherNode
   * @return whether a Node is a descendant of a given Node
   */
  public contains(otherNode: Node | null): boolean {
    if (otherNode === this) {
      return true;
    }

    if (this.childNodes.length > 0) {
      if (this.childNodes.includes(this)) {
        return true;
      }
      return this.childNodes.some((child) => child.contains(otherNode));
    }
    return false;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
   * @param child
   * @param referenceNode
   * @return child after it has been inserted.
   */
  public insertBefore(child: Node | null, referenceNode: Node | undefined | null): Node | null {
    if (child === null || child === this) {
      // The new child cannot contain the parent.
      return child;
    }

    if (child.nodeType === NodeType.DOCUMENT_FRAGMENT_NODE) {
      child.childNodes.slice().forEach((node: Node) => this.insertBefore(node, referenceNode));
    } else if (referenceNode == null) {
      // When a referenceNode is not valid, appendChild(child).
      return this.appendChild(child);
    } else if (this.childNodes.indexOf(referenceNode) >= 0) {
      // Should only insertBefore direct children of this Node.
      child.remove();

      // Removing a child can cause this.childNodes to change, meaning we need to splice from its updated location.
      this.childNodes.splice(this.childNodes.indexOf(referenceNode), 0, child);
      this[TransferrableKeys.insertedNode](child);

      mutate(
        this.ownerDocument as Document,
        {
          addedNodes: [child],
          nextSibling: referenceNode,
          type: MutationRecordType.CHILD_LIST,
          target: this,
        },
        [
          TransferrableMutationType.CHILD_LIST,
          this[TransferrableKeys.index],
          referenceNode[TransferrableKeys.index],
          0,
          1,
          0,
          child[TransferrableKeys.index],
        ],
      );

      return child;
    }

    return null;
  }

  /**
   * When a Node is inserted, this method is called (and can be extended by other classes)
   * @param child
   */
  protected [TransferrableKeys.insertedNode](child: Node): void {
    child.parentNode = this;
    propagate(child, 'isConnected', this.isConnected);
    propagate(child, TransferrableKeys.scopingRoot, this[TransferrableKeys.scopingRoot]);
  }

  /**
   * When a node is removed, this method is called (and can be extended by other classes)
   * @param child
   */
  protected [TransferrableKeys.removedNode](child: Node): void {
    child.parentNode = null;
    propagate(child, 'isConnected', false);
    propagate(child, TransferrableKeys.scopingRoot, child);
  }

  /**
   * Adds the specified childNode argument as the last child to the current node.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
   * @param child Child Node to append to this Node.
   * @return Node the appended node.
   */
  public appendChild(child: Node): Node {
    if (child.nodeType === NodeType.DOCUMENT_FRAGMENT_NODE) {
      child.childNodes.slice().forEach(this.appendChild, this);
    } else {
      child.remove();
      this.childNodes.push(child);
      this[TransferrableKeys.insertedNode](child);

      const previousSibling = this.childNodes[this.childNodes.length - 2];
      mutate(
        this.ownerDocument as Document,
        {
          addedNodes: [child],
          previousSibling,
          type: MutationRecordType.CHILD_LIST,
          target: this,
        },
        [
          TransferrableMutationType.CHILD_LIST,
          this[TransferrableKeys.index],
          0,
          previousSibling ? previousSibling[TransferrableKeys.index] : 0,
          1,
          0,
          child[TransferrableKeys.index],
        ],
      );
    }
    return child;
  }

  /**
   * Removes a child node from the current element.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
   * @param child Child Node to remove from this Node.
   * @return Node removed from the tree or null if the node wasn't attached to this tree.
   */
  public removeChild(child: Node): Node | null {
    const index = this.childNodes.indexOf(child);
    const exists = index >= 0;

    if (exists) {
      this.childNodes.splice(index, 1);
      this[TransferrableKeys.removedNode](child);

      mutate(
        this.ownerDocument as Document,
        {
          removedNodes: [child],
          type: MutationRecordType.CHILD_LIST,
          target: this,
        },
        [TransferrableMutationType.CHILD_LIST, this[TransferrableKeys.index], 0, 0, 0, 1, child[TransferrableKeys.index]],
      );

      return child;
    }

    return null;
  }

  /**
   * @param newChild
   * @param oldChild
   * @return child that was replaced.
   * @note `HierarchyRequestError` not handled e.g. newChild is an ancestor of current node.
   * @see https://dom.spec.whatwg.org/#concept-node-replace
   */
  public replaceChild(newChild: Node, oldChild: Node): Node {
    if (
      newChild === oldChild ||
      // In DOM, this throws DOMException: "The node to be replaced is not a child of this node."
      oldChild.parentNode !== this ||
      // In DOM, this throws DOMException: "The new child element contains the parent."
      newChild.contains(this)
    ) {
      return oldChild;
    }
    // If newChild already exists in the DOM, it is first removed.
    // TODO: Consider using a mutation-free API here to avoid two mutations
    // per replaceChild() call.
    newChild.remove();

    const index = this.childNodes.indexOf(oldChild);
    this.childNodes.splice(index, 1, newChild);
    this[TransferrableKeys.removedNode](oldChild);
    this[TransferrableKeys.insertedNode](newChild);

    mutate(
      this.ownerDocument as Document,
      {
        addedNodes: [newChild],
        removedNodes: [oldChild],
        type: MutationRecordType.CHILD_LIST,
        nextSibling: this.childNodes[index + 1],
        target: this,
      },
      [
        TransferrableMutationType.CHILD_LIST,
        this[TransferrableKeys.index],
        this.childNodes[index + 1] ? this.childNodes[index + 1][TransferrableKeys.index] : 0,
        0,
        1,
        1,
        newChild[TransferrableKeys.index],
        oldChild[TransferrableKeys.index],
      ],
    );

    return oldChild;
  }

  /**
   * Replaces the current node with the provided Array<node|string>.
   * @param nodes
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/replaceWith
   */
  public replaceWith(...nodes: Array<Node | string>): void {
    const parent: Node | null = this.parentNode;
    let nodeIterator: number = nodes.length;
    let currentNode: Node | string;
    if (!parent) {
      return;
    }
    if (!nodeIterator) {
      parent.removeChild(this);
    }
    while (nodeIterator--) {
      currentNode = nodes[nodeIterator];

      if (typeof currentNode !== 'object') {
        currentNode = this.ownerDocument.createTextNode(currentNode);
      }

      // TODO: Investigate inserting all new nodes in a single operation.
      if (!nodeIterator) {
        // currentNode is the first argument (currentNode === arguments[0])
        parent.replaceChild(currentNode as Node, this);
      } else {
        parent.insertBefore(currentNode as Node, this.nextSibling);
      }
    }
  }

  /**
   * Removes this Node from the tree it belogs too.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
   */
  public remove(): void {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  }

  parent(): any {
    return this.parentNode;
  }
}
