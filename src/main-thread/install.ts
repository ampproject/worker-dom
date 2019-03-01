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

import { DebuggingContext } from './debugging';
import { MutationFromWorker, MessageType, MessageFromWorker } from '../transfer/Messages';
import { MutatorProcessor } from './mutator';
import { NodeContext } from './nodes';
import { Strings } from './strings';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { TransferrablePhase } from '../transfer/TransferrablePhase';
import { WorkerCallbacks } from './callbacks';
import { WorkerContext } from './worker';

const ALLOWABLE_MESSAGE_TYPES = [MessageType.MUTATE, MessageType.HYDRATE];

/**
 * @param baseElement
 * @param authorScriptURL
 * @param workerDOMURL
 * @param callbacks
 * @param sanitizer
 * @param debug
 */
export function fetchAndInstall(
  baseElement: HTMLElement,
  authorScriptURL: string,
  workerDOMURL: string,
  callbacks?: WorkerCallbacks,
  sanitizer?: Sanitizer,
  debug?: boolean,
): void {
  const fetchPromise = Promise.all([
    // TODO(KB): Fetch Polyfill for IE11.
    fetch(workerDOMURL).then(response => response.text()),
    fetch(authorScriptURL).then(response => response.text()),
    Promise.resolve(authorScriptURL),
  ]);
  install(fetchPromise, baseElement, callbacks, sanitizer, debug);
}

/**
 * @param fetchPromise
 * @param baseElement
 * @param callbacks
 * @param sanitizer
 * @param debug
 */
export function install(
  fetchPromise: Promise<[string, string, string]>,
  baseElement: HTMLElement,
  callbacks?: WorkerCallbacks,
  sanitizer?: Sanitizer,
  debug?: boolean,
): void {
  const strings = new Strings();
  const nodeContext = new NodeContext(strings, baseElement);
  if (debug) {
    const debuggingContext = new DebuggingContext(strings, nodeContext);
    callbacks = wrapCallbacks(debuggingContext, callbacks);
  }
  fetchPromise.then(([workerDOMScript, authorScript, authorScriptURL]) => {
    if (workerDOMScript && authorScript && authorScriptURL) {
      const workerContext = new WorkerContext(baseElement, workerDOMScript, authorScript, authorScriptURL, callbacks);
      const worker = workerContext.getWorker();
      const mutatorContext = new MutatorProcessor(strings, nodeContext, workerContext, callbacks && callbacks.onMutationPump, sanitizer);
      worker.onmessage = (message: MessageFromWorker) => {
        const { data } = message;
        const type = data[TransferrableKeys.type];
        if (!ALLOWABLE_MESSAGE_TYPES.includes(type)) {
          return;
        }
        const phase = type == MessageType.HYDRATE ? TransferrablePhase.Hydrating : TransferrablePhase.Mutating;
        mutatorContext.mutate(
          phase,
          (data as MutationFromWorker)[TransferrableKeys.nodes],
          (data as MutationFromWorker)[TransferrableKeys.strings],
          (data as MutationFromWorker)[TransferrableKeys.mutations],
        );
        // Invoke callbacks after hydrate/mutate processing so strings etc. are stored.
        if (callbacks) {
          if (phase === TransferrablePhase.Hydrating && callbacks.onHydration) {
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

// TODO(dvoytenko): reverse the dependency direction so that we can remove
// debugging.ts from other entry points.
function wrapCallbacks(debuggingContext: DebuggingContext, callbacks?: WorkerCallbacks): WorkerCallbacks {
  return {
    onCreateWorker(initialDOM) {
      if (callbacks && callbacks.onCreateWorker) {
        const readable = debuggingContext.readableHydrateableNodeFromElement(initialDOM);
        callbacks.onCreateWorker(readable as any);
      }
    },
    onHydration() {
      if (callbacks && callbacks.onHydration) {
        callbacks.onHydration();
      }
    },
    onSendMessage(message) {
      if (callbacks && callbacks.onSendMessage) {
        const readable = debuggingContext.readableMessageToWorker(message);
        callbacks.onSendMessage(readable as any);
      }
    },
    onReceiveMessage(message) {
      if (callbacks && callbacks.onReceiveMessage) {
        const readable = debuggingContext.readableMessageFromWorker(message);
        callbacks.onReceiveMessage(readable as any);
      }
    },
    // Passthrough callbacks:
    onMutationPump: callbacks && callbacks.onMutationPump,
  };
}
