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

import { store as storeString } from './strings';
import { Document } from './dom/Document';
import { HydrateableNode } from '../transfer/TransferrableNodes';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { appendKeys as addCssKeys } from './css/CSSStyleDeclaration';
import { createStorage } from './Storage';
import { StorageLocation } from '../transfer/TransferrableStorage';
import { appendGlobalEventProperties } from './dom/HTMLElement';

export function initialize(
  document: Document,
  strings: Array<string>,
  hydrateableNode: HydrateableNode,
  cssKeys: Array<string>,
  globalEventHandlerKeys: Array<string>,
  [innerWidth, innerHeight]: [number, number],
  localStorageData: { [key: string]: string },
  sessionStorageData: { [key: string]: string },
): void {
  addCssKeys(cssKeys);
  appendGlobalEventProperties(globalEventHandlerKeys);
  strings.forEach(storeString);
  (hydrateableNode[TransferrableKeys.childNodes] || []).forEach((child) =>
    document.body.appendChild(document[TransferrableKeys.hydrateNode](strings, child)),
  );
  const window = document.defaultView;
  window.innerWidth = innerWidth;
  window.innerHeight = innerHeight;
  window.localStorage = createStorage(document, StorageLocation.Local, localStorageData);
  window.sessionStorage = createStorage(document, StorageLocation.Session, sessionStorageData);
}
