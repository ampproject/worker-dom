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

const NODES_ALLOWED_TO_TRANSMIT_TEXT_CONTENT = [NodeType.COMMENT_NODE, NodeType.TEXT_NODE];

// Only used for hydration during worker creation. After hydration, src/main-thread/strings.ts is used.
export const initialStrings: Array<string> = [];
const stringToIndex: Map<string, number> = new Map();
const indexToString: Map<number, string> = new Map();

let count = 0;

function store(value: string): number {
  if (stringToIndex.has(value)) {
    // Safe to cast since we verified the mapping contains the value
    return (stringToIndex.get(value) as number) - 1;
  }
  count += 1;
  stringToIndex.set(value, count);
  indexToString.set(count, value);
  initialStrings.push(value);
  return count - 1;
}

/**
 * Given a index, returns the value of a string used in createHydrateableNode() during worker creation.
 * @param i
 */
export function getHydrateableNodeString(i: number): string {
  return indexToString.get(i) || '';
}

/**
 * Serializes a DOM element for transport to the worker.
 * Relevant strings (e.g. attribute names, values) are replaced with numeric indices for performance (the mapping of index to string is sent separately as `initialStrings`).
 * @param element
 */
export function createHydrateableNode(element: RenderableElement): HydrateableNode {
  let hydrated: HydrateableNode = {
    [TransferrableKeys.index]: element._index_,
    [TransferrableKeys.transferred]: NumericBoolean.FALSE,
    [TransferrableKeys.nodeType]: element.nodeType,
    [TransferrableKeys.nodeName]: store(element.nodeName),
    [TransferrableKeys.childNodes]: [].map.call(element.childNodes || [], (child: RenderableElement) => createHydrateableNode(child)),
    [TransferrableKeys.attributes]: [].map.call(element.attributes || [], (attribute: Attr) => [
      store(attribute.namespaceURI || 'null'),
      store(attribute.name),
      store(attribute.value),
    ]),
  };
  if (element.namespaceURI !== null) {
    hydrated[TransferrableKeys.namespaceURI] = store(element.namespaceURI);
  }
  if (NODES_ALLOWED_TO_TRANSMIT_TEXT_CONTENT.includes(element.nodeType) && (element as Text).textContent !== null) {
    hydrated[TransferrableKeys.textContent] = store(element.textContent as string);
  }
  return hydrated;
}
