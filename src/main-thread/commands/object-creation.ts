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

import { TransferrableMutationType, ObjectTransferMutationIndex } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';
import { deserialize } from '../global-id';

export const ObjectCreationProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, config, transferObjects) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.OBJECT_CREATION);

  return {
    execute(mutations: Uint16Array, startPosition: number, target: RenderableElement): number {
      if (!transferObjects) {
        throw new Error('transferObjects is not defined.');
      }

      let { offset, args: des } = deserialize(
        mutations,
        startPosition + ObjectTransferMutationIndex.Target,
        1,
        strings,
        nodeContext,
        transferObjects,
      );
      target = des[0] as RenderableElement;

      const functionName = strings.get(mutations[offset++]);
      const objectId = mutations[offset++];

      const argCount = mutations[offset++];
      const { offset: argsOffset, args } = deserialize(mutations, offset, argCount, strings, nodeContext, transferObjects);

      if (allowedExecution) {
        if (functionName === 'new') {
          // deal with constructor case here
        } else {
          transferObjects.store(target[functionName](...args), objectId);
        }
      }

      return argsOffset;
    },
    print(mutations: Uint16Array, startPosition: number, target?: RenderableElement | null): Object {
      return {};
    },
  };
};
