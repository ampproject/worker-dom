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

import { hydrate } from './hydrator';
import { prepareMutate, mutate } from './mutator';
import { createWorker } from './worker';
import { MessageFromWorker, MessageType, HydrationFromWorker, MutationFromWorker, readableMessage } from '../transfer/Messages';
import { prepare as prepareNodes } from './nodes';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { UserCallbacks } from './UserCallbacks';

export function install(
  baseElement: HTMLElement,
  authorURL: string,
  workerDOMUrl: string,
  userCallbacks: UserCallbacks,
  sanitizer?: Sanitizer,
): void {
  createWorker(workerDOMUrl, authorURL, userCallbacks).then(worker => {
    if (worker === null) {
      return;
    }

    prepareNodes(baseElement);
    prepareMutate(worker);

    worker.onmessage = (message: MessageFromWorker) => {
      const { data } = message;

      if (userCallbacks.onReceiveMessage) {
        const readable = readableMessage(message);
        userCallbacks.onReceiveMessage(readable);
      }

      switch (data[TransferrableKeys.type]) {
        case MessageType.HYDRATE:
          // console.info(`hydration from worker: ${data.type}`, data);
          hydrate(
            (data as HydrationFromWorker)[TransferrableKeys.nodes],
            (data as HydrationFromWorker)[TransferrableKeys.strings],
            (data as HydrationFromWorker)[TransferrableKeys.addedEvents],
            baseElement,
            worker,
          );
          break;
        case MessageType.MUTATE:
          // console.info(`mutation from worker: ${data.type}`, data);
          mutate(
            (data as MutationFromWorker)[TransferrableKeys.nodes],
            (data as MutationFromWorker)[TransferrableKeys.strings],
            (data as MutationFromWorker)[TransferrableKeys.mutations],
            sanitizer,
          );
          break;
      }
    };
  });
}
