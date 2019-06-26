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

import { HydrateableNode, NodeType } from '../transfer/TransferrableNodes';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { NumericBoolean } from '../utils';
import { WorkerDOMConfiguration, HydrationFilterPredicate } from './configuration';

const NODES_ALLOWED_TO_TRANSMIT_TEXT_CONTENT = [NodeType.COMMENT_NODE, NodeType.TEXT_NODE];

/**
 * Serializes a DOM element for transport to the worker.
 * @param element
 * @param minimizeString Function for minimizing strings for optimized ferrying across postMessage.
 */
function createHydrateableNode(
  element: RenderableElement,
  minimizeString: (value: string) => number,
  hydrateFilter: HydrationFilterPredicate,
): HydrateableNode {
  const filteredChildNodes = [].slice.call(element.childNodes).filter(hydrateFilter);
  const hydrated: HydrateableNode = {
    [TransferrableKeys.index]: element._index_,
    [TransferrableKeys.transferred]: NumericBoolean.FALSE,
    [TransferrableKeys.nodeType]: element.nodeType,
    [TransferrableKeys.localOrNodeName]: minimizeString(element.localName || element.nodeName),
    [TransferrableKeys.childNodes]: filteredChildNodes.map((child: RenderableElement) => createHydrateableNode(child, minimizeString, hydrateFilter)),
    [TransferrableKeys.attributes]: [].map.call(element.attributes || [], (attribute: Attr) => [
      minimizeString(attribute.namespaceURI || 'null'),
      minimizeString(attribute.name),
      minimizeString(attribute.value),
    ]),
  };
  if (element.namespaceURI != null) {
    hydrated[TransferrableKeys.namespaceURI] = minimizeString(element.namespaceURI);
  }
  if (NODES_ALLOWED_TO_TRANSMIT_TEXT_CONTENT.includes(element.nodeType) && (element as Text).textContent !== null) {
    hydrated[TransferrableKeys.textContent] = minimizeString(element.textContent as string);
  }
  return hydrated;
}

/**
 * @param element
 */
export function createHydrateableRootNode(
  element: RenderableElement,
  config: WorkerDOMConfiguration,
): { skeleton: HydrateableNode; strings: Array<string> } {
  const hydrateFilter: HydrationFilterPredicate = config.hydrateFilter || (() => true);
  const strings: Array<string> = [];
  const stringMap: Map<string, number> = new Map();
  const storeString = (value: string): number => {
    if (stringMap.has(value)) {
      // Safe to cast since we verified the mapping contains the value.
      return stringMap.get(value) as number;
    }
    const count = strings.length;
    stringMap.set(value, count);
    strings.push(value);
    return count;
  };
  const skeleton = createHydrateableNode(element, storeString, hydrateFilter);
  return { skeleton, strings };
}

/**
 * @param element
 */
export function createReadableHydrateableRootNode(element: RenderableElement, config: WorkerDOMConfiguration): HydrateableNode {
  // "Readable" variant doesn't do any string minimization so we can output it for debugging purposes.
  // Note that this intentionally breaks the type contract of createHydrateableNode() and HydrateableNode.
  return createHydrateableNode(element, ((value: string): string => value) as any, config.hydrateFilter || (() => true));
}
