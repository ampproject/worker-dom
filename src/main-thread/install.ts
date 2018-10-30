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

import { prepareMutate, mutate } from './mutator';
import { createWorker } from './worker';
import { MutationFromWorker, MessageType } from '../transfer/Messages';
import { prepare as prepareNodes } from './nodes';
import { TransferrableKeys } from '../transfer/TransferrableKeys';

const ALLOWABLE_MESSAGE_TYPES = [MessageType.MUTATE, MessageType.HYDRATE];

export function install(baseElement: HTMLElement, authorURL: string, workerDOMUrl: string, sanitizer?: Sanitizer): void {
  prepareNodes(baseElement);

  createWorker(baseElement, workerDOMUrl, authorURL).then(worker => {
    if (worker === null) {
      return;
    }

    prepareMutate(worker);

    worker.onmessage = ({ data }: { data: MutationFromWorker }) => {
      if (!ALLOWABLE_MESSAGE_TYPES.includes(data[TransferrableKeys.type])) {
        return;
      }
      // TODO(KB): Hydration has special rules limiting the types of allowed mutations.
      // Re-introduce Hydration and add a specialized handler.
      mutate(
        (data as MutationFromWorker)[TransferrableKeys.nodes],
        (data as MutationFromWorker)[TransferrableKeys.strings],
        (data as MutationFromWorker)[TransferrableKeys.mutations],
        sanitizer,
      );
    };
  });
}
