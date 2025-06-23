import { HTMLElement } from './dom/HTMLElement.js';
import { SVGElement } from './dom/SVGElement.js';
import { HTMLAnchorElement } from './dom/HTMLAnchorElement.js';
import { HTMLButtonElement } from './dom/HTMLButtonElement.js';
import { HTMLCanvasElement } from './dom/HTMLCanvasElement.js';
import { HTMLDataElement } from './dom/HTMLDataElement.js';
import { HTMLEmbedElement } from './dom/HTMLEmbedElement.js';
import { HTMLFieldSetElement } from './dom/HTMLFieldSetElement.js';
import { HTMLFormElement } from './dom/HTMLFormElement.js';
import { HTMLIFrameElement } from './dom/HTMLIFrameElement.js';
import { HTMLImageElement } from './dom/HTMLImageElement.js';
import { HTMLInputElement } from './dom/HTMLInputElement.js';
import { HTMLLabelElement } from './dom/HTMLLabelElement.js';
import { HTMLLinkElement } from './dom/HTMLLinkElement.js';
import { HTMLMapElement } from './dom/HTMLMapElement.js';
import { HTMLMeterElement } from './dom/HTMLMeterElement.js';
import { HTMLModElement } from './dom/HTMLModElement.js';
import { HTMLOListElement } from './dom/HTMLOListElement.js';
import { HTMLOptionElement } from './dom/HTMLOptionElement.js';
import { HTMLProgressElement } from './dom/HTMLProgressElement.js';
import { HTMLQuoteElement } from './dom/HTMLQuoteElement.js';
import { HTMLScriptElement } from './dom/HTMLScriptElement.js';
import { HTMLSelectElement } from './dom/HTMLSelectElement.js';
import { HTMLSourceElement } from './dom/HTMLSourceElement.js';
import { HTMLStyleElement } from './dom/HTMLStyleElement.js';
import { HTMLTableCellElement } from './dom/HTMLTableCellElement.js';
import { HTMLTableColElement } from './dom/HTMLTableColElement.js';
import { HTMLTableElement } from './dom/HTMLTableElement.js';
import { HTMLTableRowElement } from './dom/HTMLTableRowElement.js';
import { HTMLTableSectionElement } from './dom/HTMLTableSectionElement.js';
import { HTMLTimeElement } from './dom/HTMLTimeElement.js';
import { Document } from './dom/Document.js';
import { GlobalScope } from './WorkerDOMGlobalScope.js';
import { initialize } from './initialize.js';
import { MutationObserver } from './MutationObserver.js';
import { Event as WorkerDOMEvent } from './Event.js';
import { Text } from './dom/Text.js';
import { HTMLDataListElement } from './dom/HTMLDataListElement.js';
import { CharacterData } from './dom/CharacterData.js';
import { Comment } from './dom/Comment.js';
import { DOMTokenList } from './dom/DOMTokenList.js';
import { DocumentFragment } from './dom/DocumentFragment.js';
import { Element } from './dom/Element.js';
import { rafPolyfill, cafPolyfill } from './AnimationFrame.js';
import { HydrateFunction } from './hydrate.js';

const globalScope: GlobalScope = {
  innerWidth: 0,
  innerHeight: 0,
  CharacterData,
  Comment,
  DOMTokenList,
  Document,
  DocumentFragment,
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
export const workerDOM = (function (postMessage, addEventListener, removeEventListener) {
  const document = new Document(globalScope);
  // TODO(choumx): Avoid polluting Document's public API.
  document.postMessage = postMessage;
  document.addGlobalEventListener = addEventListener;
  document.removeGlobalEventListener = removeEventListener;

  // TODO(choumx): Remove once defaultView contains all native worker globals.
  // Canvas's use of native OffscreenCanvas checks the existence of the property
  // on the WorkerDOMGlobalScope.
  globalScope.OffscreenCanvas = (self as any)['OffscreenCanvas'];
  globalScope.ImageBitmap = (self as any)['ImageBitmap'];

  document.isConnected = true;
  document.appendChild((document.body = document.createElement('body')));

  return document.defaultView;
})(postMessage.bind(self) || noop, addEventListener.bind(self) || noop, removeEventListener.bind(self) || noop);

export const hydrate: HydrateFunction = initialize;
