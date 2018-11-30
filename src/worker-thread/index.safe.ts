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

import { HTMLAnchorElement } from './dom/HTMLAnchorElement';
import { HTMLButtonElement } from './dom/HTMLButtonElement';
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
import { createDocument } from './dom/Document';
import { WorkerDOMGlobalScope } from './WorkerDOMGlobalScope';
import { appendKeys } from './css/CSSStyleDeclaration';
import { consumeInitialDOM } from './initialize';

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
  'atob',
  'btoa',
  'caches',
  'clearInterval',
  'clearTimeout',
  'console',
  'decodeURI',
  'decodeURIComponent',
  'encodeURI',
  'encodeURIComponent',
  'escape',
  'eval',
  'fetch', // TODO(choumx): Wrap this for origin whitelisting.
  'indexedDB',
  'isFinite',
  'isNaN',
  'onerror',
  'onrejectionhandled',
  'onunhandledrejection',
  'parseFloat',
  'parseInt',
  'performance',
  'setTimeout',
  'setInterval',
  'undefined',
  'unescape',
];

const doc = createDocument((self as DedicatedWorkerGlobalScope).postMessage);
export const workerDOM: WorkerDOMGlobalScope = {
  document: doc,
  addEventListener: doc.addEventListener.bind(doc),
  removeEventListener: doc.removeEventListener.bind(doc),
  localStorage: {},
  location: {},
  url: '/',
  appendKeys,
  consumeInitialDOM,
  HTMLAnchorElement,
  HTMLButtonElement,
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

/**
 * Walks up a global's prototype chain and dereferences non-whitelisted properties
 * until EventTarget is reached.
 * @param global
 */
function dereferenceGlobals(global: WorkerGlobalScope) {
  function deleteUnsafe(object: any, property: string) {
    if (WHITELISTED_GLOBALS.indexOf(property) >= 0) {
      return;
    }
    try {
      console.info(`  Deleting ${property}...`);
      delete object[property];
    } catch (e) {
      console.warn(e);
    }
  }

  let current = global;
  while (current && current.constructor !== EventTarget) {
    console.info('Removing references from:', current);
    Object.getOwnPropertyNames(current).forEach(prop => deleteUnsafe(current, prop));
    current = Object.getPrototypeOf(current);
  }
}

dereferenceGlobals(self);
