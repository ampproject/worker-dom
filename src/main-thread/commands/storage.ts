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
import { StorageLocation } from '../../transfer/TransferrableStorage';

export const StorageProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.PROPERTIES);

  return {
    execute(mutations: Uint16Array, startPosition: number): number {
      if (allowedExecution) {
        const location = mutations[startPosition + StorageMutationIndex.Location];
        const keyIndex = mutations[startPosition + StorageMutationIndex.Key];
        const valueIndex = mutations[startPosition + StorageMutationIndex.Value];

        const key = keyIndex > 0 ? strings.get(keyIndex) : null;
        const value = valueIndex > 0 ? strings.get(valueIndex) : null;

        // TODO(choumx): Clean up key/value strings (or don't store them in the first place)
        // to avoid leaking memory.

        if (config.sanitizer) {
          config.sanitizer.changeStorage(location, key, value);
        } else {
          let storage;
          if (location === StorageLocation.Local) {
            storage = window.localStorage;
          } else if (location === StorageLocation.Session) {
            storage = window.sessionStorage;
          }
          if (storage) {
            if (key == null) {
              if (value == null) {
                storage.clear();
              } else {
                throw new Error('Unexpected storage operation.');
              }
            } else {
              if (value == null) {
                storage.removeItem(key);
              } else {
                storage.setItem(key, value);
              }
            }
          } else {
            console.error(`STORAGE: Unexpected location: "${location}".`);
          }
        }
      }

      return startPosition + StorageMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number): Object {
      const scope = strings.get(mutations[startPosition + StorageMutationIndex.Location]);
      const keyIndex = mutations[startPosition + StorageMutationIndex.Key];
      const valueIndex = mutations[startPosition + StorageMutationIndex.Value];

      const key = keyIndex > 0 ? strings.get(keyIndex) : null;
      const value = valueIndex > 0 ? strings.get(valueIndex) : null;

      return {
        type: 'STORAGE',
        scope,
        key,
        value,
        allowedExecution,
      };
    },
  };
};
