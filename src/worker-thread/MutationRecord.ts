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

import { Node } from './dom/Node';

// MutationRecord interface is modification and extension of the spec version.
// It supports capturing property changes.
// @see https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord
export interface MutationRecord {
  readonly target: Node;
  readonly addedNodes?: Array<Node>;
  readonly removedNodes?: Array<Node>;
  readonly previousSibling?: Node | null;
  readonly nextSibling?: Node | null;
  readonly attributeName?: string | null;
  readonly attributeNamespace?: string | null;
  readonly oldValue?: string | null;

  // MutationRecord Extensions
  readonly type: MutationRecordType;
  readonly value?: string | null;
}

// Add a new types of MutationRecord to capture changes not normally reported by MutationObserver on Nodes.
// 1. PROPERTIES to enable capture of Node.property changes
// 2. COMMAND to enable capture of requests for data for Worker from Main Thread
export const enum MutationRecordType {
  ATTRIBUTES = 0,
  CHARACTER_DATA = 1,
  CHILD_LIST = 2,
}
