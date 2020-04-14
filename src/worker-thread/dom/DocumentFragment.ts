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

import { ParentNode } from './ParentNode';
import { store as storeString } from '../strings';
import { Node } from './Node';
import { NodeType } from '../../transfer/TransferrableNodes';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';

export class DocumentFragment extends ParentNode {
  constructor(ownerDocument: Node, overrideIndex?: number) {
    super(NodeType.DOCUMENT_FRAGMENT_NODE, '#document-fragment', ownerDocument, overrideIndex);

    this[TransferrableKeys.creationFormat] = [this[TransferrableKeys.index], NodeType.DOCUMENT_FRAGMENT_NODE, storeString(this.nodeName), 0, 0];
  }

  /**
   * @param deep boolean determines if the clone should include a recursive copy of all childNodes.
   * @return DocumentFragment containing childNode clones of the DocumentFragment requested to be cloned.
   */
  public cloneNode(deep: boolean = false): DocumentFragment {
    const clone: DocumentFragment = this.ownerDocument.createDocumentFragment();
    if (deep) {
      this.childNodes.forEach((child) => clone.appendChild(child.cloneNode(deep)));
    }
    return clone;
  }
}
