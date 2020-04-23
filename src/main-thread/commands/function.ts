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
import { TransferrableMutationType, FunctionMutationIndex } from '../../transfer/TransferrableMutation';
import { ResolveOrReject } from '../../transfer/Messages';

let fnCallCount = 0;
const promiseMap: { [id: number]: any } = {};
export function registerPromise(): { promise: Promise<any>; index: number } {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  let index = fnCallCount;
  promiseMap[index] = { resolve, reject, promise };
  return { promise, index: fnCallCount++ };
}

export const FunctionProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.FUNCTION_INVOCATION);

  return {
    execute(mutations: Uint16Array, startPosition: number): number {
      if (allowedExecution) {
        const status = mutations[startPosition + FunctionMutationIndex.Status];
        const index = mutations[startPosition + FunctionMutationIndex.Index];
        const value = mutations[startPosition + FunctionMutationIndex.Value];

        if (status === ResolveOrReject.RESOLVE) {
          promiseMap[index].resolve(strings.get(value));
        } else {
          promiseMap[index].reject(strings.get(value));
        }
        delete promiseMap[index];
      }
      return startPosition + FunctionMutationIndex.End;
    },

    print(mutations: Uint16Array, startPosition: number): Object {
      const index = mutations[startPosition + FunctionMutationIndex.Index];
      const value = mutations[startPosition + FunctionMutationIndex.Value];

      return {
        type: 'FUNCTION_INVOCATION',
        index,
        value: strings.get(value),
        allowedExecution,
      };
    },
  };
};
