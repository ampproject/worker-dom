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

import { CommandExecutorInterface } from './interface';
import { TransferrableMutationType, ImageBitmapMutationIndex } from '../../transfer/TransferrableMutation';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { MessageType } from '../../transfer/Messages';

export const ImageBitmapProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.IMAGE_BITMAP_INSTANCE);

  return {
    execute(mutations: Uint16Array, startPosition: number): number {
      if (allowedExecution) {
        const targetIndex = mutations[startPosition + ImageBitmapMutationIndex.Target];
        const target = nodeContext.getNode(targetIndex);
        if (target) {
          self.createImageBitmap(target as HTMLImageElement | HTMLCanvasElement).then(imageBitmap => {
            workerContext.messageToWorker(
              {
                [TransferrableKeys.type]: MessageType.IMAGE_BITMAP_INSTANCE,
                [TransferrableKeys.callIndex]: mutations[startPosition + ImageBitmapMutationIndex.CallIndex],
                [TransferrableKeys.data]: imageBitmap,
              },
              [imageBitmap],
            );
          });
        } else {
          console.error(`IMAGE_BITMAP_INSTANCE: getNode(${targetIndex}) is null.`);
        }
      }

      return startPosition + ImageBitmapMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number): Object {
      const targetIndex = mutations[startPosition + ImageBitmapMutationIndex.Target];
      const target = nodeContext.getNode(targetIndex);
      return {
        type: 'IMAGE_BITMAP_INSTANCE',
        target,
        allowedExecution,
        callIndex: mutations[startPosition + ImageBitmapMutationIndex.CallIndex],
      };
    },
  };
};
