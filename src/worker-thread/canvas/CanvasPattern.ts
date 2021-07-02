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

import { TransferrableObjectType } from '../../transfer/TransferrableMutation';
import { TransferrableObject } from '../worker-thread';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';

/**
 * Wrapper class for CanvasPattern. The user will be able to manipulate as a regular CanvasPattern object.
 * This class will be used when the CanvasRenderingContext is using an OffscreenCanvas polyfill.
 */
export class CanvasPattern implements TransferrableObject {
  private id: number;

  constructor(id: number) {
    this.id = id;
  }

  /**
   * This is an experimental method.
   */
  setTransform() {}

  [TransferrableKeys.serializeAsTransferrableObject](): number[] {
    return [TransferrableObjectType.TransferObject, this.id];
  }
}
