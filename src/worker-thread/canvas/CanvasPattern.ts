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
import { TransferrableMutationType, TransferrableObjectType } from '../../transfer/TransferrableMutation';
import { store } from '../strings';
import { serializeTransferrableObject } from '../serializeTransferrableObject';
import { TransferrableObject } from '../worker-thread';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';

/**
 * Wrapper class for CanvasPattern. The user will be able to manipulate as a regular CanvasPattern object.
 * This class will be used when the CanvasRenderingContext is using an OffscreenCanvas polyfill.
 */
export class CanvasPattern implements TransferrableObject {
  private id: number;
  private document: Document;

  constructor(id: number, document: Document, args: any[], serializedCreationObject: number[]) {
    this.id = id;
    this.document = document;
    this.createObjectReference(serializedCreationObject, args);
  }

  /**
   * Creates CanvasPattern object in the main thread, and associates it with this object with the id provided.
   * @param serializedCreationObject The target object needed to create the corresponding object in the main thread, serialized.
   * @param creationMethod Method to use to create this object.
   * @param args Arguments needed for object creation.
   */
  private createObjectReference(serializedCreationObject: number[], args: any[]) {
    transfer(this.document, [
      TransferrableMutationType.OBJECT_CREATION,
      store('createPattern'),
      this.id,
      2, // arg count
      ...serializedCreationObject,
      ...serializeTransferrableObject(args),
    ]);
  }

  /**
   * This is an experimental method.
   */
  setTransform() {}

  [TransferrableKeys.serializeAsTransferrableObject](): number[] {
    return [TransferrableObjectType.TransferObject, this.id];
  }
}
