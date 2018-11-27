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
import { NodeType } from '../../transfer/TransferrableNodes';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { NumericBoolean } from '../../utils';
import { store as storeString } from '../strings';
import { Node, propagate } from './Node';

export class DocumentFragment extends ParentNode {
  constructor() {
    super(NodeType.DOCUMENT_FRAGMENT_NODE, '#document-fragment');

    this[TransferrableKeys._creationFormat_] = {
      [TransferrableKeys._index_]: this[TransferrableKeys._index_],
      [TransferrableKeys.transferred]: NumericBoolean.FALSE,
      [TransferrableKeys.nodeType]: NodeType.DOCUMENT_FRAGMENT_NODE,
      [TransferrableKeys.nodeName]: storeString(this.nodeName),
    };
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
   * @param child
   * @param referenceNode
   * @return child after it has been inserted.
   */
  public insertBefore(child: Node | null, referenceNode: Node | undefined | null): Node | null {
    const inserted = super.insertBefore(child, referenceNode);
    if (inserted) {
      propagate(inserted, 'isConnected', false);
    }
    return inserted;
  }

  /**
   * Adds the specified childNode argument as the last child to the current node.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
   * @param child Child Node to append to this Node.
   * @return Node the appended node.
   */
  public appendChild(child: Node): Node {
    const inserted = super.appendChild(child);
    if (inserted) {
      propagate(inserted, 'isConnected', false);
    }
    return inserted;
  }

  /**
   * @param deep boolean determines if the clone should include a recursive copy of all childNodes.
   * @return DocumentFragment containing childNode clones of the DocumentFragment requested to be cloned.
   */
  public cloneNode(deep: boolean = false): DocumentFragment {
    const clone: DocumentFragment = this.ownerDocument.createDocumentFragment();
    if (deep) {
      this.childNodes.forEach(child => clone.appendChild(child.cloneNode(deep)));
    }
    return clone;
  }
}
