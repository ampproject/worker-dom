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
import { MutationRecord } from './MutationRecord';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { Document } from './dom/Document';
import { transfer } from './MutationTransfer';

const observers: MutationObserver[] = [];

let pendingMutations = false;

/**
 * @param observerTarget
 * @param target
 */
const matchesIndex = (observerTarget: Node | null, target: Node): boolean => {
  return !!observerTarget && observerTarget[TransferrableKeys.index] === target[TransferrableKeys.index];
};

/**
 * @param observer
 * @param record
 */
const pushMutation = (observer: MutationObserver, record: MutationRecord): void => {
  observer.pushRecord(record);

  if (!pendingMutations) {
    pendingMutations = true;
    Promise.resolve().then((): void => {
      pendingMutations = false;
      observers.forEach((observer) => observer.callback(observer.takeRecords()));
    });
  }
};

/**
 * @param document
 * @param record
 * @param transferable
 */
export function mutate(document: Document, record: MutationRecord, transferable: Array<number>): void {
  // Post-message `transferable` to the main thread to apply mutations.
  transfer(document, transferable);

  // The MutationRecord is only used for external callers of MutationObserver.
  observers.forEach((observer) => {
    for (let t: Node | null = record.target; t; t = t.parentNode) {
      if (matchesIndex(observer.target, t)) {
        pushMutation(observer, record);
        break;
      }
    }
  });
}

interface MutationObserverInit {
  // None of these init options are supported currently.
  // attributeFilter?: Array<string>;
  // attributeOldValue?: boolean;
  // attributes?: boolean; // Default false
  // characterData?: boolean;
  // characterDataOldValue?: boolean;
  // childList?: boolean;  // Default false
  // subtree?: boolean;    // Default false
}

export class MutationObserver {
  public callback: (mutations: MutationRecord[]) => any;
  private [TransferrableKeys.records]: MutationRecord[] = [];
  public target: Node | null;
  public options: MutationObserverInit;

  constructor(callback: (mutations: MutationRecord[]) => any) {
    this.callback = callback;
  }

  /**
   * Register the MutationObserver instance to observe a Nodes mutations.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
   * @param target Node to observe DOM mutations
   */
  public observe(target: Node, options?: MutationObserverInit): void {
    this.disconnect();
    this.target = target;
    this.options = options || {};

    observers.push(this);
  }

  /**
   * Stop the MutationObserver instance from observing a Nodes mutations.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
   */
  public disconnect(): void {
    this.target = null;

    const index = observers.indexOf(this);
    if (index >= 0) {
      observers.splice(index, 1);
    }
  }

  /**
   * Empties the MutationObserver instance's record queue and returns what was in there.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
   * @return Mutation Records stored on this MutationObserver instance.
   */
  public takeRecords(): MutationRecord[] {
    const records = this[TransferrableKeys.records];
    return records.splice(0, records.length);
  }

  /**
   * NOTE: This method doesn't exist on native MutationObserver.
   * @param record MutationRecord to store for this instance.
   */
  public pushRecord(record: MutationRecord): void {
    this[TransferrableKeys.records].push(record);
  }
}
