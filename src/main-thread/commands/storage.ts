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
import { TransferrableMutationType, StorageMutationIndex } from '../../transfer/TransferrableMutation';

export const StorageProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.PROPERTIES);

  /**
   * @param scope
   * @param k
   * @param v
   */
  const setItem = (scope: string, k: string, v: string) => {
    if (scope == 'local') {
      window.localStorage.setItem(k, v);
    } else if (scope == 'session') {
      window.sessionStorage.setItem(k, v);
    }
  };

  /**
   * @param scope
   * @param k
   */
  const removeItem = (scope: string, k: string) => {
    if (scope == 'local') {
      window.localStorage.removeItem(k);
    } else if (scope == 'session') {
      window.sessionStorage.removeItem(k);
    }
  };

  /**
   * @param scope
   */
  const clear = (scope: string) => {
    if (scope == 'local') {
      window.localStorage.clear();
    } else if (scope == 'session') {
      window.sessionStorage.clear();
    }
  };

  return {
    execute(mutations: Uint16Array, startPosition: number): number {
      if (allowedExecution) {
        const scope = strings.get(mutations[startPosition + StorageMutationIndex.Scope]);
        const keyIndex = mutations[startPosition + StorageMutationIndex.Key];
        const valueIndex = mutations[startPosition + StorageMutationIndex.Value];

        // TODO(choumx): Clean up key/value strings (or don't store them in the first place)
        // to avoid leaking memory.

        if (keyIndex >= 0) {
          const key = strings.get(keyIndex);
          if (valueIndex >= 0) {
            const value = strings.get(valueIndex);
            setItem(scope, key, value);
          } else {
            removeItem(scope, key);
          }
        } else {
          if (valueIndex > 0) {
            throw new Error('Unexpected storage operation.');
          } else {
            clear(scope);
          }
        }
      }

      return startPosition + StorageMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number): Object {
      const scope = strings.get(mutations[startPosition + StorageMutationIndex.Scope]);
      const keyIndex = mutations[startPosition + StorageMutationIndex.Key];
      const valueIndex = mutations[startPosition + StorageMutationIndex.Value];

      return {
        scope,
        key: keyIndex >= 0 ? strings.get(keyIndex) : null,
        value: valueIndex >= 0 ? strings.get(valueIndex) : null,
        allowedExecution,
      };
    },
  };
};
