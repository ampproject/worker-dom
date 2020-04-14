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
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { MessageType, StorageValueToWorker, GetOrSet } from '../../transfer/Messages';

export const StorageProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.STORAGE);

  const get = (location: StorageLocation, key: string | null): void => {
    if (config.sanitizer && location === StorageLocation.AmpState) {
      config.sanitizer.getStorage(location, key).then((value) => {
        const message: StorageValueToWorker = {
          [TransferrableKeys.type]: MessageType.GET_STORAGE,
          [TransferrableKeys.storageKey]: key || '',
          [TransferrableKeys.storageLocation]: location,
          [TransferrableKeys.value]: value,
        };
        workerContext.messageToWorker(message);
      });
    } else {
      console.error(`STORAGE: Sanitizer not found or unsupported location:`, location);
    }
  };

  const set = (location: StorageLocation, key: string | null, value: string | null): void => {
    if (config.sanitizer) {
      // TODO: Message worker so AMP.setState() can be Promise-able.
      config.sanitizer.setStorage(location, key, value);
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
  };

  return {
    execute(mutations: Uint16Array, startPosition: number, allowedMutation: boolean): number {
      if (allowedExecution && allowedMutation) {
        const operation = mutations[startPosition + StorageMutationIndex.Operation];
        const location = mutations[startPosition + StorageMutationIndex.Location];
        const keyIndex = mutations[startPosition + StorageMutationIndex.Key];
        const valueIndex = mutations[startPosition + StorageMutationIndex.Value];

        // TODO(choumx): Clean up key/value strings (or don't store them in the first place)
        // to avoid leaking memory.
        const key = keyIndex > 0 ? strings.get(keyIndex) : null;
        const value = valueIndex > 0 ? strings.get(valueIndex) : null;

        if (operation === GetOrSet.GET) {
          get(location, key);
        } else if (operation === GetOrSet.SET) {
          set(location, key, value);
        }
      }

      return startPosition + StorageMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number): {} {
      const operation = mutations[startPosition + StorageMutationIndex.Operation];
      const location = mutations[startPosition + StorageMutationIndex.Location];
      const keyIndex = mutations[startPosition + StorageMutationIndex.Key];
      const valueIndex = mutations[startPosition + StorageMutationIndex.Value];

      const key = keyIndex > 0 ? strings.get(keyIndex) : null;
      const value = valueIndex > 0 ? strings.get(valueIndex) : null;

      return {
        type: 'STORAGE',
        operation,
        location,
        key,
        value,
        allowedExecution,
      };
    },
  };
};
