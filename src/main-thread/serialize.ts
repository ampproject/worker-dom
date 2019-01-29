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

function store(value: string, strings: Array<string>, stringMap: Map<string, number>): number {
  if (stringMap.has(value)) {
    // Safe to cast since we verified the mapping contains the value
    return stringMap.get(value) as number;
  }
  const count = strings.length;
  stringMap.set(value, count);
  strings.push(value);

  return count;
}

function createHydrateableNode(element: RenderableElement, strings: Array<string>, stringMap: Map<string, number>): HydrateableNode {
  const hydrated: HydrateableNode = {
    [TransferrableKeys.index]: element._index_,
    [TransferrableKeys.transferred]: NumericBoolean.FALSE,
    [TransferrableKeys.nodeType]: element.nodeType,
    [TransferrableKeys.nodeName]: store(element.nodeName, strings, stringMap),
    [TransferrableKeys.childNodes]: [].map.call(element.childNodes || [], (child: RenderableElement) =>
      createHydrateableNode(child, strings, stringMap),
    ),
    [TransferrableKeys.attributes]: [].map.call(element.attributes || [], (attribute: Attr) => [
      store(attribute.namespaceURI || 'null', strings, stringMap),
      store(attribute.name, strings, stringMap),
      store(attribute.value, strings, stringMap),
    ]),
  };
  if (element.namespaceURI !== null) {
    hydrated[TransferrableKeys.namespaceURI] = store(element.namespaceURI, strings, stringMap);
  }
  if (NODES_ALLOWED_TO_TRANSMIT_TEXT_CONTENT.includes(element.nodeType) && (element as Text).textContent !== null) {
    hydrated[TransferrableKeys.textContent] = store(element.textContent as string, strings, stringMap);
  }
  return hydrated;
}

export function createHydrateableRootNode(element: RenderableElement): { skeleton: HydrateableNode; strings: Array<string> } {
  const strings: Array<string> = [];
  const stringMap: Map<string, number> = new Map();
  const skeleton = createHydrateableNode(element, strings, stringMap);
  return { skeleton, strings };
}
