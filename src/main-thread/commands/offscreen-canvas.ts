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

import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { MessageType } from '../../transfer/Messages';
import { CommandExecutorInterface } from './interface';
import { OffscreenCanvasMutationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';

export const OffscreenCanvasProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.OFFSCREEN_CANVAS_INSTANCE);

  return {
    execute(mutations: Uint16Array, startPosition: number): number {
      if (allowedExecution) {
        const targetIndex = mutations[startPosition + OffscreenCanvasMutationIndex.Target];
        const target = nodeContext.getNode(targetIndex);
        if (target) {
          const offscreen = (target as HTMLCanvasElement).transferControlToOffscreen();
          workerContext.messageToWorker(
            {
              [TransferrableKeys.type]: MessageType.OFFSCREEN_CANVAS_INSTANCE,
              [TransferrableKeys.target]: [target._index_],
              [TransferrableKeys.data]: offscreen, // Object, an OffscreenCanvas
            },
            [offscreen],
          );
        } else {
          console.error(`'OFFSCREEN_CANVAS_INSTANCE': getNode(${targetIndex}) is null.`);
        }
      }

      return startPosition + OffscreenCanvasMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number, target?: RenderableElement | null): Object {
      return {
        type: 'OFFSCREEN_CANVAS_INSTANCE',
        target,
        allowedExecution,
      };
    },
  };
};
