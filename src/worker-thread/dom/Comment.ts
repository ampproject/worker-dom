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

import { CharacterData } from './CharacterData';
import { NumericBoolean } from '../../utils';
import { store as storeString } from '../strings';
import { Node } from './Node';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { NodeType } from '../../transfer/TransferrableNodes';

// @see https://developer.mozilla.org/en-US/docs/Web/API/Comment
export class Comment extends CharacterData {
  constructor(data: string, ownerDocument: Node) {
    super(data, NodeType.COMMENT_NODE, '#comment', ownerDocument);
    this[TransferrableKeys.creationFormat] = [
      this[TransferrableKeys.index],
      NodeType.COMMENT_NODE,
      storeString(this.nodeName),
      NumericBoolean.TRUE,
      storeString(this.data),
      NumericBoolean.FALSE,
      0,
    ];
  }

  /**
   * textContent getter, retrieves underlying CharacterData data.
   * This is a different implmentation than DOMv1-4 APIs, but should be transparent to Frameworks.
   */
  get textContent(): string {
    return this.data;
  }

  /**
   * textContent setter, mutates underlying CharacterData data.
   * This is a different implmentation than DOMv1-4 APIs, but should be transparent to Frameworks.
   * @param value new value
   */
  set textContent(value: string) {
    // Mutation Observation is performed by CharacterData.
    this.nodeValue = value;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode
   * @return new Comment Node with the same data as the Comment to clone.
   */
  public cloneNode(): Comment {
    return this.ownerDocument.createComment(this.data);
  }
}
