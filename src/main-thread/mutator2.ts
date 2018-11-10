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

type Mutators = {
  [key: number]: (mutation: TransferrableMutationRecord, target: Node, worker: Worker, sanitizer?: Sanitizer) => void;
};

const MUTATORS: Mutators = {
  [MutationRecordType.CHILD_LIST](mutation: TransferrableMutationRecord, target: HTMLElement, worker, sanitizer?: Sanitizer): void {
    (mutation[TransferrableKeys.removedNodes] || []).forEach(node => getNode(node[TransferrableKeys._index_]).remove());

    const addedNodes = mutation[TransferrableKeys.addedNodes];
    const nextSibling = mutation[TransferrableKeys.nextSibling];
    if (addedNodes) {
      addedNodes.forEach(node => {
        let newChild = null;
        newChild = getNode(node[TransferrableKeys._index_]);

        if (!newChild) {
          console.log('!newChild', mutation);
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
  [MutationRecordType.ATTRIBUTES](mutation: TransferrableMutationRecord, target: HTMLElement | SVGElement, worker, sanitizer?: Sanitizer) {
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
  [MutationRecordType.PROPERTIES](mutation: TransferrableMutationRecord, target: RenderableElement, worker, sanitizer?: Sanitizer) {
    const propertyName =
      mutation[TransferrableKeys.propertyName] !== undefined ? getString(mutation[TransferrableKeys.propertyName] as number) : null;
    const value = mutation[TransferrableKeys.value] !== undefined ? getString(mutation[TransferrableKeys.value] as number) : null;
    if (propertyName && value) {
      if (!sanitizer || sanitizer.validProperty(target.nodeName, propertyName, value)) {
        target[propertyName] = value;
      } else {
        // TODO(choumx): Inform worker that sanitizer ignored unsafe property value change.
      }
    }
  },
  [MutationRecordType.COMMAND](mutation: TransferrableMutationRecord, target, worker: Worker) {
    process(worker, mutation);
  },
};

export class Mutator {
  private queue: Array<TransferrableMutationRecord> = [];
  private pending: boolean = false;
  private worker: Worker;
  private sanitizer: Sanitizer | undefined;

  constructor(worker: Worker, sanitizer?: Sanitizer) {
    this.worker = worker;
    this.sanitizer = sanitizer;

    this.flush = this.flush.bind(this);
  }

  /**
   * Process MutationRecords from worker thread applying changes to the existing DOM.
   * @param nodes New nodes to add in the main thread with the incoming mutations.
   * @param mutations Changes to apply in both graph shape and content of Elements.
   * @param sanitizer Sanitizer to apply to content if needed.
   */
  public mutate(nodes: Array<TransferrableNode>, stringValues: Array<string>, mutations: Array<TransferrableMutationRecord>): void {
    stringValues.forEach(value => storeString(value));
    nodes.forEach(node => createNode(node, this.sanitizer));

    this.queue = this.queue.concat(mutations);
    if (!this.pending) {
      this.pending = true;
      requestAnimationFrame(this.flush);
    }
  }

  private flush(): void {
    this.queue.forEach(mutation =>
      MUTATORS[mutation[TransferrableKeys.type]](mutation, getNode(mutation[TransferrableKeys.target]), this.worker, this.sanitizer),
    );
    this.queue = [];
    this.pending = false;
  }
}
