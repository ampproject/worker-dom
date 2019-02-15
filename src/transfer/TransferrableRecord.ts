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

import { MutationRecordType } from '../worker-thread/MutationRecord';
import { TransferredNode } from './TransferrableNodes';
import { NumericBoolean } from '../utils';

// The TransferrableMutationRecord interface is modification and extension of
// the real MutationRecord, with changes to support the transferring of
// Mutations across threads and for properties (not currently supported by MutationRecord).

// For more info on MutationRecords: https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord

type MutationRecordTarget = number;
type AddedNodeCount = number;
type RemovedNodeCount = number;
type AddedEventCount = number;
type RemovedEventCount = number;
type PreviousSibling = TransferredNode;
type NextSibling = TransferredNode;
type AttributeName = number;
type AttributeNamespace = number;
type PropertyName = number;
type NewValue = number;
type OldValue = number;

export type TransferrableMutationRecords = Array<number>;

export interface TransferrableMutationRecord {
  // readonly [position: number]: number;

  readonly [0]: MutationRecordType;
  readonly [1]: MutationRecordTarget;
  readonly [2]: AddedNodeCount;
  readonly [3]: RemovedNodeCount;
  readonly [4]: AddedEventCount;
  readonly [5]: RemovedEventCount;

  // Optional Values require a numeric boolean to indicate their existance.
  // When a NumericBoolean.FALSE is used, the following readonly value is expected to be 0.

  // Previous Sibling
  readonly [6]: NumericBoolean;
  readonly [7]: PreviousSibling[0];
  // Next Sibling
  readonly [8]: NumericBoolean;
  readonly [9]: NextSibling[0];

  // Attributes and Properties
  readonly [10]: NumericBoolean;
  readonly [11]: AttributeName;
  readonly [12]: NumericBoolean;
  readonly [13]: AttributeNamespace;
  readonly [14]: NumericBoolean;
  readonly [15]: PropertyName;
  // Value for any attribute or property change
  readonly [16]: NewValue;
  readonly [17]: OldValue;

  // Following value 17 is a spread of values, unrepresentable in TypeScript.
  // ...AddedNodes,
  // ...RemovedNodes,
  // ...AddedEvents,
  // ...RemovedEvents,
}

// export interface TransferrableMutationRecord {
//   readonly [TransferrableKeys.type]: MutationRecordType;
//   readonly [TransferrableKeys.target]: number;

//   [TransferrableKeys.addedNodes]?: Array<TransferredNode>;
//   [TransferrableKeys.removedNodes]?: Array<TransferredNode>;
//   [TransferrableKeys.previousSibling]?: TransferredNode;
//   [TransferrableKeys.nextSibling]?: TransferredNode;
//   [TransferrableKeys.attributeName]?: number;
//   [TransferrableKeys.attributeNamespace]?: number;
//   [TransferrableKeys.propertyName]?: number;
//   [TransferrableKeys.value]?: number;
//   [TransferrableKeys.oldValue]?: number;
//   [TransferrableKeys.addedEvents]?: Array<TransferrableEventSubscriptionChange>;
//   [TransferrableKeys.removedEvents]?: Array<TransferrableEventSubscriptionChange>;
// }
