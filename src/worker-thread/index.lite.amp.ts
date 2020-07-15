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

import { AMP } from './amp/amp';
import { initialize } from './initialize';
import { wrap as longTaskWrap } from './long-task';
import { callFunctionMessageHandler, exportFunction } from './function';
import { Document } from './dom/Document';
import { GlobalScope, WorkerDOMGlobalScope } from './WorkerDOMGlobalScope';

const ALLOWLISTED_GLOBALS: { [key: string]: boolean } = {
  Array: true,
  ArrayBuffer: true,
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

const noop = () => void 0;

// WorkerDOM.Document.defaultView ends up being the window object.
// React requires the classes to exist off the window object for instanceof checks.
export const workerDOM: WorkerDOMGlobalScope = (function (postMessage, addEventListener, removeEventListener) {
  const document = new Document({} as GlobalScope);

  // TODO(choumx): Avoid polluting Document's public API.
  document.postMessage = postMessage;
  document.addGlobalEventListener = addEventListener;
  document.removeGlobalEventListener = removeEventListener;
  return document.defaultView;
})(postMessage.bind(self) || noop, addEventListener.bind(self) || noop, removeEventListener.bind(self) || noop);

// Modify global scope by removing disallowed properties and wrapping `fetch()`.
(function (global: WorkerGlobalScope) {
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
      } catch (e) {}
    }
    return false;
  };

  // Walk up global's prototype chain and dereference non-allowlisted properties
  // until EventTarget is reached.
  let current = global;
  while (current && current.constructor !== EventTarget) {
    const deleted: string[] = [];
    const failedToDelete: string[] = [];
    Object.getOwnPropertyNames(current).forEach((prop) => {
      if (deleteUnsafe(current, prop)) {
        deleted.push(prop);
      } else {
        failedToDelete.push(prop);
      }
    });
    console.info(`Removed ${deleted.length} references from`, current, ':', deleted);
    if (failedToDelete.length) {
      console.info(`Failed to remove ${failedToDelete.length} references from`, current, ':', failedToDelete);
    }
    current = Object.getPrototypeOf(current);
  }
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

export const hydrate = initialize;
