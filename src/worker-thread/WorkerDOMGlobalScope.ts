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
import { EventHandler, Event as WorkerDOMEvent } from './Event';
import { MutationObserver } from './MutationObserver';
import { Storage } from './Storage';
import { SVGElement } from './dom/SVGElement';
import { HTMLElement } from './dom/HTMLElement';
import { HTMLDataListElement } from './dom/HTMLDataListElement';
import { Text } from './dom/Text';
import { Comment } from './dom/Comment';
import { CharacterData } from './dom/CharacterData';
import { DocumentFragment } from './dom/DocumentFragment';
import { DOMTokenList } from './dom/DOMTokenList';
import { Element } from './dom/Element';
import { DocumentStub } from './dom/DocumentLite';

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
  OffscreenCanvas?: typeof OffscreenCanvas;
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
