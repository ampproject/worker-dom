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

import { Node, NodeName } from './Node';
import { mutate } from '../MutationObserver';
import { MutationRecordType } from '../MutationRecord';
import { store as storeString } from '../strings';
import { Document } from './Document';
import { NodeType } from '../../transfer/TransferrableNodes';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';

// @see https://developer.mozilla.org/en-US/docs/Web/API/CharacterData
export abstract class CharacterData extends Node {
  private [TransferrableKeys.data]: string;

  constructor(data: string, nodeType: NodeType, nodeName: NodeName, ownerDocument: Node, overrideIndex?: number) {
    super(nodeType, nodeName, ownerDocument, overrideIndex);
    this[TransferrableKeys.data] = data;

    this[TransferrableKeys.creationFormat] = [this[TransferrableKeys.index], nodeType, storeString(nodeName), storeString(data), 0];
  }

  // Unimplemented Methods
  // NonDocumentTypeChildNode.nextElementSibling – https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/nextElementSibling
  // NonDocumentTypeChildNode.previousElementSibling – https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/previousElementSibling
  // CharacterData.appendData() – https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/appendData
  // CharacterData.deleteData() – https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/deleteData
  // CharacterData.insertData() – https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/insertData
  // CharacterData.replaceData() – https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/replaceData
  // CharacterData.substringData() – https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/substringData

  /**
   * @return Returns the string contained in private CharacterData.data
   */
  get data(): string {
    return this[TransferrableKeys.data];
  }

  /**
   * @param value string value to store as CharacterData.data.
   */
  set data(value: string) {
    const oldValue = this.data;
    this[TransferrableKeys.data] = value;

    mutate(
      this.ownerDocument as Document,
      {
        target: this,
        type: MutationRecordType.CHARACTER_DATA,
        value,
        oldValue,
      },
      [TransferrableMutationType.CHARACTER_DATA, this[TransferrableKeys.index], storeString(value)],
    );
  }

  /**
   * @return Returns the size of the string contained in CharacterData.data
   */
  get length(): number {
    return this[TransferrableKeys.data].length;
  }

  /**
   * @return Returns the string contained in CharacterData.data
   */
  get nodeValue(): string {
    return this[TransferrableKeys.data];
  }

  /**
   * @param value string value to store as CharacterData.data.
   */
  set nodeValue(value: string) {
    this.data = value;
  }
}
