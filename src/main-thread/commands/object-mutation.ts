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

import { TransferrableMutationType, ObjectMutationIndex } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';
import { deserializeTransferrableObject } from '../deserializeTransferrableObject';

export const ObjectMutationProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.OBJECT_MUTATION);

  return {
    execute(mutations: Uint16Array, startPosition: number): number {
      const functionName = strings.get(mutations[startPosition + ObjectMutationIndex.FunctionName]);
      const argCount = mutations[startPosition + ObjectMutationIndex.ArgumentCount];

      const { offset: targetOffset, args: deserializedTarget } = deserializeTransferrableObject(
        mutations,
        startPosition + ObjectMutationIndex.SerializedTarget,
        1,
        strings,
        nodeContext,
        objectContext,
      );
      const target = deserializedTarget[0] as any;

      const { offset: argsOffset, args } = deserializeTransferrableObject(mutations, targetOffset, argCount, strings, nodeContext, objectContext);

      if (allowedExecution) {
        if (isSetter(target, functionName)) {
          target[functionName] = args[0];
        } else {
          target[functionName](...args);
        }
      }

      return argsOffset;
    },
    print(mutations: Uint16Array, startPosition: number): Object {
      const functionName = strings.get(mutations[startPosition + ObjectMutationIndex.FunctionName]);
      const { args: deserializedTarget } = deserializeTransferrableObject(
        mutations,
        startPosition + ObjectMutationIndex.SerializedTarget,
        1,
        strings,
        nodeContext,
        objectContext,
      );
      const target = deserializedTarget[0] as RenderableElement;

      return {
        type: 'OBJECT_MUTATION',
        target,
        functionName,
        isSetter: isSetter(target, functionName),
        allowedExecution,
      };
    },
  };
};

function isSetter(object: Object, name: string): boolean {
  if (!object) {
    throw new Error(`Property ${name} does not exist on ${object}.`);
  }

  const descriptor = Object.getOwnPropertyDescriptor(object, name);

  if (descriptor !== undefined) {
    return 'set' in descriptor;
  }

  return isSetter(Object.getPrototypeOf(object), name);
}
