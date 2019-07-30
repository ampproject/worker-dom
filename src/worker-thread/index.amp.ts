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

import { HTMLElement } from './dom/HTMLElement';
import { SVGElement } from './dom/SVGElement';
import { HTMLAnchorElement } from './dom/HTMLAnchorElement';
import { HTMLButtonElement } from './dom/HTMLButtonElement';
import { HTMLCanvasElement } from './dom/HTMLCanvasElement';
import { HTMLDataElement } from './dom/HTMLDataElement';
import { HTMLEmbedElement } from './dom/HTMLEmbedElement';
import { HTMLFieldSetElement } from './dom/HTMLFieldSetElement';
import { HTMLFormElement } from './dom/HTMLFormElement';
import { HTMLIFrameElement } from './dom/HTMLIFrameElement';
import { HTMLImageElement } from './dom/HTMLImageElement';
import { HTMLInputElement } from './dom/HTMLInputElement';
import { HTMLLabelElement } from './dom/HTMLLabelElement';
import { HTMLLinkElement } from './dom/HTMLLinkElement';
import { HTMLMapElement } from './dom/HTMLMapElement';
import { HTMLMeterElement } from './dom/HTMLMeterElement';
import { HTMLModElement } from './dom/HTMLModElement';
import { HTMLOListElement } from './dom/HTMLOListElement';
import { HTMLOptionElement } from './dom/HTMLOptionElement';
import { HTMLProgressElement } from './dom/HTMLProgressElement';
import { HTMLQuoteElement } from './dom/HTMLQuoteElement';
import { HTMLScriptElement } from './dom/HTMLScriptElement';
import { HTMLSelectElement } from './dom/HTMLSelectElement';
import { HTMLSourceElement } from './dom/HTMLSourceElement';
import { HTMLStyleElement } from './dom/HTMLStyleElement';
import { HTMLTableCellElement } from './dom/HTMLTableCellElement';
import { HTMLTableColElement } from './dom/HTMLTableColElement';
import { HTMLTableElement } from './dom/HTMLTableElement';
import { HTMLTableRowElement } from './dom/HTMLTableRowElement';
import { HTMLTableSectionElement } from './dom/HTMLTableSectionElement';
import { HTMLTimeElement } from './dom/HTMLTimeElement';
import { Document } from './dom/Document';
import { GlobalScope } from './WorkerDOMGlobalScope';
import { initialize } from './initialize';
import { wrap as longTaskWrap } from './long-task';
import { MutationObserver } from './MutationObserver';
import { Event as WorkerDOMEvent } from './Event';
import { Text } from './dom/Text';
import { HTMLDataListElement } from './dom/HTMLDataListElement';
import { CharacterData } from './dom/CharacterData';
import { DOMTokenList } from './dom/DOMTokenList';
import { Comment } from './dom/Comment';
import { DocumentFragment } from './dom/DocumentFragment';
import { Element } from './dom/Element';

const ALLOWLISTED_GLOBALS: { [key: string]: boolean } = {
  Array: true,
  ArrayBuffer: true,
  Blob: true,
  BigInt: true,
  BigInt64Array: true,
  BigUint64Array: true,
  Boolean: true,
  Cache: true,
  CustomEvent: true,
  DataView: true,
  Date: true,
  Error: true,
  EvalError: true,
  Event: true,
  EventTarget: true,
  Float32Array: true,
  Float64Array: true,
  Function: true,
  Infinity: true,
  Int16Array: true,
  Int32Array: true,
  Int8Array: true,
  Intl: true,
  JSON: true,
  Map: true,
  Math: true,
  NaN: true,
  Number: true,
  Object: true,
  Promise: true,
  Proxy: true,
  RangeError: true,
  ReferenceError: true,
  Reflect: true,
  RegExp: true,
  Set: true,
  String: true,
  Symbol: true,
  SyntaxError: true,
  TextDecoder: true,
  TextEncoder: true,
  TypeError: true,
  URIError: true,
  URL: true,
  Uint16Array: true,
  Uint32Array: true,
  Uint8Array: true,
  Uint8ClampedArray: true,
  WeakMap: true,
  WeakSet: true,
  WebAssembly: true,
  WebSocket: true,
  XMLHttpRequest: true,
  atob: true,
  addEventListener: true,
  removeEventListener: true,
  btoa: true,
  caches: true,
  clearInterval: true,
  clearTimeout: true,
  console: true,
  decodeURI: true,
  decodeURIComponent: true,
  document: true,
  encodeURI: true,
  encodeURIComponent: true,
  escape: true,
  fetch: true,
  indexedDB: true,
  isFinite: true,
  isNaN: true,
  location: true,
  navigator: true,
  onerror: true,
  onrejectionhandled: true,
  onunhandledrejection: true,
  parseFloat: true,
  parseInt: true,
  performance: true,
  requestAnimationFrame: true,
  cancelAnimationFrame: true,
  self: true,
  setTimeout: true,
  setInterval: true,
  unescape: true,
};

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
};

const noop = () => void 0;

// WorkerDOM.Document.defaultView ends up being the window object.
// React requires the classes to exist off the window object for instanceof checks.
export const workerDOM = (function(postMessage, addEventListener, removeEventListener) {
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

/**
 * Instruments relevant calls to work via LongTask API.
 * @param global
 */
function updateLongTask(global: WorkerGlobalScope) {
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
}

/**
 * @param global
 */
function updateGlobals(global: WorkerGlobalScope) {
  /**
   * @param object
   * @param property
   * @return True if property was deleted from object. Otherwise, false.
   */
  const deleteUnsafe = (object: any, property: string): boolean => {
    if (!ALLOWLISTED_GLOBALS.hasOwnProperty(property)) {
      try {
        delete object[property];
        return true;
      } catch (e) {
        console.warn(e);
      }
    }
    return false;
  };
  // Walk up global's prototype chain and dereference non-allowlisted properties
  // until EventTarget is reached.
  let current = global;
  while (current && current.constructor !== EventTarget) {
    const deleted: string[] = [];
    Object.getOwnPropertyNames(current).forEach(prop => {
      if (deleteUnsafe(current, prop)) {
        deleted.push(prop);
      }
    });
    console.info(`Removed ${deleted.length} references from`, current, ':', deleted);
    current = Object.getPrototypeOf(current);
  }
  // Wrap global.fetch() with our longTask API.
  updateLongTask(global);
}

updateGlobals(self);

export const hydrate = initialize;
