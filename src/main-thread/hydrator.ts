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

import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { HydrateableNode } from '../transfer/TransferrableNodes';
import { TransferrableEventSubscriptionChange } from '../transfer/TransferrableEvent';
import { storeNode, getNode, createNode, isTextNode } from './nodes';
import { storeString, getString } from './strings';
import { RenderableElement } from './RenderableElement';
import { applyDefaultChangeListener, processListenerChange } from './command';

function allTextNodes(nodes: NodeList | Array<HydrateableNode>): boolean {
  return nodes.length > 0 && [].every.call(nodes, isTextNode);
}

/**
 * Replace all the children with the ones from the HydrateableNode.
 * Used when we're certain the content won't break the page.
 * @param nodes HydrateableNodes containing content to potentially overwrite main thread content.
 * @param parent Node in the main thread that will be the parent of the passed nodes.
 * @param worker worker that issued the request for hydration.
 */
function replaceNodes(nodes: Array<HydrateableNode>, parent: HTMLElement, worker: Worker): void {
  [].forEach.call(parent.childNodes, (childNode: Element | Text) => childNode.remove());
  nodes.forEach((node, index) => {
    const newNode: RenderableElement = createNode(node);
    (node[TransferrableKeys.attributes] || []).forEach(attribute => {
      const namespaceURI = getString(attribute[0]);
      if (namespaceURI !== 'null') {
        newNode.setAttributeNS(namespaceURI, getString(attribute[1]), getString(attribute[2]));
      } else {
        newNode.setAttribute(getString(attribute[1]), getString(attribute[2]));
      }
    });
    parent.appendChild(newNode);
    applyDefaultChangeListener(worker, newNode as RenderableElement);

    replaceNodes(node[TransferrableKeys.childNodes] || [], parent.childNodes[index] as HTMLElement, worker);
  });
}

/**
 * Hydrate a single node and it's children safely.
 * Attempt to ensure content is a rough match so content doesn't shift between the document representation
 * and client side generated content.
 * @param transferNode root of the background thread content (document.body from worker-thread).
 * @param node root for the foreground thread content (element upgraded to background driven).
 * @param worker worker that issued the request for hydration.
 */
function hydrateNode(transferNode: HydrateableNode, node: HTMLElement | Text, worker: Worker): void {
  const transferIsText = isTextNode(transferNode);
  const nodeIsText = isTextNode(node);
  if (!transferIsText && !nodeIsText) {
    const childNodes = transferNode[TransferrableKeys.childNodes] || [];
    if (childNodes.length !== node.childNodes.length) {
      // If this parent node has an unequal number of childNodes, we need to ensure its for an allowable reason.
      if (allTextNodes(childNodes) && allTextNodes(node.childNodes)) {
        // Offset due to a differing number of text nodes.
        // replace the current DOM with the text nodes from the hydration.
        replaceNodes(childNodes, node as HTMLElement, worker);
      } else {
        const filteredTransfer = childNodes.filter(childNode => !isTextNode(childNode));
        const filteredNodes = [].filter.call(node.childNodes, (childNode: Node) => !isTextNode(childNode));
        // Empty text nodes are used by frameworks as placeholders for future dom content.
        if (filteredTransfer.length === filteredNodes.length) {
          storeNode(node, transferNode[TransferrableKeys._index_]);
          replaceNodes(childNodes, node as HTMLElement, worker);
        }
      }
    } else {
      storeNode(node, transferNode[TransferrableKeys._index_]);
      applyDefaultChangeListener(worker, node as RenderableElement);
      // Same number of children, hydrate them.
      childNodes.forEach((childNode, index) => hydrateNode(childNode, node.childNodes[index] as HTMLElement | Text, worker));
    }
  } else if (transferIsText && nodeIsText) {
    // Singular text node, no children.
    storeNode(node, transferNode[TransferrableKeys._index_]);
    node.textContent = getString(transferNode[TransferrableKeys.textContent] as number);
    applyDefaultChangeListener(worker, node as RenderableElement);
  }
}

/**
 * Hydrate a root from the worker thread by comparing with the main thread representation.
 * @param skeleton root of the background thread content.
 * @param addEvents events needing subscription from the background thread content.
 * @param baseElement root of the main thread content to compare against.
 * @param worker worker issuing the upgrade request.
 */
export function hydrate(
  skeleton: HydrateableNode,
  stringValues: Array<string>,
  addEvents: Array<TransferrableEventSubscriptionChange>,
  baseElement: HTMLElement,
  worker: Worker,
) {
  // Process String Additions
  stringValues.forEach(value => storeString(value));
  // Process Node Addition / Removal
  hydrateNode(skeleton, baseElement, worker);
  // Process Event Addition
  addEvents.forEach(event => {
    const node = getNode(event[TransferrableKeys._index_]);
    node && processListenerChange(worker, node, true, getString(event[TransferrableKeys.type]), event[TransferrableKeys.index]);
  });
}
