/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
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

/**
 * A mapping between each request to callFunction and its Promise.
 */
const promiseMap: {
  [id: number]: {
    promise: Promise<any>;
    resolve: (arg: any) => void;
    reject: (arg: any) => void;
  };
} = {};

/**
 * Each invocation of `ExportedWorker.prototype.callFunction` needs to be registered with a unique index
 * and promise. The index is given to the underlying Worker and returned by it as well. That enables the main-thread to
 * correlate postMessage responses with their original requests and resolve/reject the correct Promise.
 */
export function registerPromise(): { promise: Promise<any>; index: number } {
  // TS won't realize that the constructor promise assigns the handlers, so we `any` them.
  let resolve: any;
  let reject: any;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  // Wraparound to 0 in case someone attempts to register over 9 quadrillion promises.
  if (fnCallCount >= Number.MAX_VALUE) {
    fnCallCount = 0;
  }
  const index = fnCallCount++;

  promiseMap[index] = { promise, resolve, reject };
  return { promise, index };
}

export const FunctionProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.FUNCTION_CALL);

  return {
    execute(mutations: Uint16Array, startPosition: number): number {
      if (allowedExecution) {
        const status = mutations[startPosition + FunctionMutationIndex.Status];
        const index = mutations[startPosition + FunctionMutationIndex.Index];
        const value = mutations[startPosition + FunctionMutationIndex.Value];

        const parsed = strings.hasIndex(value) ? JSON.parse(strings.get(value)) : undefined;
        if (status === ResolveOrReject.RESOLVE) {
          promiseMap[index].resolve(parsed);
        } else {
          promiseMap[index].reject(parsed);
        }
        delete promiseMap[index];
      }
      return startPosition + FunctionMutationIndex.End;
    },

    print(mutations: Uint16Array, startPosition: number): {} {
      const status = mutations[startPosition + FunctionMutationIndex.Status];
      const index = mutations[startPosition + FunctionMutationIndex.Index];
      const value = mutations[startPosition + FunctionMutationIndex.Value];

      return {
        type: 'FUNCTION_INVOCATION',
        status,
        index,
        value: strings.get(value),
        allowedExecution,
      };
    },
  };
};
