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

export const ObjectMutationProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, config, transferObjects) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.OBJECT_MUTATION);

  return {
    execute(mutations: Uint16Array, startPosition: number, target: RenderableElement): number {
      let { offset, args: deserializedArgs } = deserialize(
        mutations,
        startPosition + ObjectTransferMutationIndex.Target,
        1,
        strings,
        nodeContext,
        transferObjects,
      );
      target = deserializedArgs[0] as RenderableElement;

      const functionName = strings.get(mutations[offset++]);
      const argCount = mutations[offset++];

      const { offset: argsOffset, args } = deserialize(mutations, offset, argCount, strings, nodeContext, transferObjects);

      if (allowedExecution) {
        if (isSetter(target, functionName)) {
          target[functionName] = args[0];
        } else {
          target[functionName](...args);
        }
      }

      return argsOffset;
    },
    print(mutations: Uint16Array, startPosition: number, target?: RenderableElement | null): Object {
      let { offset, args: deserializedArgs } = deserialize(
        mutations,
        startPosition + ObjectTransferMutationIndex.Target,
        1,
        strings,
        nodeContext,
        transferObjects,
      );
      target = deserializedArgs[0] as RenderableElement;
      const functionName = strings.get(mutations[offset++]);

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
    throw new Error("Property '" + name + "' does not exist on " + object + '.');
  }

  const descriptor = Object.getOwnPropertyDescriptor(object, name);

  if (descriptor !== undefined) {
    return typeof descriptor.set !== 'undefined';
  }

  return isSetter(Object.getPrototypeOf(object), name);
}
