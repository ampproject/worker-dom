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

import { MessageToWorker, MessageType, ResizeSyncToWorker } from '../transfer/Messages';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { WorkerDOMGlobalScope } from './WorkerDOMGlobalScope';

export function propagate(global: WorkerDOMGlobalScope): void {
  const document = global.document;
  if (!document.addGlobalEventListener) {
    return;
  }
  document.addGlobalEventListener('message', ({ data }: { data: MessageToWorker }) => {
    if (data[TransferrableKeys.type] !== MessageType.RESIZE) {
      return;
    }
    const sync = (data as ResizeSyncToWorker)[TransferrableKeys.sync];
    if (sync) {
      global.innerWidth = sync[0];
      global.innerHeight = sync[1];
    }
  });
}
