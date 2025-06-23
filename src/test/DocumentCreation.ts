import { HTMLElement } from '../worker-thread/dom/HTMLElement.js';
import { SVGElement } from '../worker-thread/dom/SVGElement.js';
import { HTMLAnchorElement } from '../worker-thread/dom/HTMLAnchorElement.js';
import { HTMLButtonElement } from '../worker-thread/dom/HTMLButtonElement.js';
import { HTMLDataElement } from '../worker-thread/dom/HTMLDataElement.js';
import { HTMLEmbedElement } from '../worker-thread/dom/HTMLEmbedElement.js';
import { HTMLFieldSetElement } from '../worker-thread/dom/HTMLFieldSetElement.js';
import { HTMLFormElement } from '../worker-thread/dom/HTMLFormElement.js';
import { HTMLIFrameElement } from '../worker-thread/dom/HTMLIFrameElement.js';
import { HTMLImageElement } from '../worker-thread/dom/HTMLImageElement.js';
import { HTMLInputElement } from '../worker-thread/dom/HTMLInputElement.js';
import { HTMLLabelElement } from '../worker-thread/dom/HTMLLabelElement.js';
import { HTMLLinkElement } from '../worker-thread/dom/HTMLLinkElement.js';
import { HTMLMapElement } from '../worker-thread/dom/HTMLMapElement.js';
import { HTMLMeterElement } from '../worker-thread/dom/HTMLMeterElement.js';
import { HTMLModElement } from '../worker-thread/dom/HTMLModElement.js';
import { HTMLOListElement } from '../worker-thread/dom/HTMLOListElement.js';
import { HTMLOptionElement } from '../worker-thread/dom/HTMLOptionElement.js';
import { HTMLProgressElement } from '../worker-thread/dom/HTMLProgressElement.js';
import { HTMLQuoteElement } from '../worker-thread/dom/HTMLQuoteElement.js';
import { HTMLScriptElement } from '../worker-thread/dom/HTMLScriptElement.js';
import { HTMLSelectElement } from '../worker-thread/dom/HTMLSelectElement.js';
import { HTMLSourceElement } from '../worker-thread/dom/HTMLSourceElement.js';
import { HTMLStyleElement } from '../worker-thread/dom/HTMLStyleElement.js';
import { HTMLTableCellElement } from '../worker-thread/dom/HTMLTableCellElement.js';
import { HTMLTableColElement } from '../worker-thread/dom/HTMLTableColElement.js';
import { HTMLTableElement } from '../worker-thread/dom/HTMLTableElement.js';
import { HTMLTableRowElement } from '../worker-thread/dom/HTMLTableRowElement.js';
import { HTMLTableSectionElement } from '../worker-thread/dom/HTMLTableSectionElement.js';
import { HTMLTimeElement } from '../worker-thread/dom/HTMLTimeElement.js';
import { Document } from '../worker-thread/dom/Document.js';
import { MutationObserver } from '../worker-thread/MutationObserver.js';
import { GlobalScope } from '../worker-thread/WorkerDOMGlobalScope.js';
import { HTMLCanvasElement } from '../worker-thread/dom/HTMLCanvasElement.js';
import { CanvasRenderingContext2D } from '../worker-thread/canvas/CanvasTypes.js';
import { Event as WorkerDOMEvent } from '../worker-thread/Event.js';
import { createStorage } from '../worker-thread/Storage.js';
import { StorageLocation } from '../transfer/TransferrableStorage.js';
import { CharacterData } from '../worker-thread/dom/CharacterData.js';
import { Comment } from '../worker-thread/dom/Comment.js';
import { DocumentFragment } from '../worker-thread/dom/DocumentFragment.js';
import { Text } from '../worker-thread/dom/Text.js';
import { DOMTokenList } from '../worker-thread/dom/DOMTokenList.js';
import { HTMLDataListElement } from '../worker-thread/dom/HTMLDataListElement.js';
import { Element } from '../worker-thread/dom/Element.js';
import { rafPolyfill, cafPolyfill } from '../worker-thread/AnimationFrame.js';

Object.defineProperty(global, 'ServiceWorkerContainer', {
  configurable: true,
  value: function () {
    return {};
  },
});

Object.defineProperty(global, 'StorageManager', {
  configurable: true,
  value: function () {
    return {};
  },
});

interface OffscreenCanvas {
  getContext(c: string): CanvasRenderingContext2D;
}

declare var OffscreenCanvas: {
  prototype: OffscreenCanvas;
  new (): OffscreenCanvas;
};

const GlobalScope: GlobalScope = {
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
  requestAnimationFrame: rafPolyfill,
  cancelAnimationFrame: cafPolyfill,
};

/**
 * Creates a Document object for testing environment.
 * @param overrides Can add a new variable to Global or override an existing one.
 */
export function createTestingDocument(overrides: {} | null = null): Document {
  const customGlobal = Object.assign({}, GlobalScope, overrides);
  const document = new Document(customGlobal);
  document.postMessage = () => {};
  document.isConnected = true;
  document.appendChild((document.body = document.createElement('body')));

  customGlobal.localStorage = createStorage(document, StorageLocation.Local, {});
  customGlobal.sessionStorage = createStorage(document, StorageLocation.Session, {});

  return document;
}
