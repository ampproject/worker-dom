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

import { TransferredNode } from './TransferrableNodes';
import { TransferrableKeys } from './TransferrableKeys';
import { MessageType, EventToWorker } from './Messages';
import { get } from '../worker-thread/nodes';
import { Event } from '../worker-thread/Event';

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
  readonly [TransferrableKeys.target]?: TransferredNode | null;
  readonly [TransferrableKeys.timeStamp]?: number;
  readonly [TransferrableKeys.type]: string;
  readonly [TransferrableKeys.scoped]?: boolean;
  readonly [TransferrableKeys.keyCode]?: number;
}

type TransferrableEventSubscriptionType = number;
type TransferrableEventSubscriptionTarget = number;
type TransferrableEventSubscriptionIdentifer = number;
export type TransferrableEventSubscriptionChange = [
  TransferrableEventSubscriptionType,
  TransferrableEventSubscriptionTarget,
  TransferrableEventSubscriptionIdentifer
];

/**
 * When an event is dispatched from the main thread, it needs to be propagated in the worker thread.
 * Propagate adds an event listener to the worker global scope and uses the WorkerDOM Node.dispatchEvent
 * method to dispatch the transfered event in the worker thread.
 */
export function propagate(): void {
  if (typeof addEventListener !== 'function') {
    return;
  }
  addEventListener('message', ({ data }: { data: EventToWorker }) => {
    if (data[TransferrableKeys.type] !== MessageType.EVENT) {
      return;
    }

    const event = data[TransferrableKeys.event] as TransferrableEvent;
    const node = get(event[TransferrableKeys.index]);
    if (node !== null) {
      const target = event[TransferrableKeys.target];
      node.dispatchEvent(
        Object.assign(
          new Event(event[TransferrableKeys.type], { bubbles: event[TransferrableKeys.bubbles], cancelable: event[TransferrableKeys.cancelable] }),
          {
            cancelBubble: event[TransferrableKeys.cancelBubble],
            defaultPrevented: event[TransferrableKeys.defaultPrevented],
            eventPhase: event[TransferrableKeys.eventPhase],
            isTrusted: event[TransferrableKeys.isTrusted],
            returnValue: event[TransferrableKeys.returnValue],
            target: get(target ? target[0] : null),
            timeStamp: event[TransferrableKeys.timeStamp],
            scoped: event[TransferrableKeys.scoped],
            keyCode: event[TransferrableKeys.keyCode],
          },
        ),
      );
    }
  });
}
