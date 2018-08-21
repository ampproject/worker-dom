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
import { MessageToWorker, MessageType } from './Messages';
import { get } from '../worker-thread/NodeMapping';
import { Event } from '../worker-thread/Event';

type TransferrableTarget = TransferredNode;

export interface TransferrableEvent {
  readonly [TransferrableKeys._index_]: number;
  readonly [TransferrableKeys.bubbles]?: boolean;
  readonly [TransferrableKeys.cancelable]?: boolean;
  [TransferrableKeys.cancelBubble]?: boolean;
  readonly [TransferrableKeys.currentTarget]?: TransferrableTarget;
  readonly [TransferrableKeys.defaultPrevented]?: boolean;
  readonly [TransferrableKeys.eventPhase]?: number;
  readonly [TransferrableKeys.isTrusted]?: boolean;
  [TransferrableKeys.returnValue]?: boolean;
  // readonly srcElement: TransferrableTarget | null;
  readonly [TransferrableKeys.target]?: TransferrableTarget | null;
  readonly [TransferrableKeys.timeStamp]?: number;
  readonly [TransferrableKeys.type]: string;
  readonly [TransferrableKeys.scoped]?: boolean;
  readonly [TransferrableKeys.keyCode]?: number;
}

export interface TransferrableEventSubscriptionChange {
  readonly [TransferrableKeys.type]: number;
  readonly [TransferrableKeys._index_]: number;
  readonly [TransferrableKeys.index]: number;
}

/**
 * When an event is dispatched from the main thread, it needs to be propagated in the worker thread.
 * Propagate adds an event listener to the worker global scope and uses the WorkerDOM Node.dispatchEvent
 * method to dispatch the transfered event in the worker thread.
 */
export function propagate(): void {
  if (typeof addEventListener !== 'undefined') {
    addEventListener('message', ({ data }: { data: MessageToWorker }) => {
      if (data[TransferrableKeys.type] !== MessageType.EVENT) {
        return;
      }

      const event = data[TransferrableKeys.event] as TransferrableEvent;
      const node = get(event[TransferrableKeys._index_]);
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
              target: get(target ? target[TransferrableKeys._index_] : null),
              timeStamp: event[TransferrableKeys.timeStamp],
              scoped: event[TransferrableKeys.scoped],
              keyCode: event[TransferrableKeys.keyCode],
            },
          ),
        );
      }
    });
  }
}
