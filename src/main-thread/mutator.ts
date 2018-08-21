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

import { TransferrableMutationRecord } from '../transfer/TransferrableRecord';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { MutationRecordType } from '../worker-thread/MutationRecord';
import { TransferrableNode } from '../transfer/TransferrableNodes';
import { getNode, createNode } from './nodes';
import { storeString, getString } from './strings';
import { process } from './command';
import { RenderableElement } from './RenderableElement';

let MUTATION_QUEUE: Array<TransferrableMutationRecord> = [];
let PENDING_MUTATIONS: boolean = false;
let worker: Worker;

export function prepareMutate(passedWorker: Worker): void {
  worker = passedWorker;
}

const mutators: {
  [key: number]: (mutation: TransferrableMutationRecord, target: RenderableElement, sanitizer?: Sanitizer) => void;
} = {
  [MutationRecordType.CHILD_LIST](mutation: TransferrableMutationRecord, target: RenderableElement, sanitizer: Sanitizer) {
    (mutation[TransferrableKeys.removedNodes] || []).forEach(node => getNode(node[TransferrableKeys._index_]).remove());

    const addedNodes = mutation[TransferrableKeys.addedNodes];
    const nextSibling = mutation[TransferrableKeys.nextSibling];
    if (addedNodes) {
      addedNodes.forEach(node => {
        let newChild = getNode(node[TransferrableKeys._index_]);
        if (!newChild) {
          newChild = createNode(node as TransferrableNode);
          if (sanitizer) {
            sanitizer.sanitize(newChild); // TODO(choumx): Inform worker?
          }
        }
        target.insertBefore(newChild, (nextSibling && getNode(nextSibling[TransferrableKeys._index_])) || null);
      });
    }
  },
  [MutationRecordType.ATTRIBUTES](mutation: TransferrableMutationRecord, target: RenderableElement, sanitizer?: Sanitizer) {
    const attributeName =
      mutation[TransferrableKeys.attributeName] !== undefined ? getString(mutation[TransferrableKeys.attributeName] as number) : null;
    const value = mutation[TransferrableKeys.value] !== undefined ? getString(mutation[TransferrableKeys.value] as number) : null;
    if (attributeName != null && value != null) {
      if (!sanitizer || sanitizer.validAttribute(target.nodeName, attributeName, value)) {
        target.setAttribute(attributeName, value);
      } else {
        // TODO(choumx): Inform worker?
      }
    }
  },
  [MutationRecordType.CHARACTER_DATA](mutation: TransferrableMutationRecord, target: RenderableElement) {
    const value = mutation[TransferrableKeys.value];
    if (value) {
      // Sanitization not necessary for textContent.
      target.textContent = getString(value);
    }
  },
  [MutationRecordType.PROPERTIES](mutation: TransferrableMutationRecord, target: RenderableElement, sanitizer?: Sanitizer) {
    const propertyName =
      mutation[TransferrableKeys.propertyName] !== undefined ? getString(mutation[TransferrableKeys.propertyName] as number) : null;
    const value = mutation[TransferrableKeys.value] !== undefined ? getString(mutation[TransferrableKeys.value] as number) : null;
    if (propertyName && value) {
      if (!sanitizer || sanitizer.validProperty(target.nodeName, propertyName, value)) {
        target[propertyName] = value;
      } else {
        // TODO(choumx): Inform worker?
      }
    }
  },
  [MutationRecordType.COMMAND](mutation: TransferrableMutationRecord) {
    process(worker, mutation);
  },
};

/**
 * Process MutationRecords from worker thread applying changes to the existing DOM.
 * @param nodes New nodes to add in the main thread with the incoming mutations.
 * @param mutations Changes to apply in both graph shape and content of Elements.
 * @param sanitizer Sanitizer to apply to content if needed.
 */
export function mutate(
  nodes: Array<TransferrableNode>,
  stringValues: Array<string>,
  mutations: Array<TransferrableMutationRecord>,
  sanitizer?: Sanitizer,
): void {
  //mutations: TransferrableMutationRecord[]): void {
  // TODO(KB): Restore signature requiring lastMutationTime. (lastGestureTime: number, mutations: TransferrableMutationRecord[])
  // if (performance.now() || Date.now() - lastGestureTime > GESTURE_TO_MUTATION_THRESHOLD) {
  //   return;
  // }
  // this.lastGestureTime = lastGestureTime;
  stringValues.forEach(value => storeString(value));
  nodes.forEach(node => createNode(node));
  MUTATION_QUEUE = MUTATION_QUEUE.concat(mutations);
  if (!PENDING_MUTATIONS) {
    PENDING_MUTATIONS = true;
    requestAnimationFrame(() => syncFlush(sanitizer));
  }
}

/**
 * Apply all stored mutations syncronously. This method works well, but can cause jank if there are too many
 * mutations to apply in a single frame.
 *
 * Investigations in using asyncFlush to resolve are worth considering.
 */
function syncFlush(sanitizer?: Sanitizer): void {
  MUTATION_QUEUE.forEach(mutation => {
    mutators[mutation[TransferrableKeys.type]](mutation, getNode(mutation[TransferrableKeys.target]), sanitizer);
  });
  MUTATION_QUEUE = [];
  PENDING_MUTATIONS = false;
}
