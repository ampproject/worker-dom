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

import { Document } from '../worker-thread/dom/Document';
import { MutationFromWorker } from '../transfer/Messages';
import { TransferrableKeys } from '../transfer/TransferrableKeys';

type Subscriber = (strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) => void;

export interface Emitter {
  once(callback: Subscriber): void;
  subscribe(callback: Subscriber): void;
  unsubscribe(callback: Subscriber): void;
}

/**
 * This has to persist across multiple emitter() calls since
 * mutation transfer state is also stored at the module-level.
 * TODO: Remove this and replace with strings.getForTesting() at call sites.
 */
const strings: Array<string> = [];

/**
 * Stubs `document.postMessage` to invoke callbacks passed to `once()`.
 * @param document
 */
export function emitter(document: Document): Emitter {
  const subscribers: Map<Subscriber, boolean> = new Map();

  function unsubscribe(callback: Subscriber): void {
    subscribers.delete(callback);
  }

  document.postMessage = (message: MutationFromWorker, buffers: Array<ArrayBuffer>) => {
    strings.push(...message[TransferrableKeys.strings]);

    let copy = new Map(subscribers);
    copy.forEach((once, callback) => {
      if (once) {
        unsubscribe(callback);
      }
      callback(strings, message, buffers);
    });
  };
  document[TransferrableKeys.observe]();

  return {
    once(callback: Subscriber): void {
      if (!subscribers.has(callback)) {
        subscribers.set(callback, true);
      }
    },
    subscribe(callback: Subscriber): void {
      if (!subscribers.has(callback)) {
        subscribers.set(callback, false);
      }
    },
    unsubscribe,
  };
}

type ExpectMutationsCallback = (mutations: number[]) => void;

/**
 * Stubs `document.postMessage` to invoke `callback`.
 * @note Use strings.getForTesting() to verify indices of stored strings.
 * @param document
 * @param callback
 */
export const expectMutations = (document: Document, callback: ExpectMutationsCallback): void => {
  document[TransferrableKeys.observe]();
  document.postMessage = (message: MutationFromWorker) => {
    const mutations = Array.from(new Uint16Array(message[TransferrableKeys.mutations]));
    callback(mutations);
  };
};
