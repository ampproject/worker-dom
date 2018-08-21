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
  public _stop?: boolean = false;
  public _end?: boolean = false;

  constructor(type: string, opts: EventOptions) {
    this.type = type;
    this.bubbles = !!opts.bubbles;
    this.cancelable = !!opts.cancelable;
  }
  public stopPropagation(): void {
    this._stop = true;
  }
  public stopImmediatePropagation(): void {
    this._end = this._stop = true;
  }
  public preventDefault(): void {
    this.defaultPrevented = true;
  }
}
