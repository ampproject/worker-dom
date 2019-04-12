/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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

import { TransferredNode } from './TransferrableNodes';
import { TransferrableKeys } from './TransferrableKeys';

interface TransferrableTouch {
  [key: number]: number;
}
export const enum TransferrableTouchIndex {
  Identifier = 0,
  ScreenX = 1,
  ScreenY = 2,
  ClientX = 3,
  ClientY = 4,
  PageX = 5,
  PageY = 6,
  Target = 7,
}
export interface TransferrableTouchList {
  [key: number]: TransferrableTouch;
}

export interface TransferrableEvent {
  readonly [TransferrableKeys.index]: number;
  readonly [TransferrableKeys.bubbles]?: boolean;
  readonly [TransferrableKeys.cancelable]?: boolean;
  [TransferrableKeys.cancelBubble]?: boolean;
  readonly [TransferrableKeys.currentTarget]?: TransferredNode;
  readonly [TransferrableKeys.defaultPrevented]?: boolean;
  readonly [TransferrableKeys.eventPhase]?: number;
  readonly [TransferrableKeys.isTrusted]?: boolean;
  [TransferrableKeys.returnValue]?: boolean;
  // readonly srcElement: TransferrableTarget | null;
  readonly [TransferrableKeys.target]: TransferredNode | null;
  readonly [TransferrableKeys.timeStamp]?: number;
  readonly [TransferrableKeys.type]: string;
  readonly [TransferrableKeys.scoped]?: boolean;
  readonly [TransferrableKeys.keyCode]?: number;
  readonly [TransferrableKeys.pageX]?: number;
  readonly [TransferrableKeys.pageY]?: number;
  readonly [TransferrableKeys.offsetX]?: number;
  readonly [TransferrableKeys.offsetY]?: number;
  readonly [TransferrableKeys.touches]?: TransferrableTouchList;
  readonly [TransferrableKeys.changedTouches]?: TransferrableTouchList;
}

/**
 * Event Subscription Transfer
 *
 * [
 *   TransferrableMutationType.EVENT_SUBSCRIPTION,
 *   Target.index,
 *   RemoveEventListener.count,
 *   AddEventListener.count,
 *   ...RemoveEvent<[ EventRegistration.type, EventRegistration.index ]>,
 *   ...AddEvent<[ EventRegistration.type, EventRegistration.index ]>,
 * ]
 */
export const enum EventSubscriptionMutationIndex {
  Target = 1,
  RemoveEventListenerCount = 2,
  AddEventListenerCount = 3,
  Events = 4,
  End = 4,
}
export const EVENT_SUBSCRIPTION_LENGTH = 2;
