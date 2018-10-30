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

import { TransferrableNode } from '../transfer/TransferrableNodes';
import { TransferrableMutationRecord } from '../transfer/TransferrableRecord';
import { store as storeString } from './strings';

/**
 * Hydrate a root from the worker thread by comparing with the main thread representation.
 * @param skeleton root of the background thread content.
 * @param addEvents events needing subscription from the background thread content.
 * @param baseElement root of the main thread content to compare against.
 * @param worker worker issuing the upgrade request.
 */
export function hydrate(
  nodes: Array<TransferrableNode>,
  stringValues: Array<string>,
  mutations: Array<TransferrableMutationRecord>,
  sanitizer?: Sanitizer,
): void {
  // Process String Additions
  stringValues.forEach(value => storeString(value));
  // // Process Node Addition / Removal
  // hydrateNode(skeleton, baseElement, worker);
  // // Process Event Addition
  // addEvents.forEach(event => {
  //   const node = getNode(event[TransferrableKeys._index_]);
  //   node && processListenerChange(worker, node, true, getString(event[TransferrableKeys.type]), event[TransferrableKeys.index]);
  // });
}
