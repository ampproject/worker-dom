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

import { HydrateableNode, NodeType } from '../transfer/TransferrableNodes';
import { store as storeString } from './strings';
import { store as storeNode } from './nodes';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { RenderableElement } from './worker-thread';
import { Document } from './dom/Document';
import { HTMLElement } from './dom/HTMLElement';
import { SVGElement } from './dom/SVGElement';
import { set as setPhase, Phases } from '../transfer/phase';

export function consumeInitialDOM(document: Document, strings: Array<string>, hydrateableNode: HydrateableNode): void {
  strings.forEach(storeString);
  (hydrateableNode[TransferrableKeys.childNodes] || []).forEach(child => document.body.appendChild(create(document, strings, child)));
  setPhase(Phases.Hydrating);
}

export function create(document: Document, strings: Array<string>, skeleton: HydrateableNode): RenderableElement {
  switch (skeleton[TransferrableKeys.nodeType]) {
    case NodeType.TEXT_NODE:
      const text = document.createTextNode(strings[skeleton[TransferrableKeys.textContent] as number]);
      storeNode(text);
      return text;
    case NodeType.COMMENT_NODE:
      const comment = document.createComment(strings[skeleton[TransferrableKeys.textContent] as number]);
      storeNode(comment);
      return comment;
    default:
      const namespace: string | undefined =
        skeleton[TransferrableKeys.namespaceURI] !== undefined ? strings[skeleton[TransferrableKeys.namespaceURI] as number] : undefined;
      const nodeName = strings[skeleton[TransferrableKeys.nodeName]];
      const node: HTMLElement | SVGElement = namespace
        ? (document.createElementNS(namespace, nodeName) as SVGElement)
        : document.createElement(nodeName);
      (skeleton[TransferrableKeys.attributes] || []).forEach(attribute => {
        const namespaceURI = strings[attribute[0]];
        if (namespaceURI !== 'null') {
          node.setAttributeNS(namespaceURI, strings[attribute[1]], strings[attribute[2]]);
        } else {
          node.setAttribute(strings[attribute[1]], strings[attribute[2]]);
        }
      });
      storeNode(node);
      (skeleton[TransferrableKeys.childNodes] || []).forEach(child => node.appendChild(create(document, strings, child)));
      return node;
  }
}
