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
import { Node } from './Node';
import { NodeType } from '../../transfer/TransferrableNodes';

// @see https://developer.mozilla.org/en-US/docs/Web/API/Text
export class Text extends CharacterData {
  constructor(data: string, ownerDocument: Node, overrideIndex?: number) {
    super(data, NodeType.TEXT_NODE, '#text', ownerDocument, overrideIndex);
  }

  // Unimplemented Properties
  // Text.isElementContentWhitespace – https://developer.mozilla.org/en-US/docs/Web/API/Text/isElementContentWhitespace
  // Text.wholeText – https://developer.mozilla.org/en-US/docs/Web/API/Text/wholeText
  // Text.assignedSlot – https://developer.mozilla.org/en-US/docs/Web/API/Text/assignedSlot

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
   * @return new Text Node with the same data as the Text to clone.
   */
  public cloneNode(): Text {
    return this.ownerDocument.createTextNode(this.data);
  }

  /**
   * Breaks Text node into two nodes at the specified offset, keeping both nodes in the tree as siblings.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Text/splitText
   * @param offset number position to split text at.
   * @return Text Node after the offset.
   */
  public splitText(offset: number): Text {
    const remainderTextNode = new Text(this.data.slice(offset, this.data.length), this.ownerDocument);
    const parentNode = this.parentNode;

    this.nodeValue = this.data.slice(0, offset);
    if (parentNode !== null) {
      // When this node is attached to the DOM, the remainder text needs to be inserted directly after.
      const parentChildNodes = parentNode.childNodes;
      const insertBeforePosition = parentChildNodes.indexOf(this) + 1;
      const insertBeforeNode = parentChildNodes.length >= insertBeforePosition ? parentChildNodes[insertBeforePosition] : null;

      return parentNode.insertBefore(remainderTextNode, insertBeforeNode) as Text;
    }

    return remainderTextNode;
  }
}
