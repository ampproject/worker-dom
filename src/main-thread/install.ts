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
import { MessageFromWorker, MessageType, HydrationFromWorker, MutationFromWorker } from '../transfer/Messages';
import { prepare as prepareNodes } from './nodes';
import { TransferrableKeys } from '../transfer/TransferrableKeys';

export function install(baseElement: HTMLElement, workerDOMUrl: string, sanitizer?: Sanitizer): void {
  const authorURL = baseElement.getAttribute('src');
  if (authorURL === null) {
    return;
  }

  createWorker(workerDOMUrl, authorURL).then(worker => {
    if (worker === null) {
      return;
    }

    prepareNodes(baseElement);
    prepareMutate(worker);

    worker.onmessage = ({ data }: MessageFromWorker) => {
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
