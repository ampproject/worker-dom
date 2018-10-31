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
import { get as getString } from './strings';

let count: number = 2;
let NODES: Map<number, Node>;
let BASE_ELEMENT: HTMLElement;

/**
 * Called when initializing a Worker, ensures the nodes in baseElement are known
 * for transmission into the Worker and future mutation events from the Worker.
 * @param baseElement Element that will be controlled by a Worker
 */
export function prepare(baseElement: Element): void {
  // The NODES map is populated with two default values pointing to baseElement.
  // These are [document, document.body] from the worker.
  NODES = new Map([[1, baseElement], [2, baseElement]]);
  BASE_ELEMENT = baseElement as HTMLElement;
  // To ensure a lookup works correctly from baseElement
  // add an _index_ equal to the background thread document.body.
  baseElement._index_ = 2;
  // Lastly, it's important while initializing the document that we store
  // the default nodes present in the server rendered document.
  baseElement.childNodes.forEach(node => storeNodes(node));
}

/**
 * Store the requested node and all of its children.
 * @param node node to store.
 */
function storeNodes(node: Node): void {
  storeNode(node, ++count);
  node.childNodes.forEach(node => storeNodes(node));
}

/**
 * Create a real DOM Node from a skeleton Object (`{ nodeType, nodeName, attributes, children, data }`)
 * @example <caption>Text node</caption>
 *   createNode({ nodeType:3, data:'foo' })
 * @example <caption>Element node</caption>
 *   createNode({ nodeType:1, nodeName:'div', attributes:[{ name:'a', value:'b' }], childNodes:[ ... ] })
 */
export function createNode(skeleton: TransferrableNode, sanitizer?: Sanitizer): Node | null {
  if (skeleton[TransferrableKeys.nodeType] === NodeType.TEXT_NODE) {
    const node = document.createTextNode(getString(skeleton[TransferrableKeys.textContent] as number));
    storeNode(node, skeleton[TransferrableKeys._index_]);
    return node as Node;
  }

  const namespace: string | undefined =
    skeleton[TransferrableKeys.namespaceURI] !== undefined ? getString(skeleton[TransferrableKeys.namespaceURI] as number) : undefined;
  const nodeName = getString(skeleton[TransferrableKeys.nodeName]);
  const node: HTMLElement | SVGElement = namespace ? (document.createElementNS(namespace, nodeName) as SVGElement) : document.createElement(nodeName);

  // TODO(KB): Restore Properties
  // skeleton.properties.forEach(property => {
  //   node[`${property.name}`] = property.value;
  // });
  // ((skeleton as TransferrableElement)[TransferrableKeys.childNodes] || []).forEach(childNode => {
  //   if (childNode[TransferrableKeys.transferred] === NumericBoolean.FALSE) {
  //     node.appendChild(createNode(childNode as TransferrableNode));
  //   }
  // });

  // If `node` is removed by the sanitizer, don't store it and return null.
  if (sanitizer && !sanitizer.sanitize(node)) {
    return null;
  }
  storeNode(node, skeleton[TransferrableKeys._index_]);
  return node as Node;
}

/**
 * Returns the real DOM Element corresponding to a serialized Element object.
 * @param id
 * @return Node
 */
export function getNode(id: number): Node {
  const node = NODES.get(id);

  if (node && node.nodeName === 'BODY') {
    // If the node requested is the "BODY"
    // Then we return the base node this specific <amp-script> comes from.
    // This encapsulates each <amp-script> node.
    return BASE_ELEMENT;
  }
  return node as Node;
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
export function storeNode(node: Node, id: number): void {
  (node as Node)._index_ = id;
  NODES.set(id, node as Node);
}
