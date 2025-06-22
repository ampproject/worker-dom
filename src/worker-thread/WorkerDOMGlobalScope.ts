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
import { EventHandler, Event as WorkerDOMEvent } from './Event.js';
import { MutationObserver } from './MutationObserver.js';
import { Storage } from './Storage.js';
import { SVGElement } from './dom/SVGElement.js';
import { HTMLElement } from './dom/HTMLElement.js';
import { HTMLDataListElement } from './dom/HTMLDataListElement.js';
import { Text } from './dom/Text.js';
import { Comment } from './dom/Comment.js';
import { CharacterData } from './dom/CharacterData.js';
import { DocumentFragment } from './dom/DocumentFragment.js';
import { DOMTokenList } from './dom/DOMTokenList.js';
import { Element } from './dom/Element.js';
import { DocumentStub } from './dom/DocumentStub.js';
import { OffscreenCanvas } from './canvas/CanvasTypes.js';

/**
 * Should only contain properties that exist on Window.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window
 */
export interface GlobalScope {
  innerWidth: number;
  innerHeight: number;
  localStorage?: Storage;
  sessionStorage?: Storage;
  CharacterData: typeof CharacterData;
  Comment: typeof Comment;
  Document: typeof Document;
  DocumentFragment: typeof DocumentFragment;
  DOMTokenList: typeof DOMTokenList;
  Element: typeof Element;
  HTMLAnchorElement: typeof HTMLAnchorElement;
  HTMLButtonElement: typeof HTMLButtonElement;
  HTMLCanvasElement: typeof HTMLCanvasElement;
  HTMLDataElement: typeof HTMLDataElement;
  HTMLDataListElement: typeof HTMLDataListElement;
  HTMLElement: typeof HTMLElement;
  HTMLEmbedElement: typeof HTMLEmbedElement;
  HTMLFieldSetElement: typeof HTMLFieldSetElement;
  HTMLFormElement: typeof HTMLFormElement;
  HTMLIFrameElement: typeof HTMLIFrameElement;
  HTMLImageElement: typeof HTMLImageElement;
  HTMLInputElement: typeof HTMLInputElement;
  HTMLLabelElement: typeof HTMLLabelElement;
  HTMLLinkElement: typeof HTMLLinkElement;
  HTMLMapElement: typeof HTMLMapElement;
  HTMLMeterElement: typeof HTMLMeterElement;
  HTMLModElement: typeof HTMLModElement;
  HTMLOListElement: typeof HTMLOListElement;
  HTMLOptionElement: typeof HTMLOptionElement;
  HTMLProgressElement: typeof HTMLProgressElement;
  HTMLQuoteElement: typeof HTMLQuoteElement;
  HTMLScriptElement: typeof HTMLScriptElement;
  HTMLSelectElement: typeof HTMLSelectElement;
  HTMLSourceElement: typeof HTMLSourceElement;
  HTMLStyleElement: typeof HTMLStyleElement;
  HTMLTableCellElement: typeof HTMLTableCellElement;
  HTMLTableColElement: typeof HTMLTableColElement;
  HTMLTableElement: typeof HTMLTableElement;
  HTMLTableRowElement: typeof HTMLTableRowElement;
  HTMLTableSectionElement: typeof HTMLTableSectionElement;
  HTMLTimeElement: typeof HTMLTimeElement;
  SVGElement: typeof SVGElement;
  Text: typeof Text;
  // Event exists natively in web workers but override with our synthetic event
  // implementation to enable setting readonly properties like currentTarget.
  Event: typeof WorkerDOMEvent;
  MutationObserver: typeof MutationObserver;
  OffscreenCanvas?: OffscreenCanvas;
  ImageBitmap?: typeof ImageBitmap;
  requestAnimationFrame: typeof requestAnimationFrame;
  cancelAnimationFrame: typeof cancelAnimationFrame;
}

export interface WorkerDOMGlobalScope extends GlobalScope {
  document: Document;
  addEventListener: (type: string, handler: EventHandler) => void;
  removeEventListener: (type: string, handler: EventHandler) => void;
}

export interface WorkerNoDOMGlobalScope {
  document: DocumentStub;
  localStorage?: Storage;
  sessionStorage?: Storage;
}
