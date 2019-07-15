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

const WHITELISTED_GLOBALS = [
  'Array',
  'ArrayBuffer',
  'Blob',
  'BigInt',
  'BigInt64Array',
  'BigUint64Array',
  'Boolean',
  'Cache',
  'CustomEvent',
  'DataView',
  'Date',
  'Error',
  'EvalError',
  'Event',
  'EventTarget',
  'Float32Array',
  'Float64Array',
  'Function',
  'Infinity',
  'Int16Array',
  'Int32Array',
  'Int8Array',
  'Intl',
  'JSON',
  'Map',
  'Math',
  'NaN',
  'Number',
  'Object',
  'Promise',
  'Proxy',
  'RangeError',
  'ReferenceError',
  'Reflect',
  'RegExp',
  'Set',
  'String',
  'Symbol',
  'SyntaxError',
  'TextDecoder',
  'TextEncoder',
  'TypeError',
  'URIError',
  'URL',
  'Uint16Array',
  'Uint32Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'WeakMap',
  'WeakSet',
  'WebAssembly',
  'XMLHttpRequest',
  'atob',
  'addEventListener',
  'removeEventListener',
  'btoa',
  'caches',
  'clearInterval',
  'clearTimeout',
  'console',
  'decodeURI',
  'decodeURIComponent',
  'document',
  'encodeURI',
  'encodeURIComponent',
  'escape',
  'fetch',
  'indexedDB',
  'isFinite',
  'isNaN',
  'location',
  'navigator',
  'onerror',
  'onrejectionhandled',
  'onunhandledrejection',
  'parseFloat',
  'parseInt',
  'performance',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'self',
  'setTimeout',
  'setInterval',
  'unescape',
];

const globalScope: GlobalScope = {
  innerWidth: 0,
  innerHeight: 0,
  Event: WorkerDOMEvent,
  MutationObserver,
  SVGElement,
  HTMLElement,
  HTMLAnchorElement,
  HTMLButtonElement,
  HTMLCanvasElement,
  HTMLDataElement,
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
    if (WHITELISTED_GLOBALS.indexOf(property) < 0) {
      try {
        delete object[property];
        return true;
      } catch (e) {
        console.warn(e);
      }
    }
    return false;
  };
  // Walk up global's prototype chain and dereference non-whitelisted properties
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
