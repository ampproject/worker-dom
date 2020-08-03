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

import { Document } from '../dom/Document';
import { StorageLocation } from '../../transfer/TransferrableStorage';
import { StorageValueToWorker, MessageType, MessageToWorker, GetOrSet } from '../../transfer/Messages';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { store } from '../strings';
import { transfer } from '../MutationTransfer';
import { DocumentStub } from '../dom/DocumentLite';

export class AMP {
  private document: Document | DocumentStub;

  constructor(document: Document | DocumentStub) {
    this.document = document;
  }

  /**
   * Returns a promise that resolves with the value of `key`.
   * @param key
   */
  getState(key: string): Promise<{} | null> {
    return new Promise((resolve) => {
      const messageHandler = (event: MessageEvent) => {
        const message: MessageToWorker = event.data;
        if (message[TransferrableKeys.type] !== MessageType.GET_STORAGE) {
          return;
        }
        // TODO: There is a race condition here if there are multiple concurrent
        // getState(k) messages in flight, where k is the same value.
        const storageMessage = message as StorageValueToWorker;
        if (storageMessage[TransferrableKeys.storageKey] !== key) {
          return;
        }
        this.document.removeGlobalEventListener('message', messageHandler);
        const value = storageMessage[TransferrableKeys.value];
        resolve(value);
      };

      this.document.addGlobalEventListener('message', messageHandler);
      transfer(this.document, [TransferrableMutationType.STORAGE, GetOrSet.GET, StorageLocation.AmpState, /* key */ store(key), /* value */ 0]);
      setTimeout(resolve, 500, null); // TODO: Why a magical constant, define and explain.
    });
  }

  /**
   * Deep-merges `state` into the existing state.
   * @param state
   */
  setState(state: {}): void {
    // Stringify `state` so it can be post-messaged as a transferrable.
    let stringified;
    try {
      stringified = JSON.stringify(state);
    } catch (e) {
      throw new Error(`AMP.setState only accepts valid JSON as input.`);
    }
    transfer(this.document, [TransferrableMutationType.STORAGE, GetOrSet.SET, StorageLocation.AmpState, /* key */ 0, /* value */ store(stringified)]);
  }
}
