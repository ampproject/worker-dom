/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
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

import { MessageToWorker, MessageType, ValueSyncToWorker } from './Messages';
import { get } from '../worker-thread/NodeMapping';
import { TransferrableKeys } from './TransferrableKeys';

export interface TransferrableSyncValue {
  readonly [TransferrableKeys._index_]: number;
  readonly [TransferrableKeys.value]: string | number;
}

/**
 * When an event is dispatched from the main thread, it needs to be propagated in the worker thread.
 * Propagate adds an event listener to the worker global scope and uses the WorkerDOM Node.dispatchEvent
 * method to dispatch the transfered event in the worker thread.
 */
export function propagate(): void {
  if (typeof addEventListener !== 'function') {
    return;
  }
  addEventListener('message', ({ data }: { data: MessageToWorker }) => {
    if (data[TransferrableKeys.type] !== MessageType.SYNC) {
      return;
    }

    const sync = (data as ValueSyncToWorker)[TransferrableKeys.sync];
    const node = get(sync[TransferrableKeys._index_]);
    if (node) {
      node.value = sync[TransferrableKeys.value];
    }
  });
}
