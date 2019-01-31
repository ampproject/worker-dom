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

import { DOMPurifySanitizer } from './DOMPurifySanitizer';
import { WorkerCallbacks } from './callbacks';
import { fetchAndInstall, install } from './install';
import { readableHydrateableNodeFromElement, readableMessageFromWorker, readableMessageToWorker } from './debugging';

/** Users can import this and configure the sanitizer with custom DOMPurify hooks, etc. */
export const sanitizer = new DOMPurifySanitizer();

/** Users can import this and set callback functions to add logging on worker messages, etc. */
export const callbacks: WorkerCallbacks = {};

// Wrapper around `callbacks` to ensure that debugging.ts isn't bundled into other entry points.
const wrappedCallbacks: WorkerCallbacks = {
  onCreateWorker: initialDOM => {
    if (callbacks.onCreateWorker) {
      const readable = readableHydrateableNodeFromElement(initialDOM);
      callbacks.onCreateWorker(readable as any);
    }
  },
  onSendMessage: message => {
    if (callbacks.onSendMessage) {
      const readable = readableMessageToWorker(message);
      callbacks.onSendMessage(readable as any);
    }
  },
  onReceiveMessage: message => {
    if (callbacks.onReceiveMessage) {
      const readable = readableMessageFromWorker(message);
      callbacks.onReceiveMessage(readable as any);
    }
  },
};

/**
 * @param baseElement
 * @param workerDOMUrl
 */
export function upgradeElement(baseElement: Element, workerDOMUrl: string): void {
  const authorURL = baseElement.getAttribute('src');
  if (authorURL) {
    fetchAndInstall(baseElement as HTMLElement, authorURL, workerDOMUrl, wrappedCallbacks, sanitizer);
  }
}

/**
 * This function's API will likely change frequently. Use at your own risk!
 * @param baseElement
 * @param fetchPromise Promise that resolves with a tuple containing the worker script, author script, and author script URL.
 */
export function upgrade(baseElement: Element, fetchPromise: Promise<[string, string, string]>): void {
  install(fetchPromise, baseElement as HTMLElement, wrappedCallbacks, sanitizer);
}
