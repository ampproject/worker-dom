/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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

import { Document } from '../dom/Document';
import { transfer } from '../MutationTransfer';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { serializeTransferrableObject } from '../serializeTransferrableObject';
import { store } from '../strings';
import { TransferrableObject } from '../worker-thread';
import { TransferrableObjectType } from '../../transfer/TransferrableMutation';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';

/**
 * Wrapper class for CanvasGradient. The user will be able to manipulate as a regular CanvasGradient object.
 */
export class CanvasGradient implements TransferrableObject {
  private id: number;
  private document: Document;

  constructor(id: number, document: Document) {
    this.document = document;
    this.id = id;
  }

  addColorStop(offset: number, color: string) {
    transfer(this.document, [
      TransferrableMutationType.OBJECT_MUTATION,
      store('addColorStop'),
      2, // arg count
      ...this[TransferrableKeys.serializeAsTransferrableObject](),
      ...serializeTransferrableObject([...arguments]),
    ]);
  }

  [TransferrableKeys.serializeAsTransferrableObject](): number[] {
    return [TransferrableObjectType.TransferObject, this.id];
  }
}
