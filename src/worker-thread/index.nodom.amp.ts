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

import { AMP } from './amp/amp';
import { callFunctionMessageHandler, exportFunction } from './function';
import { WorkerNoDOMGlobalScope } from './WorkerDOMGlobalScope';
import { DocumentStub } from './dom/DocumentLite';
import { deleteGlobals } from './amp/delete-globals';

const noop = () => void 0;

export const workerDOM: WorkerNoDOMGlobalScope = (function (postMessage, addEventListener, removeEventListener) {
  const document = new DocumentStub();

  // TODO(choumx): Avoid polluting Document's public API.
  document.postMessage = postMessage;
  document.addGlobalEventListener = addEventListener;
  document.removeGlobalEventListener = removeEventListener;
  return { document };
})(postMessage.bind(self) || noop, addEventListener.bind(self) || noop, removeEventListener.bind(self) || noop);

// Modify global scope by removing disallowed properties.
deleteGlobals(self);

// Offer APIs like AMP.setState() on the global scope.
(self as any).AMP = new AMP(workerDOM.document);

// Allows for function invocation
(self as any).exportFunction = exportFunction;
addEventListener('message', (evt: MessageEvent) => callFunctionMessageHandler(evt, workerDOM.document));

export const hydrate = noop;
