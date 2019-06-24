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

import { transfer } from '../MutationTransfer';
import { Document } from '../dom/Document';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { ImageBitmapToWorker, MessageType } from '../../transfer/Messages';
import { HTMLElement } from '../dom/HTMLElement';
import { CanvasImageSource } from './CanvasTypes';

/**
 * Wraps CanvasPattern for usage in a native OffscreenCanvas case.
 */
export class FakeNativeCanvasPattern<ElementType extends HTMLElement> {
  private realPattern = {} as CanvasPattern; // Actual pattern to be used

  get implementation(): CanvasPattern {
    return this.realPattern;
  }

  /**
   * Retrieves ImageBitmap object from main-thread, which replicates the input image. Upon
   * retrieval, uses it to create a real CanvasPattern and upgrade the implementation property.
   * @param canvas Canvas element used to create the pattern.
   * @param image Image to be used as the pattern's image
   * @param repetition DOMStrings indicating how to repeat the pattern's image.
   */
  getCanvasPatternAsync(canvas: ElementType, image: CanvasImageSource, repetition: string): Promise<void> {
    return new Promise(resolve => {
      const messageHandler = ({ data }: { data: ImageBitmapToWorker }) => {
        if (
          data[TransferrableKeys.type] === MessageType.IMAGE_BITMAP_INSTANCE &&
          data[TransferrableKeys.target][0] === (image as any)[TransferrableKeys.index]
        ) {
          removeEventListener('message', messageHandler);
          const transferredImageBitmap = (data as ImageBitmapToWorker)[TransferrableKeys.data];
          resolve(transferredImageBitmap);
        }
      };

      if (typeof addEventListener !== 'function') {
        throw new Error('addEventListener not a function!');
      } else {
        addEventListener('message', messageHandler);
        transfer(canvas.ownerDocument as Document, [TransferrableMutationType.IMAGE_BITMAP_INSTANCE, (image as any)[TransferrableKeys.index]]);
      }
    }).then((instance: ImageBitmap) => {
      const pattern = canvas.getContext('2d').createPattern(instance, repetition);

      if (!pattern) {
        throw new Error('Pattern is null!');
      }

      this.realPattern = pattern;
    });
  }

  // This method is experimental.
  // Takes an SVGMatrix as an argument, which is a deprecated API.
  setTransform() {}
}
