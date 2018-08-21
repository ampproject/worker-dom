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

import { createDocument } from './dom/Document';
import { WorkerDOMGlobalScope } from './WorkerDOMGlobalScope';
import { appendKeys } from './css/CSSStyleDeclaration';

declare var __ALLOW_POST_MESSAGE__: boolean;

const doc = createDocument(__ALLOW_POST_MESSAGE__ ? (self as DedicatedWorkerGlobalScope).postMessage : undefined);
export const workerDOM: WorkerDOMGlobalScope = {
  document: doc,
  addEventListener: doc.addEventListener.bind(doc),
  removeEventListener: doc.removeEventListener.bind(doc),
  localStorage: {},
  location: {},
  url: '/',
  appendKeys,
};
