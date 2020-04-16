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

/**
 * @fileoverview
 * WorkerDOM's `Event` class. `CustomEvent` is available natively in web worker.
 */

import { Node } from './dom/Node';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { EventToWorker, MessageType } from '../transfer/Messages';
import { TransferrableEvent, TransferrableTouchList } from '../transfer/TransferrableEvent';
import { get } from './nodes';
import { Document } from './dom/Document';
import { TransferredNode } from '../transfer/TransferrableNodes';
import { WorkerDOMGlobalScope } from './WorkerDOMGlobalScope';

interface EventOptions {
  bubbles?: boolean;
  cancelable?: boolean;
}

export type EventHandler = (event: Event) => any;

export interface AddEventListenerOptions {
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
  workerDOMPreventDefault?: boolean;
}

interface Touch {
  readonly identifier: number;
  readonly screenX: number;
  readonly screenY: number;
  readonly clientX: number;
  readonly clientY: number;
  readonly pageX: number;
  readonly pageY: number;
  readonly target: Node | null;
}
interface TouchList {
  [key: number]: Touch;
  length: number;
  item: (index: number) => Touch | null;
}

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
  public pageX?: number;
  public pageY?: number;
  public offsetX?: number;
  public offsetY?: number;
  public touches?: TouchList;
  public changedTouches?: TouchList;

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
  /** Event.initEvent() is deprecated but supported here for legacy usage.  */
  public initEvent(type: string, bubbles: boolean, cancelable: boolean) {
    this.type = type;
    this.bubbles = bubbles;
    this.cancelable = cancelable;
  }
}

/**
 * Determine the target for a TransferrableEvent.
 * @param document Event intended within the scope of this document.
 * @param event
 */
const targetFromTransfer = (document: Document, event: TransferrableEvent): Node | null => {
  if (event[TransferrableKeys.target] !== null) {
    const index = (event[TransferrableKeys.target] as TransferredNode)[0];
    // If the target was sent as index 0, use the current document.
    return get(index !== 0 ? index : document[TransferrableKeys.index]);
  }
  return null;
};

/**
 *
 * @param document
 * @param event
 */
const touchListFromTransfer = (
  document: Document,
  event: TransferrableEvent,
  key: TransferrableKeys.touches | TransferrableKeys.changedTouches,
): TouchList | undefined => {
  if (event[key] !== undefined) {
    const touchListKeys = Object.keys(event[key] as TransferrableTouchList);
    const list: TouchList = {
      length: touchListKeys.length,
      item(index: number) {
        return this[index] || null;
      },
    };

    touchListKeys.forEach((touchListKey) => {
      const numericKey = Number(touchListKey);
      const transferredTouch = (event[key] as TransferrableTouchList)[numericKey];
      list[numericKey] = {
        identifier: transferredTouch[0],
        screenX: transferredTouch[1],
        screenY: transferredTouch[2],
        clientX: transferredTouch[3],
        clientY: transferredTouch[4],
        pageX: transferredTouch[5],
        pageY: transferredTouch[6],
        target: get(transferredTouch[7] !== 0 ? transferredTouch[7] : document[TransferrableKeys.index]),
      };
    });

    return list;
  }
  return undefined;
};

/**
 * When an event is dispatched from the main thread, it needs to be propagated in the worker thread.
 * Propagate adds an event listener to the worker global scope and uses the WorkerDOM Node.dispatchEvent
 * method to dispatch the transfered event in the worker thread.
 */
export function propagate(global: WorkerDOMGlobalScope): void {
  const document = global.document;
  if (!document.addGlobalEventListener) {
    return;
  }
  document.addGlobalEventListener('message', ({ data }: { data: EventToWorker }) => {
    if (data[TransferrableKeys.type] !== MessageType.EVENT) {
      return;
    }
    const event = data[TransferrableKeys.event] as TransferrableEvent;
    const node = get(event[TransferrableKeys.index]);
    if (node !== null) {
      node.dispatchEvent(
        Object.assign(
          new Event(event[TransferrableKeys.type], {
            bubbles: event[TransferrableKeys.bubbles],
            cancelable: event[TransferrableKeys.cancelable],
          }),
          {
            cancelBubble: event[TransferrableKeys.cancelBubble],
            defaultPrevented: event[TransferrableKeys.defaultPrevented],
            eventPhase: event[TransferrableKeys.eventPhase],
            isTrusted: event[TransferrableKeys.isTrusted],
            returnValue: event[TransferrableKeys.returnValue],
            target: targetFromTransfer(global.document, event),
            timeStamp: event[TransferrableKeys.timeStamp],
            scoped: event[TransferrableKeys.scoped],
            keyCode: event[TransferrableKeys.keyCode],
            pageX: event[TransferrableKeys.pageX],
            pageY: event[TransferrableKeys.pageY],
            offsetX: event[TransferrableKeys.offsetX],
            offsetY: event[TransferrableKeys.offsetY],
            touches: touchListFromTransfer(global.document, event, TransferrableKeys.touches),
            changedTouches: touchListFromTransfer(global.document, event, TransferrableKeys.changedTouches),
          },
        ),
      );
    }
  });
}
