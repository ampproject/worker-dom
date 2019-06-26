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

import { NumericBoolean } from '../utils';
import { TransferrableKeys } from './TransferrableKeys';

export const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
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
  NOTATION_NODE = 12,
}

export interface HydrateableNode {
  readonly [TransferrableKeys.index]: number;
  readonly [TransferrableKeys.transferred]: NumericBoolean;
  readonly [TransferrableKeys.nodeType]: NodeType;
  readonly [TransferrableKeys.localOrNodeName]: number;
  [TransferrableKeys.textContent]?: number;
  [TransferrableKeys.namespaceURI]?: number;
  [TransferrableKeys.attributes]?: Array<[number, number, number]>;
  [TransferrableKeys.childNodes]?: Array<HydrateableNode>;
}

// If a Node has been transferred once already to main thread then we need only pass its index.
export interface TransferredNode {
  readonly [0]: number;
}

export const enum TransferredNodeIndex {
  Index = 0,
}

type TransferrableNodeName = number;
type TransferrableTextContent = number;
type TransferrableNamespaceURI = number;
export interface TransferrableNode extends TransferredNode {
  readonly [1]: NodeType;
  readonly [2]: TransferrableNodeName;

  readonly [3]: TransferrableTextContent;
  readonly [4]: TransferrableNamespaceURI;
}

export const enum TransferrableNodeIndex {
  Index = 0,
  NodeType = 1,
  NodeName = 2,
  TextContent = 3,
  Namespace = 4,
  End = 5,
}
