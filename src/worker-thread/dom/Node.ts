/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { store as storeNodeMapping, storeOverride as storeOverrideNodeMapping } from '../nodes';
import { Event, EventHandler, AddEventListenerOptions } from '../Event';
import { toLower } from '../../utils';
import { mutate } from '../MutationObserver';
import { MutationRecordType } from '../MutationRecord';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { store as storeString } from '../strings';
import { Document } from './Document';
import { transfer } from '../MutationTransfer';
import { TransferredNode, NodeType } from '../../transfer/TransferrableNodes';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';

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

export abstract class Node {
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
  private [TransferrableKeys.handlers]: {
    [index: string]: EventHandler[];
  } = {};

  constructor(nodeType: NodeType, nodeName: NodeName, ownerDocument: Node | null, overrideIndex?: number) {
    this.nodeType = nodeType;
    this.nodeName = nodeName;

    this.ownerDocument = ownerDocument || this;
    this[TransferrableKeys.scopingRoot] = this;

    this[TransferrableKeys.index] = overrideIndex ? storeOverrideNodeMapping(this, overrideIndex) : storeNodeMapping(this);
    this[TransferrableKeys.transferredFormat] = [this[TransferrableKeys.index]];
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
   * Removes this Node from the tree it belogs too.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
   */
  public remove(): void {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  }

  /**
   * Add an event listener to callback when a specific event type is dispatched.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
   * @param type Event Type (i.e 'click')
   * @param handler Function called when event is dispatched.
   */
  public addEventListener(type: string, handler: EventHandler, options: AddEventListenerOptions | undefined = {}): void {
    const lowerType = toLower(type);
    const storedType = storeString(lowerType);
    const handlers: EventHandler[] = this[TransferrableKeys.handlers][lowerType];
    let index: number = 0;
    if (handlers) {
      index = handlers.push(handler);
    } else {
      this[TransferrableKeys.handlers][lowerType] = [handler];
    }

    transfer(this.ownerDocument as Document, [
      TransferrableMutationType.EVENT_SUBSCRIPTION,
      this[TransferrableKeys.index],
      0,
      1,
      storedType,
      index,
      Number(Boolean(options.capture)),
      Number(Boolean(options.once)),
      Number(Boolean(options.passive)),
      Number(Boolean(options.workerDOMPreventDefault)),
    ]);
  }

  /**
   * Remove a registered event listener for a specific event type.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
   * @param type Event Type (i.e 'click')
   * @param handler Function to stop calling when event is dispatched.
   */
  public removeEventListener(type: string, handler: EventHandler): void {
    const lowerType = toLower(type);
    const handlers = this[TransferrableKeys.handlers][lowerType];
    const index = !!handlers ? handlers.indexOf(handler) : -1;

    if (index >= 0) {
      handlers.splice(index, 1);
      transfer(this.ownerDocument as Document, [
        TransferrableMutationType.EVENT_SUBSCRIPTION,
        this[TransferrableKeys.index],
        1,
        0,
        storeString(lowerType),
        index,
      ]);
    }
  }

  /**
   * Dispatch an event for this Node.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
   * @param event Event to dispatch to this node and potentially cascade to parents.
   */
  public dispatchEvent(event: Event): boolean {
    let target: Node | null = (event.currentTarget = this);
    let handlers: EventHandler[] | null;
    let iterator: number;

    do {
      handlers = target && target[TransferrableKeys.handlers] && target[TransferrableKeys.handlers][toLower(event.type)];
      if (handlers) {
        for (iterator = handlers.length; iterator--; ) {
          if ((handlers[iterator].call(target, event) === false || event[TransferrableKeys.end]) && event.cancelable) {
            break;
          }
        }
      }
    } while (event.bubbles && !(event.cancelable && event[TransferrableKeys.stop]) && (target = target && target.parentNode));
    return !event.defaultPrevented;
  }
}
