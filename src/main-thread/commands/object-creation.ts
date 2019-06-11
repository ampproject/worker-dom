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

  if (!transferObjects) {
    throw new Error('transferObjects is not defined.');
  }

  return {
    execute(mutations: Uint16Array, startPosition: number, target: RenderableElement): number {
      let { offset, args: deserializedTarget } = deserialize(
        mutations,
        startPosition + ObjectTransferMutationIndex.Target,
        1, // argCount
        strings,
        nodeContext,
        transferObjects,
      );
      target = deserializedTarget[0] as RenderableElement;

      const functionName = strings.get(mutations[offset++]);
      const objectId = mutations[offset++];

      const argCount = mutations[offset++];
      const { offset: argsOffset, args } = deserialize(mutations, offset, argCount, strings, nodeContext, transferObjects);

      if (allowedExecution) {
        if (functionName === 'new') {
          // deal with constructor case here
        } else {
          transferObjects.store(objectId, target[functionName](...args));
        }
      }

      return argsOffset;
    },
    print(mutations: Uint16Array, startPosition: number, target?: RenderableElement | null): Object {
      let { offset, args: deserializedArgs } = deserialize(
        mutations,
        startPosition + ObjectTransferMutationIndex.Target,
        1, // argCount
        strings,
        nodeContext,
        transferObjects,
      );
      target = deserializedArgs[0] as RenderableElement;
      const functionName = strings.get(mutations[offset++]);
      const objectId = mutations[offset++];
      const argCount = mutations[offset++];

      return {
        type: 'OBJECT_CREATION',
        target,
        functionName,
        objectId,
        argCount,
        allowedExecution,
      };
    },
  };
};
