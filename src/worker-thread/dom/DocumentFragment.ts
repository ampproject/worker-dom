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

import { Node } from './Node';
import { NodeType } from '../../transfer/TransferrableNodes';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { NumericBoolean } from '../../utils';
import { store as storeString } from '../strings';

export class DocumentFragment extends Node {
  constructor() {
    super(NodeType.DOCUMENT_FRAGMENT_NODE, '#document-fragment');

    this[TransferrableKeys._creationFormat_] = {
      [TransferrableKeys._index_]: this[TransferrableKeys._index_],
      [TransferrableKeys.transferred]: NumericBoolean.FALSE,
      [TransferrableKeys.nodeType]: NodeType.DOCUMENT_FRAGMENT_NODE,
      [TransferrableKeys.nodeName]: storeString(this.nodeName),
    };
  }

  public cloneNode(deep: boolean = false): DocumentFragment {
    const clone: DocumentFragment = this.ownerDocument.createDocumentFragment();
    if (deep) {
      this.childNodes.forEach((child: Node) => clone.appendChild(child.cloneNode(deep)));
    }
    return clone;
  }
}
