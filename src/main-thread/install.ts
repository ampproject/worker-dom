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

import { createWorker } from './worker';
import { MutationFromWorker, MessageType, MessageFromWorker } from '../transfer/Messages';
import { prepare as prepareNodes } from './nodes';
import { prepareMutate, mutate } from './mutator';
import { set as setPhase, Phases } from '../transfer/phase';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { WorkerCallbacks } from './callbacks';

const ALLOWABLE_MESSAGE_TYPES = [MessageType.MUTATE, MessageType.HYDRATE];

/**
 * @param baseElement
 * @param authorScriptURL
 * @param workerDOMURL
 * @param callbacks
 * @param sanitizer
 */
export function fetchAndInstall(
  baseElement: HTMLElement,
  authorScriptURL: string,
  workerDOMURL: string,
  callbacks?: WorkerCallbacks,
  sanitizer?: Sanitizer,
): void {
  const fetchPromise = Promise.all([
    // TODO(KB): Fetch Polyfill for IE11.
    fetch(workerDOMURL).then(response => response.text()),
    fetch(authorScriptURL).then(response => response.text()),
    Promise.resolve(authorScriptURL),
  ]);
  install(fetchPromise, baseElement, callbacks, sanitizer);
}

/**
 * @param fetchPromise
 * @param baseElement
 * @param callbacks
 * @param sanitizer
 */
export function install(
  fetchPromise: Promise<[string, string, string]>,
  baseElement: HTMLElement,
  callbacks?: WorkerCallbacks,
  sanitizer?: Sanitizer,
): void {
  prepareNodes(baseElement);
  fetchPromise.then(([workerDOMScript, authorScript, authorScriptURL]) => {
    if (workerDOMScript && authorScript && authorScriptURL) {
      const worker = createWorker(baseElement, workerDOMScript, authorScript, authorScriptURL, callbacks);
      setPhase(Phases.Hydrating);
      prepareMutate(worker, sanitizer);
      worker.onmessage = (message: MessageFromWorker) => {
        const { data } = message;
        const type = data[TransferrableKeys.type];
        if (!ALLOWABLE_MESSAGE_TYPES.includes(type)) {
          return;
        }
        // TODO(KB): Hydration has special rules limiting the types of allowed mutations.
        // Re-introduce Hydration and add a specialized handler.
        mutate(
          (data as MutationFromWorker)[TransferrableKeys.nodes],
          (data as MutationFromWorker)[TransferrableKeys.strings],
          (data as MutationFromWorker)[TransferrableKeys.mutations],
        );
        // Invoke callbacks after hydrate/mutate processing so strings etc. are stored.
        if (callbacks) {
          if (type === MessageType.HYDRATE && callbacks.onHydration) {
            callbacks.onHydration();
          }
          if (callbacks.onReceiveMessage) {
            callbacks.onReceiveMessage(message);
          }
        }
      };
    }
    return null;
  });
}
