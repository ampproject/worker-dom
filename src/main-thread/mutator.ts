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
import { store as storeString, get as getString } from './strings';
import { process } from './command';

let MUTATION_QUEUE: Array<TransferrableMutationRecord> = [];
let PENDING_MUTATIONS: boolean = false;
let worker: Worker;

export function prepareMutate(passedWorker: Worker): void {
  worker = passedWorker;
}

const mutators: {
  [key: number]: (mutation: TransferrableMutationRecord, target: Node, sanitizer?: Sanitizer) => void;
} = {
  [MutationRecordType.CHILD_LIST](mutation: TransferrableMutationRecord, target: HTMLElement, sanitizer: Sanitizer) {
    (mutation[TransferrableKeys.removedNodes] || []).forEach(node => getNode(node[TransferrableKeys._index_]).remove());

    const addedNodes = mutation[TransferrableKeys.addedNodes];
    const nextSibling = mutation[TransferrableKeys.nextSibling];
    if (addedNodes) {
      addedNodes.forEach(node => {
        let newChild = null;
        newChild = getNode(node[TransferrableKeys._index_]);

        if (!newChild) {
          // Transferred nodes that are not stored were previously removed by the sanitizer.
          if (node[TransferrableKeys.transferred]) {
            return;
          } else {
            newChild = createNode(node as TransferrableNode, sanitizer);
          }
        }
        if (newChild) {
          target.insertBefore(newChild, (nextSibling && getNode(nextSibling[TransferrableKeys._index_])) || null);
        } else {
          // TODO(choumx): Inform worker that sanitizer removed newChild.
        }
      });
    }
  },
  [MutationRecordType.ATTRIBUTES](mutation: TransferrableMutationRecord, target: HTMLElement | SVGElement, sanitizer?: Sanitizer) {
    const attributeName =
      mutation[TransferrableKeys.attributeName] !== undefined ? getString(mutation[TransferrableKeys.attributeName] as number) : null;
    const value = mutation[TransferrableKeys.value] !== undefined ? getString(mutation[TransferrableKeys.value] as number) : null;
    if (attributeName != null) {
      if (value == null) {
        target.removeAttribute(attributeName);
      } else {
        if (!sanitizer || sanitizer.validAttribute(target.nodeName, attributeName, value)) {
          target.setAttribute(attributeName, value);
        } else {
          // TODO(choumx): Inform worker that sanitizer ignored unsafe attribute value change.
        }
      }
    }
  },
  [MutationRecordType.CHARACTER_DATA](mutation: TransferrableMutationRecord, target: CharacterData) {
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
    if (propertyName && value != null) {
      const stringValue = String(value);
      if (!sanitizer || sanitizer.validProperty(target.nodeName, propertyName, stringValue)) {
        // TODO(choumx, #122): Proper support for non-string property mutations.
        const isBooleanProperty = propertyName == 'checked';
        target[propertyName] = isBooleanProperty ? value === 'true' : value;
      } else {
        // TODO(choumx): Inform worker that sanitizer ignored unsafe property value change.
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
  nodes.forEach(node => createNode(node, sanitizer));
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
