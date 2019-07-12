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

import { TransferrableMutationType, ObjectCreationIndex } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';
import { deserializeTransferrableObject } from '../deserializeTransferrableObject';

export const ObjectCreationProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.OBJECT_CREATION);

  if (!objectContext) {
    throw new Error('objectContext is not defined.');
  }

  return {
    execute(mutations: Uint16Array, startPosition: number): number {
      const functionName = strings.get(mutations[startPosition + ObjectCreationIndex.FunctionName]);
      const objectId = mutations[startPosition + ObjectCreationIndex.ObjectId];
      const argCount = mutations[startPosition + ObjectCreationIndex.ArgumentCount];

      const { offset: targetOffset, args: deserializedTarget } = deserializeTransferrableObject(
        mutations,
        startPosition + ObjectCreationIndex.SerializedTarget,
        1, // argCount
        strings,
        nodeContext,
        objectContext,
      );
      const target = deserializedTarget[0] as any;

      const { offset: argsOffset, args } = deserializeTransferrableObject(mutations, targetOffset, argCount, strings, nodeContext, objectContext);

      if (allowedExecution) {
        if (functionName === 'new') {
          // deal with constructor case here
        } else {
          objectContext.store(objectId, target[functionName](...args));
        }
      }

      return argsOffset;
    },
    print(mutations: Uint16Array, startPosition: number): Object {
      const functionName = strings.get(mutations[startPosition + ObjectCreationIndex.FunctionName]);
      const objectId = mutations[startPosition + ObjectCreationIndex.ObjectId];
      const argCount = mutations[startPosition + ObjectCreationIndex.ArgumentCount];

      const { args: deserializedTarget } = deserializeTransferrableObject(
        mutations,
        startPosition + ObjectCreationIndex.SerializedTarget,
        1, // argCount
        strings,
        nodeContext,
        objectContext,
      );
      const target = deserializedTarget[0] as RenderableElement;

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
