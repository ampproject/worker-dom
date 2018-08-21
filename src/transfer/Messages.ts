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

import { TransferrableEvent, TransferrableEventSubscriptionChange } from './TransferrableEvent';
import { TransferrableMutationRecord } from './TransferrableRecord';
import { TransferrableSyncValue } from './TransferrableSyncValue';
import { TransferrableKeys } from './TransferrableKeys';
import { TransferrableNode, HydrateableNode } from './TransferrableNodes';

export const enum MessageType {
  // INIT = 0,
  EVENT = 1,
  HYDRATE = 2,
  MUTATE = 3,
  COMMAND = 4,
  SYNC = 5,
  // NAVIGATION_PUSH_STATE = 5,
  // NAVIGATION_REPLACE_STATE = 6,
  // NAVIGATION_POP_STATE = 7,
}

export interface HydrationFromWorker {
  readonly [TransferrableKeys.type]: MessageType.HYDRATE;
  readonly [TransferrableKeys.strings]: Array<string>;
  readonly [TransferrableKeys.nodes]: HydrateableNode;
  readonly [TransferrableKeys.addedEvents]: Array<TransferrableEventSubscriptionChange>;
}
export interface MutationFromWorker {
  readonly [TransferrableKeys.type]: MessageType.MUTATE;
  readonly [TransferrableKeys.strings]: Array<string>;
  readonly [TransferrableKeys.nodes]: Array<TransferrableNode>;
  readonly [TransferrableKeys.mutations]: Array<TransferrableMutationRecord>;
}
export interface MessageFromWorker {
  data: HydrationFromWorker | MutationFromWorker;
}

export interface EventToWorker {
  [key: number]: MessageType.EVENT | TransferrableEvent;
  [TransferrableKeys.type]: MessageType.EVENT;
  [TransferrableKeys.event]: TransferrableEvent;
}
export interface ValueSyncToWorker {
  [key: number]: MessageType.SYNC | TransferrableSyncValue;
  [TransferrableKeys.type]: MessageType.SYNC;
  [TransferrableKeys.sync]: TransferrableSyncValue;
}
export type MessageToWorker = EventToWorker | ValueSyncToWorker;
