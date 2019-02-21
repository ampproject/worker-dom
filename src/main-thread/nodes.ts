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

import { TransferrableNode, NodeType } from '../transfer/TransferrableNodes';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { Strings } from './strings';

export class NodeContext {
  baseElement_: HTMLElement;
  strings_: Strings;
  count_: number;
  nodes_: Map<number, Node>;

  /**
   * Called when initializing a Worker, ensures the nodes in baseElement are
   * known for transmission into the Worker and future mutation events from the
   * Worker.
   * @param baseElement Element that will be controlled by a Worker
   */
  constructor(strings: Strings, baseElement: Element) {
    this.count_ = 2;
    this.strings_ = strings;

    // The nodes_ map is populated with two default values pointing to
    // baseElement.
    // These are [document, document.body] from the worker.
    this.nodes_ = new Map([[1, baseElement], [2, baseElement]]);
    this.baseElement_ = baseElement as HTMLElement;
    // To ensure a lookup works correctly from baseElement
    // add an index equal to the background thread document.body.
    baseElement._index_ = 2;
    // Lastly, it's important while initializing the document that we store
    // the default nodes present in the server rendered document.
    baseElement.childNodes.forEach(n => this.storeNodes_(n));
  }

  getBaseElement(): HTMLElement {
    return this.baseElement_;
  }

  /**
   * Create a real DOM Node from a skeleton Object (`{ nodeType, nodeName, attributes, children, data }`)
   * @example <caption>Text node</caption>
   *   nodeContext.createNode({ nodeType:3, data:'foo' })
   * @example <caption>Element node</caption>
   *   nodeContext.createNode({ nodeType:1, nodeName:'div', attributes:[{ name:'a', value:'b' }], childNodes:[ ... ] })
   */
  createNode(skeleton: TransferrableNode, sanitizer?: Sanitizer): Node | null {
    let node: Node;
    if (skeleton[TransferrableKeys.nodeType] === NodeType.TEXT_NODE) {
      node = document.createTextNode(this.strings_.get(skeleton[TransferrableKeys.textContent] as number));
    } else if (skeleton[TransferrableKeys.nodeType] === NodeType.DOCUMENT_FRAGMENT_NODE) {
      node = document.createDocumentFragment();
    } else {
      const namespace =
        skeleton[TransferrableKeys.namespaceURI] !== undefined ? this.strings_.get(skeleton[TransferrableKeys.namespaceURI] as number) : undefined;
      const nodeName = this.strings_.get(skeleton[TransferrableKeys.nodeName]);
      node = namespace ? document.createElementNS(namespace, nodeName) : document.createElement(nodeName);

      // TODO(KB): Restore Properties
      // skeleton.properties.forEach(property => {
      //   node[`${property.name}`] = property.value;
      // });
      // ((skeleton as TransferrableElement)[TransferrableKeys.childNodes] || []).forEach(childNode => {
      //   if (childNode[TransferrableKeys.transferred] === NumericBoolean.FALSE) {
      //     node.appendChild(this.createNode(childNode as TransferrableNode));
      //   }
      // });

      // If `node` is removed by the sanitizer, don't store it and return null.
      if (sanitizer && !sanitizer.sanitize(node)) {
        return null;
      }
    }

    this.storeNode_(node, skeleton[TransferrableKeys.index]);
    return node;
  }

  /**
   * Returns the real DOM Element corresponding to a serialized Element object.
   * @param id
   * @return RenderableElement | null
   */
  getNode(id: number): RenderableElement | null {
    const node = this.nodes_.get(id);

    if (node && node.nodeName === 'BODY') {
      // If the node requested is the "BODY"
      // Then we return the base node this specific <amp-script> comes from.
      // This encapsulates each <amp-script> node.
      return this.baseElement_ as RenderableElement;
    }
    return node as RenderableElement;
  }

  /**
   * Store the requested node and all of its children.
   * @param node node to store.
   */
  storeNodes_(node: Node): void {
    this.storeNode_(node, ++this.count_);
    node.childNodes.forEach(n => this.storeNodes_(n));
  }

  /**
   * Establish link between DOM `node` and worker-generated identifier `id`.
   *
   * These _shouldn't_ collide between instances of <amp-script> since
   * each element creates it's own pool on both sides of the worker
   * communication bridge.
   * @param node
   * @param id
   */
  storeNode_(node: Node, id: number): void {
    (node as Node)._index_ = id;
    this.nodes_.set(id, node as Node);
  }
}
