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

import type { CharacterData } from './dom/CharacterData';
import type { Comment } from './dom/Comment';
import type { DocumentFragment } from './dom/DocumentFragment';
import type { DOMTokenList } from './dom/DOMTokenList';
import type { Element } from './dom/Element';
import type { HTMLAnchorElement } from './dom/HTMLAnchorElement';
import type { HTMLButtonElement } from './dom/HTMLButtonElement';
import type { HTMLCanvasElement } from './dom/HTMLCanvasElement';
import type { HTMLDataElement } from './dom/HTMLDataElement';
import type { HTMLDataListElement } from './dom/HTMLDataListElement';
import type { HTMLElement } from './dom/HTMLElement';
import type { HTMLEmbedElement } from './dom/HTMLEmbedElement';
import type { HTMLFieldSetElement } from './dom/HTMLFieldSetElement';
import type { HTMLFormElement } from './dom/HTMLFormElement';
import type { HTMLIFrameElement } from './dom/HTMLIFrameElement';
import type { HTMLImageElement } from './dom/HTMLImageElement';
import type { HTMLInputElement } from './dom/HTMLInputElement';
import type { HTMLLabelElement } from './dom/HTMLLabelElement';
import type { HTMLLinkElement } from './dom/HTMLLinkElement';
import type { HTMLMapElement } from './dom/HTMLMapElement';
import type { HTMLMeterElement } from './dom/HTMLMeterElement';
import type { HTMLModElement } from './dom/HTMLModElement';
import type { HTMLOListElement } from './dom/HTMLOListElement';
import type { HTMLOptionElement } from './dom/HTMLOptionElement';
import type { HTMLProgressElement } from './dom/HTMLProgressElement';
import type { HTMLQuoteElement } from './dom/HTMLQuoteElement';
import type { HTMLScriptElement } from './dom/HTMLScriptElement';
import type { HTMLSelectElement } from './dom/HTMLSelectElement';
import type { HTMLSourceElement } from './dom/HTMLSourceElement';
import type { HTMLStyleElement } from './dom/HTMLStyleElement';
import type { HTMLTableCellElement } from './dom/HTMLTableCellElement';
import type { HTMLTableColElement } from './dom/HTMLTableColElement';
import type { HTMLTableElement } from './dom/HTMLTableElement';
import type { HTMLTableRowElement } from './dom/HTMLTableRowElement';
import type { HTMLTableSectionElement } from './dom/HTMLTableSectionElement';
import type { HTMLTimeElement } from './dom/HTMLTimeElement';
import type { MutationObserver } from './MutationObserver';
import type { SVGElement } from './dom/SVGElement';
import type { Text } from './dom/Text';

import { AMP } from './amp/amp';
import { callFunctionMessageHandler, exportFunction } from './function';
import { deleteGlobals } from './amp/delete-globals';
import { Document } from './dom/Document';
import { Event as WorkerDOMEvent } from './Event';
import { GlobalScope, WorkerDOMGlobalScope } from './WorkerDOMGlobalScope';
import { initialize } from './initialize';
import { rafPolyfill, cafPolyfill } from './AnimationFrame';
import { wrap as longTaskWrap } from './long-task';
import { HydrateFunction } from './hydrate';

declare const WORKER_DOM_DEBUG: boolean;

const globalScope: GlobalScope = {
  innerWidth: 0,
  innerHeight: 0,
  CharacterData,
  Comment,
  Document,
  DocumentFragment,
  DOMTokenList,
  Element,
  HTMLAnchorElement,
  HTMLButtonElement,
  HTMLCanvasElement,
  HTMLDataElement,
  HTMLDataListElement,
  HTMLElement,
  HTMLEmbedElement,
  HTMLFieldSetElement,
  HTMLFormElement,
  HTMLIFrameElement,
  HTMLImageElement,
  HTMLInputElement,
  HTMLLabelElement,
  HTMLLinkElement,
  HTMLMapElement,
  HTMLMeterElement,
  HTMLModElement,
  HTMLOListElement,
  HTMLOptionElement,
  HTMLProgressElement,
  HTMLQuoteElement,
  HTMLScriptElement,
  HTMLSelectElement,
  HTMLSourceElement,
  HTMLStyleElement,
  HTMLTableCellElement,
  HTMLTableColElement,
  HTMLTableElement,
  HTMLTableRowElement,
  HTMLTableSectionElement,
  HTMLTimeElement,
  SVGElement,
  Text,
  Event: WorkerDOMEvent,
  MutationObserver,
  requestAnimationFrame: self.requestAnimationFrame || rafPolyfill,
  cancelAnimationFrame: self.cancelAnimationFrame || cafPolyfill,
};

const noop = () => void 0;

// WorkerDOM.Document.defaultView ends up being the window object.
// React requires the classes to exist off the window object for instanceof checks.
export const workerDOM: WorkerDOMGlobalScope = (function (postMessage, addEventListener, removeEventListener) {
  const document = new Document(globalScope);
  // TODO(choumx): Avoid polluting Document's public API.
  document.postMessage = postMessage;
  document.addGlobalEventListener = addEventListener;
  document.removeGlobalEventListener = removeEventListener;

  document.isConnected = true;
  document.appendChild((document.body = document.createElement('body')));

  // TODO(choumx): Remove once defaultView contains all native worker globals.
  // Canvas's use of native OffscreenCanvas checks the existence of the property
  // on the WorkerDOMGlobalScope.
  globalScope.OffscreenCanvas = (self as any)['OffscreenCanvas'];
  globalScope.ImageBitmap = (self as any)['ImageBitmap'];

  return document.defaultView;
})(postMessage.bind(self) || noop, addEventListener.bind(self) || noop, removeEventListener.bind(self) || noop);

// Modify global scope by removing disallowed properties and wrapping `fetch()`.
(function (global: WorkerGlobalScope) {
  deleteGlobals(global);
  // Wrap global.fetch() with our longTask API.
  const originalFetch = global['fetch'];
  if (originalFetch) {
    try {
      Object.defineProperty(global, 'fetch', {
        enumerable: true,
        writable: true,
        configurable: true,
        value: longTaskWrap(workerDOM.document, originalFetch.bind(global)),
      });
    } catch (e) {
      console.warn(e);
    }
  }
})(self);

// Offer APIs like AMP.setState() on the global scope.
(self as any).AMP = new AMP(workerDOM.document);

// Allows for function invocation
(self as any).exportFunction = exportFunction;
addEventListener('message', (evt: MessageEvent) => callFunctionMessageHandler(evt, workerDOM.document));

export const hydrate: HydrateFunction = initialize;
