/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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

import { HTMLAnchorElement } from '../worker-thread/dom/HTMLAnchorElement';
import { HTMLButtonElement } from '../worker-thread/dom/HTMLButtonElement';
import { HTMLDataElement } from '../worker-thread/dom/HTMLDataElement';
import { HTMLEmbedElement } from '../worker-thread/dom/HTMLEmbedElement';
import { HTMLFieldSetElement } from '../worker-thread/dom/HTMLFieldSetElement';
import { HTMLFormElement } from '../worker-thread/dom/HTMLFormElement';
import { HTMLIFrameElement } from '../worker-thread/dom/HTMLIFrameElement';
import { HTMLImageElement } from '../worker-thread/dom/HTMLImageElement';
import { HTMLInputElement } from '../worker-thread/dom/HTMLInputElement';
import { HTMLLabelElement } from '../worker-thread/dom/HTMLLabelElement';
import { HTMLLinkElement } from '../worker-thread/dom/HTMLLinkElement';
import { HTMLMapElement } from '../worker-thread/dom/HTMLMapElement';
import { HTMLMeterElement } from '../worker-thread/dom/HTMLMeterElement';
import { HTMLModElement } from '../worker-thread/dom/HTMLModElement';
import { HTMLOListElement } from '../worker-thread/dom/HTMLOListElement';
import { HTMLOptionElement } from '../worker-thread/dom/HTMLOptionElement';
import { HTMLProgressElement } from '../worker-thread/dom/HTMLProgressElement';
import { HTMLQuoteElement } from '../worker-thread/dom/HTMLQuoteElement';
import { HTMLScriptElement } from '../worker-thread/dom/HTMLScriptElement';
import { HTMLSelectElement } from '../worker-thread/dom/HTMLSelectElement';
import { HTMLSourceElement } from '../worker-thread/dom/HTMLSourceElement';
import { HTMLStyleElement } from '../worker-thread/dom/HTMLStyleElement';
import { HTMLTableCellElement } from '../worker-thread/dom/HTMLTableCellElement';
import { HTMLTableColElement } from '../worker-thread/dom/HTMLTableColElement';
import { HTMLTableElement } from '../worker-thread/dom/HTMLTableElement';
import { HTMLTableRowElement } from '../worker-thread/dom/HTMLTableRowElement';
import { HTMLTableSectionElement } from '../worker-thread/dom/HTMLTableSectionElement';
import { HTMLTimeElement } from '../worker-thread/dom/HTMLTimeElement';
import { Document } from '../worker-thread/dom/Document';
import { HydrateableNode } from '../transfer/TransferrableNodes';
import { MutationObserver } from '../worker-thread/MutationObserver';
import { GlobalScope } from '../worker-thread/WorkerDOMGlobalScope';
import { HTMLCanvasElement } from '../worker-thread/dom/HTMLCanvasElement';

Object.defineProperty(global, 'ServiceWorkerContainer', {
  configurable: true,
  value: function() {
    return {};
  },
});

Object.defineProperty(global, 'StorageManager', {
  configurable: true,
  value: function() {
    return {};
  },
});

const GlobalScope: GlobalScope = {
  navigator: {
    appCodeName: 'Mozilla',
    appName: 'Netscape',
    appVersion:
      '5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Mobile Safari/537.36',
    platform: 'MacIntel',
    product: 'Gecko',
    userAgent:
      'Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Mobile Safari/537.36',
    serviceWorker: new ServiceWorkerContainer(),
    productSub: '20030107',
    vendor: 'Google Inc.',
    vendorSub: '',
    onLine: true,
    sendBeacon: () => true,
    hardwareConcurrency: 0,
    storage: new StorageManager(),
  },
  localStorage: {},
  location: {},
  url: '/',
  innerWidth: 0,
  innerHeight: 0,
  initialize: (document: Document, strings: Array<string>, hydrateableNode: HydrateableNode, keys: Array<string>) => void 0,
  MutationObserver,
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

/**
 * Creates a Document object for testing environment.
 * @param overrides Global variable declaration. Can add a new one or override an existing one, for testing purposes.
 */
export function createTestingDocument(overrides: {} | null = null): Document {
  const customGlobal = Object.assign({}, GlobalScope, overrides);
  const document = new Document(customGlobal);
  document.isConnected = true;
  document.appendChild((document.body = document.createElement('body')));

  return document;
}
