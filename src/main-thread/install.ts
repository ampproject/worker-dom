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

import { prepareMutate, mutate } from './mutator';
import { createWorker, fetchAndCreateWorker } from './worker';
import { MutationFromWorker, MessageType, MessageFromWorker } from '../transfer/Messages';
import { prepare as prepareNodes } from './nodes';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { WorkerCallbacks } from './callbacks';

const ALLOWABLE_MESSAGE_TYPES = [MessageType.MUTATE, MessageType.HYDRATE];

/**
 * @param baseElement
 * @param authorURL
 * @param workerDOMUrl
 * @param callbacks
 * @param sanitizer
 */
export function fetchAndInstall(
  baseElement: HTMLElement,
  authorURL: string,
  workerDOMUrl: string,
  callbacks?: WorkerCallbacks,
  sanitizer?: Sanitizer,
): void {
  preinstall_(baseElement);
  fetchAndCreateWorker(baseElement, workerDOMUrl, authorURL, callbacks).then(worker => {
    if (worker) {
      postInstall_(worker, sanitizer, callbacks);
    }
  });
}

/**
 * @param fetchScripts
 * @param baseElement
 * @param callbacks
 * @param sanitizer
 */
export function install(
  fetchScripts: () => Promise<[string, string, string]>,
  baseElement: HTMLElement,
  callbacks?: WorkerCallbacks,
  sanitizer?: Sanitizer,
): void {
  preinstall_(baseElement);
  fetchScripts().then(([workerDOMScript, authorScript, authorScriptURL]) => {
    if (workerDOMScript && authorScript && authorScriptURL) {
      const worker = createWorker(baseElement, workerDOMScript, authorScript, authorScriptURL);
      postInstall_(worker, sanitizer, callbacks);
    }
    return null;
  });
}

/**
 * @param baseElement
 */
function preinstall_(baseElement: HTMLElement): void {
  prepareNodes(baseElement);
}

/**
 * @param worker
 * @param sanitizer
 * @param callbacks
 */
function postInstall_(worker: Worker, sanitizer?: Sanitizer, callbacks?: WorkerCallbacks): void {
  prepareMutate(worker, sanitizer);

  worker.onmessage = (message: MessageFromWorker) => {
    const { data } = message;

    if (!ALLOWABLE_MESSAGE_TYPES.includes(data[TransferrableKeys.type])) {
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
    if (callbacks && callbacks.onReceiveMessage) {
      callbacks.onReceiveMessage(message);
    }
  };
}
