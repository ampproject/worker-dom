/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
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

import type { WorkerNoDOMGlobalScope } from './WorkerDOMGlobalScope';
import type { HydrateFunction } from './hydrate';
import type { WorkerStorageInit } from './initialize-storage';

import { AMP } from './amp/amp';
import { DocumentStub } from './dom/DocumentStub';
import { callFunctionMessageHandler, exportFunction } from './function';
import { deleteGlobals } from './amp/delete-globals';
import { initializeStorage } from './initialize-storage';

const noop = () => void 0;

export const workerDOM: WorkerNoDOMGlobalScope = (function (postMessage, addEventListener, removeEventListener) {
  const document = new DocumentStub();

  // TODO(choumx): Avoid polluting Document's public API.
  document.postMessage = postMessage;
  document.addGlobalEventListener = addEventListener;
  document.removeGlobalEventListener = removeEventListener;
  return document.defaultView;
})(postMessage.bind(self) || noop, addEventListener.bind(self) || noop, removeEventListener.bind(self) || noop);

// Modify global scope by removing disallowed properties.
deleteGlobals(self);

// Offer APIs like AMP.setState() on the global scope.
(self as any).AMP = new AMP(workerDOM.document);

// Allows for function invocation
(self as any).exportFunction = exportFunction;
addEventListener('message', (evt: MessageEvent) => callFunctionMessageHandler(evt, workerDOM.document));

export const hydrate: HydrateFunction = (
  document: DocumentStub,
  strings: Object,
  hydrateableNode: Object,
  cssKeys: Object,
  globalEventHandlerKeys: Object,
  size: Object,
  localStorageInit: WorkerStorageInit,
  sessionStorageInit: WorkerStorageInit,
) => {
  initializeStorage(document, localStorageInit, sessionStorageInit);
};
