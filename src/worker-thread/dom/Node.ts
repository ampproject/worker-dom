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

import { store as storeNodeMapping } from '../NodeMapping';
import { Event, EventHandler } from '../Event';
import { toLower } from '../../utils';
import { mutate } from '../MutationObserver';
import { MutationRecordType } from '../MutationRecord';
import { TransferredNode, TransferrableNode, HydrateableNode } from '../../transfer/TransferrableNodes';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { store as storeString } from '../StringMapping';

export const enum NodeType {
  ELEMENT_NODE = 1,
  ATTRIBUTE_NODE = 2,
  TEXT_NODE = 3,
  CDATA_SECTION_NODE = 4,
  ENTITY_REFERENCE_NODE = 5,
  ENTITY_NODE = 6,
  PROCESSING_INSTRUCTION_NODE = 7,
  COMMENT_NODE = 8,
  DOCUMENT_NODE = 9,
  DOCUMENT_TYPE_NODE = 10,
  DOCUMENT_FRAGMENT_NODE = 11,
  // Note: DOCUMENT_FRAGMENT_NODE is not supported in this implementation yet.
  NOTATION_NODE = 12,
}
export type NodeName = '#comment' | '#document' | '#document-fragment' | '#text' | string;
export type NamespaceURI = string | null;

export let globalDocument: Node | null = null;

/**
 * Propagates a property change for a Node to itself and all childNodes.
 * @param node Node to start applying change to
 * @param property Property to modify
 * @param value New value to apply
 */
const propagate = (node: Node, property: string, value: any): void => {
  node[property] = value;
  node.childNodes.forEach(child => propagate(child, property, value));
};

// https://developer.mozilla.org/en-US/docs/Web/API/Node
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
//
// Please note, in this implmentation Node doesn't extend EventTarget.
// This is intentional to reduce the number of classes.

export abstract class Node {
  [index: string]: any;
  public ownerDocument: Node;
  public nodeType: NodeType;
  public nodeName: NodeName;
  public childNodes: Node[] = [];
  public parentNode: Node | null = null;
  public isConnected: boolean = false;
  public _index_: number;
  public _transferredFormat_: TransferredNode;
  public _creationFormat_: TransferrableNode;
  public abstract hydrate(): HydrateableNode;
  private _handlers_: {
    [index: string]: EventHandler[];
  } = {};

  constructor(nodeType: NodeType, nodeName: NodeName) {
    this.nodeType = nodeType;
    this.nodeName = nodeName;

    // The first Node created is the global document.
    if (globalDocument === null) {
      globalDocument = this;
    }
    this.ownerDocument = globalDocument;

    this._index_ = storeNodeMapping(this);
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
    let textContent = '';
    const childNodes = this.childNodes;

    if (childNodes.length) {
      childNodes.forEach(childNode => (textContent += childNode.textContent));
      return textContent;
    }
    return '';
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/firstChild
   * @return Node's first child in the tree, or null if the node has no children.
   */
  get firstChild(): Node | null {
    return this.childNodes.length > 0 ? this.childNodes[0] : null;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/lastChild
   * @return The last child of a node, or null if there are no child elements.
   */
  get lastChild(): Node | null {
    return this.childNodes.length > 0 ? this.childNodes[this.childNodes.length - 1] : null;
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
    if (this.childNodes.length > 0) {
      if (this.childNodes.includes(this)) {
        return true;
      }
      return this.childNodes.some(child => child.contains(otherNode));
    }

    return otherNode === this;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
   * @param child
   * @param referenceNode
   * @return child after it has been inserted.
   */
  public insertBefore(child: Node | null, referenceNode: Node | undefined | null): Node | null {
    if (child === null) {
      return null;
    }

    if (child === this) {
      // The new child cannot contain the parent.
      return child;
    }

    if (referenceNode == null) {
      // When a referenceNode is not valid, appendChild(child).
      this.appendChild(child);
      mutate({
        addedNodes: [child],
        type: MutationRecordType.CHILD_LIST,
        target: this,
      });
      return child;
    }

    if (this.childNodes.indexOf(referenceNode) >= 0) {
      // Should only insertBefore direct children of this Node.
      child.remove();

      // Removing a child can cause this.childNodes to change, meaning we need to splice from its updated location.
      this.childNodes.splice(this.childNodes.indexOf(referenceNode), 0, child);
      child.parentNode = this;
      propagate(child, 'isConnected', this.isConnected);
      mutate({
        addedNodes: [child],
        nextSibling: referenceNode,
        type: MutationRecordType.CHILD_LIST,
        target: this,
      });

      return child;
    }

    return null;
  }

  /**
   * Adds the specified childNode argument as the last child to the current node.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
   * @param child Child Node to append to this Node.
   */
  public appendChild(child: Node): void {
    child.remove();
    child.parentNode = this;
    propagate(child, 'isConnected', this.isConnected);
    this.childNodes.push(child);

    mutate({
      addedNodes: [child],
      previousSibling: this.childNodes[this.childNodes.length - 2],
      type: MutationRecordType.CHILD_LIST,
      target: this,
    });
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
      child.parentNode = null;
      propagate(child, 'isConnected', false);
      this.childNodes.splice(index, 1);
      mutate({
        removedNodes: [child],
        type: MutationRecordType.CHILD_LIST,
        target: this,
      });

      return child;
    }

    return null;
  }

  // TODO(KB): Verify behaviour.
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/replaceChild
   * @param newChild new Node to replace old Node.
   * @param oldChild existing Node to be replaced.
   * @return child that was replaced.
   */
  public replaceChild(newChild: Node, oldChild: Node): Node {
    if (newChild !== oldChild) {
      const index = this.childNodes.indexOf(oldChild);
      if (index >= 0) {
        oldChild.parentNode = null;
        propagate(oldChild, 'isConnected', false);
        this.childNodes.splice(index, 1, newChild);

        mutate({
          addedNodes: [newChild],
          removedNodes: [oldChild],
          type: MutationRecordType.CHILD_LIST,
          target: this,
        });
      }
    }

    return oldChild;
  }

  /**
   * Removes this Node from the tree it belogs too.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
   */
  public remove(): void {
    this.parentNode && this.parentNode.removeChild(this);
  }

  /**
   * Add an event listener to callback when a specific event type is dispatched.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
   * @param type Event Type (i.e 'click')
   * @param handler Function called when event is dispatched.
   */
  public addEventListener(type: string, handler: EventHandler): void {
    const handlers: EventHandler[] = this._handlers_[toLower(type)];
    let index: number = 0;
    if (handlers && handlers.length > 0) {
      index = handlers.push(handler);
    } else {
      this._handlers_[toLower(type)] = [handler];
    }

    mutate({
      target: this,
      type: MutationRecordType.COMMAND,
      addedEvents: [
        {
          [TransferrableKeys.type]: storeString(type),
          [TransferrableKeys._index_]: this._index_,
          [TransferrableKeys.index]: index,
        },
      ],
    });
  }

  /**
   * Remove a registered event listener for a specific event type.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
   * @param type Event Type (i.e 'click')
   * @param handler Function to stop calling when event is dispatched.
   */
  public removeEventListener(type: string, handler: EventHandler): void {
    const handlers = this._handlers_[toLower(type)];
    const index = !!handlers ? handlers.indexOf(handler) : -1;

    if (index >= 0) {
      handlers.splice(index, 1);
      mutate({
        target: this,
        type: MutationRecordType.COMMAND,
        removedEvents: [
          {
            [TransferrableKeys.type]: storeString(type),
            [TransferrableKeys._index_]: this._index_,
            [TransferrableKeys.index]: index,
          },
        ],
      });
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
      handlers = target && target._handlers_ && target._handlers_[toLower(event.type)];
      if (handlers) {
        for (iterator = handlers.length; iterator--; ) {
          if ((handlers[iterator].call(target, event) === false || event._end) && event.cancelable) {
            break;
          }
        }
      }
    } while (event.bubbles && !(event.cancelable && event._stop) && (target = target && target.parentNode));
    return !event.defaultPrevented;
  }
}
