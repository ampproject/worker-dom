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
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { EventToWorker, MessageType } from '../transfer/Messages';
import { TransferrableEvent } from '../transfer/TransferrableEvent';
import { get } from './nodes';

interface EventOptions {
  bubbles?: boolean;
  cancelable?: boolean;
}

export type EventHandler = (event: Event) => any;

export class Event {
  public bubbles: boolean;
  public cancelable: boolean;
  public cancelBubble: boolean;
  public currentTarget: Node;
  public defaultPrevented: boolean;
  public eventPhase: number;
  public isTrusted: boolean;
  public returnValue: boolean;
  // public srcElement: Element | null;
  // TODO(KB): Restore srcElement.
  public target: Node | null;
  public timeStamp: number;
  public type: string;
  public scoped: boolean;
  public [TransferrableKeys.stop]: boolean = false;
  public [TransferrableKeys.end]: boolean = false;

  constructor(type: string, opts: EventOptions) {
    this.type = type;
    this.bubbles = !!opts.bubbles;
    this.cancelable = !!opts.cancelable;
  }
  public stopPropagation(): void {
    this[TransferrableKeys.stop] = true;
  }
  public stopImmediatePropagation(): void {
    this[TransferrableKeys.end] = this[TransferrableKeys.stop] = true;
  }
  public preventDefault(): void {
    this.defaultPrevented = true;
  }
}

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
      const target =
        event[TransferrableKeys.target] !== null
          ? get((event[TransferrableKeys.target] as [number])[0] === 0 ? 1 : (event[TransferrableKeys.target] as [number])[0])
          : null;
      node.dispatchEvent(
        Object.assign(
          new Event(event[TransferrableKeys.type], { bubbles: event[TransferrableKeys.bubbles], cancelable: event[TransferrableKeys.cancelable] }),
          {
            cancelBubble: event[TransferrableKeys.cancelBubble],
            defaultPrevented: event[TransferrableKeys.defaultPrevented],
            eventPhase: event[TransferrableKeys.eventPhase],
            isTrusted: event[TransferrableKeys.isTrusted],
            returnValue: event[TransferrableKeys.returnValue],
            target: target,
            timeStamp: event[TransferrableKeys.timeStamp],
            scoped: event[TransferrableKeys.scoped],
            keyCode: event[TransferrableKeys.keyCode],
          },
        ),
      );
    }
  });
}
