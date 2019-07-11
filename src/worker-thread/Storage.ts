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
import { TransferrableMutationType } from '../transfer/TransferrableMutation';
import { store } from './strings';
import { transfer } from './MutationTransfer';

/**
 * Implementation of https://developer.mozilla.org/en-US/docs/Web/API/Storage.
 */
export class Storage {
  private data: { [key: string]: string };
  private document: Document;
  private scope: string;

  /**
   * Constructor is not directly invokable in the native implementation.
   * @param document
   * @param scope
   */
  constructor(document: Document, scope: string) {
    this.document = document;
    this.scope = scope;
  }

  setData(value: { [key: string]: string }): void {
    this.data = value;
  }

  get length() {
    return Object.keys(this.data).length;
  }

  public key(n: number): string | null {
    const keys = Object.keys(this.data);
    const k = keys[n];
    return k === undefined ? null : k;
  }

  public getItem(key: string): string | null {
    const item = this.data[key];
    return item === undefined ? null : item;
  }

  public setItem(key: string, value: string): void {
    // Convert value to string to mimic native behavior.
    const stringValue = String(value);
    this.data[key] = stringValue;

    // The key/value strings are removed from storage in StorageProcessor.
    transfer(this.document, [TransferrableMutationType.STORAGE, store(this.scope), store(key), store(stringValue)]);
  }

  public removeItem(key: string): void {
    delete this.data[key];

    transfer(this.document, [
      TransferrableMutationType.STORAGE,
      store(this.scope),
      store(key),
      -1, // value == -1 represents deletion.
    ]);
  }

  public clear(): void {
    this.data = {};

    transfer(this.document, [
      TransferrableMutationType.STORAGE,
      store(this.scope),
      -1, // key == -1 represents all keys.
      -1, // value == -1 represents deletion.
    ]);
  }
}
