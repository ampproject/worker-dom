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

import { Element, NS_NAME_TO_CLASS } from './Element';
import { HTMLElement } from './HTMLElement';
import './HTMLAnchorElement';
import './HTMLButtonElement';
import './HTMLDataElement';
import './HTMLDataListElement';
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
import { matchChildElement } from './matchElements';
import { SVGElement } from './SVGElement';
import { Node, NamespaceURI } from './Node';
import { Event } from '../Event';
import { Text } from './Text';
import { Comment } from './Comment';
import { MutationObserver } from '../MutationObserver';
import { toLower } from '../../utils';
import { DocumentFragment } from './DocumentFragment';
import { PostMessage } from '../worker-thread';
import { observe } from '../MutationTransfer';
import { NodeType, HTML_NAMESPACE } from '../../transfer/TransferrableNodes';
import { propagate as propagateEvents } from '../Event';
import { propagate as propagateSyncValues } from '../SyncValuePropagation';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';

const DOCUMENT_NAME = '#document';

export class Document extends Element {
  public defaultView: {
    document: Document;
    MutationObserver: typeof MutationObserver;
    Document: typeof Document;
    Node: typeof Node;
    Comment: typeof Comment;
    Text: typeof Text;
    Element: typeof Element;
    SVGElement: typeof SVGElement;
    Event: typeof Event;
  };
  public documentElement: Document;
  public body: Element;
  public postMessage: PostMessage;
  public [TransferrableKeys.allowTransfer]: boolean = true;

  constructor() {
    super(NodeType.DOCUMENT_NODE, DOCUMENT_NAME, HTML_NAMESPACE, null);
    // Element uppercases its nodeName, but Document doesn't.
    this.nodeName = DOCUMENT_NAME;
    this.documentElement = this;
    this.observe = (): void => {
      // Sync Document Changes.
      observe();
      propagateEvents();
      propagateSyncValues();
    };
    this.defaultView = {
      document: this,
      MutationObserver,
      Document,
      Node,
      Comment,
      Text,
      Element,
      SVGElement,
      Event,
    };
  }

  public createElement(name: string): Element {
    return this.createElementNS(HTML_NAMESPACE, toLower(name));
  }
  public createElementNS(namespaceURI: NamespaceURI, localName: string): Element {
    const constructor = NS_NAME_TO_CLASS[`${namespaceURI}:${localName}`] || HTMLElement;
    return new constructor(NodeType.ELEMENT_NODE, localName, namespaceURI, this);
  }

  public createTextNode(text: string): Text {
    return new Text(text, this);
  }
  public createComment(text: string): Comment {
    return new Comment(text, this);
  }
  public createDocumentFragment(): DocumentFragment {
    return new DocumentFragment(this);
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
 */
export function createDocument(postMessage?: PostMessage): Document {
  const doc = new Document();
  doc.postMessage = postMessage || (() => void 0);
  doc.isConnected = true;
  doc.appendChild((doc.body = doc.createElement('body')));

  return doc;
}

/** Should only be used for testing. */
export const documentForTesting = createDocument();
