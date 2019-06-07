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

import { SerializableObject } from './worker-thread';
import { TransferrableArgs } from '../transfer/TransferrableArgs';
import { Document } from './dom/Document';
import { transfer } from './MutationTransfer';
import { TransferrableMutationType } from '../transfer/TransferrableMutation';
import { store } from './strings';
import { serialize } from './global-id';
import { TransferrableKeys } from '../transfer/TransferrableKeys';

export class TransferObject implements SerializableObject {
  private id: number;
  private document: Document;

  /**
   * @param id Identifying number for object.
   * @param document Document where object will be used.
   * @param creationMethod Method to use to create this object. In this case, "new" means the object constructor should be used.
   * @param serializedCreationObject The object needed to create the corresponding object in the main thread, serialized.
   * @param args Arguments needed for object creation.
   */
  constructor(id: number, document: Document, creationMethod: string, serializedCreationObject: number[], args: any[]) {
    this.id = id;
    this.document = document;
    this.createObjectReference(serializedCreationObject, creationMethod, args);
  }

  /**
   * Creates object in the main thread, and associates it with this object with the id provided.
   * @param serializedCreationObject The object needed to create the corresponding object in the main thread, serialized.
   * @param creationMethod Method to use to create this object. In this case, "new" means the object constructor should be used.
   * @param args Arguments needed for object creation.
   */
  private createObjectReference(serializedCreationObject: number[], creationMethod: string, args: any[]) {
    transfer(this.document, [
      TransferrableMutationType.OBJECT_CREATION,
      this.document.body[TransferrableKeys.index], // some filler ID for main-thread/mutator.ts to read
      ...serializedCreationObject,
      store(creationMethod),
      this.id,
      args.length,
      ...serialize(args),
    ]);
  }

  /**
   * Mutates the corresponding object in the main thread.
   * @param method
   * @param args
   */
  protected mutateObject(method: string, args: any[]) {
    transfer(this.document, [
      TransferrableMutationType.OBJECT_MUTATION,
      this.document.body[TransferrableKeys.index], // some filler id for main-thread/mutator.ts to read
      ...this.serialize(),
      store(method),
      args.length,
      ...serialize(args),
    ]);
  }

  getId(): number {
    return this.id;
  }

  serialize(): number[] {
    return [TransferrableArgs.TransferObject, this.id];
  }
}
