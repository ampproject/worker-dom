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

import type { HTMLAnchorElement } from './dom/HTMLAnchorElement';
import type { HTMLButtonElement } from './dom/HTMLButtonElement';
import type { HTMLCanvasElement } from './dom/HTMLCanvasElement';
import type { HTMLDataElement } from './dom/HTMLDataElement';
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
import type { OffscreenCanvas } from './canvas/CanvasTypes';
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
import type { Document } from './dom/Document';
import type { EventHandler, Event as WorkerDOMEvent } from './Event';
import type { MutationObserver } from './MutationObserver';
import type { Storage } from './Storage';
import type { SVGElement } from './dom/SVGElement';
import type { HTMLElement } from './dom/HTMLElement';
import type { HTMLDataListElement } from './dom/HTMLDataListElement';
import type { Text } from './dom/Text';
import type { Comment } from './dom/Comment';
import type { CharacterData } from './dom/CharacterData';
import type { DocumentFragment } from './dom/DocumentFragment';
import type { DOMTokenList } from './dom/DOMTokenList';
import type { Element } from './dom/Element';
import type { DocumentStub } from './dom/DocumentStub';

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
