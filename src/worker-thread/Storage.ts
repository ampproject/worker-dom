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

import { Document } from './dom/Document';
import { GetOrSet } from '../transfer/Messages';
import { StorageLocation } from '../transfer/TransferrableStorage';
import { TransferrableMutationType } from '../transfer/TransferrableMutation';
import { store } from './strings';
import { transfer } from './MutationTransfer';
import { DocumentStub } from './dom/DocumentLite';

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Storage
 */
export interface Storage {
  length: number;
  key(n: number): string | null;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

/**
 * @param document
 * @param location
 * @param data
 */
export function createStorage(document: Document | DocumentStub, location: StorageLocation, data: { [key: string]: string }): Storage {
  const storage: any = Object.assign(Object.create(null), data);

  // Define properties on a prototype-less object instead of a class so that
  // it behaves more like normal objects, e.g. bracket notation and JSON.stringify.
  const define = Object.defineProperty;
  define(storage, 'length', {
    get() {
      return Object.keys(this).length;
    },
  });
  define(storage, 'key', {
    value(n: number) {
      const keys = Object.keys(this);
      return n >= 0 && n < keys.length ? keys[n] : null;
    },
  });
  define(storage, 'getItem', {
    value(key: string): string | null {
      const value = this[key];
      return value ? value : null;
    },
  });
  define(storage, 'setItem', {
    value(key: string, value: string): void {
      const stringValue = String(value);
      this[key] = stringValue;

      transfer(document, [TransferrableMutationType.STORAGE, GetOrSet.SET, location, store(key), store(stringValue)]);
    },
  });
  define(storage, 'removeItem', {
    value(key: string): void {
      delete this[key];

      transfer(document, [
        TransferrableMutationType.STORAGE,
        GetOrSet.SET,
        location,
        store(key),
        0, // value == 0 represents deletion.
      ]);
    },
  });
  define(storage, 'clear', {
    value(): void {
      Object.keys(this).forEach((key) => {
        delete this[key];
      });

      transfer(document, [
        TransferrableMutationType.STORAGE,
        GetOrSet.SET,
        location,
        0, // key == 0 represents all keys.
        0, // value == 0 represents deletion.
      ]);
    },
  });
  return storage as Storage;
}
