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

/**
 * Wrapper class for CanvasGradient. The user will be able to manipulate as a regular CanvasGradient object.
 */
export class CanvasGradient implements TransferrableObject {
  private id: number;
  private document: Document;

  constructor(id: number, document: Document, method: string, args: number[], serializedCreationObject: number[]) {
    this.document = document;
    this.id = id;
    this.createObjectReference(serializedCreationObject, method, args);
  }

  /**
   * Creates CanvasGradient object in the main thread, and associates it with this object with the id provided.
   * @param serializedCreationObject The target object needed to create the corresponding object in the main thread, serialized.
   * @param creationMethod Method to use to create this object.
   * @param args Arguments needed for object creation.
   */
  private createObjectReference(serializedCreationObject: number[], creationMethod: string, args: number[]) {
    transfer(this.document, [
      TransferrableMutationType.OBJECT_CREATION,
      store(creationMethod),
      this.id,
      args.length,
      ...serializedCreationObject,
      ...serializeTransferrableObject(args),
    ]);
  }

  addColorStop(offset: number, color: string) {
    transfer(this.document, [
      TransferrableMutationType.OBJECT_MUTATION,
      store('addColorStop'),
      2, // arg count
      ...this.serializeAsTransferrableObject(),
      ...serializeTransferrableObject([...arguments]),
    ]);
  }

  serializeAsTransferrableObject(): number[] {
    return [TransferrableObjectType.TransferObject, this.id];
  }
}
