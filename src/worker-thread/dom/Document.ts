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

import { Element, NODE_NAME_MAPPING } from './Element';
import { HTMLElement } from './HTMLElement';
import { matchChildElement } from './matchElements';
import './HTMLAnchorElement';
import './HTMLButtonElement';
import './HTMLDataElement';
import './HTMLEmbedElement';
import './HTMLFieldSetElement';
import './HTMLFormElement';
import './HTMLIFrameElement';
import './HTMLImageElement';
import './HTMLInputElement';
import './HTMLLabelElement';
import './HTMLLinkElement';
import './HTMLMapElement';
import './HTMLMeterElement';
import './HTMLModElement';
import './HTMLOListElement';
import './HTMLOptionElement';
import './HTMLProgressElement';
import './HTMLQuoteElement';
import './HTMLScriptElement';
import './HTMLSelectElement';
import './HTMLSourceElement';
import './HTMLStyleElement';
import './HTMLTableCellElement';
import './HTMLTableColElement';
import './HTMLTableElement';
import './HTMLTableRowElement';
import './HTMLTableSectionElement';
import './HTMLTimeElement';
import { SVGElement } from './SVGElement';
import { Node, NodeType, NamespaceURI } from './Node';
import { Event } from '../Event';
import { Text } from './Text';
import { MutationObserver } from '../MutationObserver';
import { observe as observeMutations } from '../../transfer/DocumentMutations';
import { propagate as propagateEvents } from '../../transfer/TransferrableEvent';
import { propagate as propagateSyncValues } from '../../transfer/TransferrableSyncValue';

export class Document extends Element {
  public defaultView: {
    document: Document;
    MutationObserver: typeof MutationObserver;
    Document: typeof Document;
    Node: typeof Node;
    Text: typeof Text;
    Element: typeof Element;
    SVGElement: typeof SVGElement;
    Event: typeof Event;
  };
  public documentElement: Document;
  public createElement: (tagName: string) => Element;
  public createElementNS: (namespaceURI: NamespaceURI, tagName: string) => Element;
  public createTextNode: (text: string) => Text;
  public body: Element;

  constructor() {
    super(NodeType.DOCUMENT_NODE, '#document', null);
    this.documentElement = this;
    this.createElement = (tagName: string): Element => this.createElementNS(null, tagName);
    this.createElementNS = (namespaceURI: NamespaceURI, tagName: string): Element =>
      new (NODE_NAME_MAPPING[tagName] || HTMLElement)(NodeType.ELEMENT_NODE, tagName, namespaceURI);
    this.createTextNode = (text: string): Text => new Text(text);
    this.defaultView = {
      document: this,
      MutationObserver,
      Document,
      Node,
      Text,
      Element,
      SVGElement,
      Event,
    };
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById
   * @return Element with matching id attribute.
   */
  public getElementById(id: string): Element | null {
    return matchChildElement(this.body, element => element.id === id);
  }
}

/**
 *
 * @param postMessageMethod
 */
export function createDocument(postMessageMethod?: Function): Document {
  // Use local references of privileged functions that are used asynchronously
  // (e.g. `postMessage`) to prevent overwriting by 3P JS.
  const _postMessage = postMessageMethod;

  const doc = new Document();
  doc.isConnected = true;
  doc.appendChild((doc.body = doc.createElement('body')));

  if (_postMessage) {
    observeMutations(doc, _postMessage);
    propagateEvents();
    propagateSyncValues();
  }

  return doc;
}

/** Should only be used for testing. */
export const documentForTesting = createDocument();
