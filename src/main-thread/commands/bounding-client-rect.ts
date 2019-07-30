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

import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { MessageType } from '../../transfer/Messages';
import { CommandExecutorInterface } from './interface';
import { BoundClientRectMutationIndex } from '../../transfer/TransferrableBoundClientRect';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';

export const BoundingClientRectProcessor: CommandExecutorInterface = (strings, nodes, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.GET_BOUNDING_CLIENT_RECT);

  return {
    execute(mutations: Uint16Array, startPosition: number): number {
      if (allowedExecution) {
        const targetIndex = mutations[startPosition + BoundClientRectMutationIndex.Target];
        const target = nodes.getNode(targetIndex);
        if (target) {
          const boundingRect = target.getBoundingClientRect();
          workerContext.messageToWorker({
            [TransferrableKeys.type]: MessageType.GET_BOUNDING_CLIENT_RECT,
            [TransferrableKeys.target]: [target._index_],
            [TransferrableKeys.data]: [
              boundingRect.top,
              boundingRect.right,
              boundingRect.bottom,
              boundingRect.left,
              boundingRect.width,
              boundingRect.height,
            ],
          });
        } else {
          console.error(`GET_BOUNDING_CLIENT_RECT: getNode(${targetIndex}) is null.`);
        }
      }

      return startPosition + BoundClientRectMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number): Object {
      const targetIndex = mutations[startPosition + BoundClientRectMutationIndex.Target];
      const target = nodes.getNode(targetIndex);
      return {
        type: 'GET_BOUNDING_CLIENT_RECT',
        target,
        allowedExecution,
      };
    },
  };
};
