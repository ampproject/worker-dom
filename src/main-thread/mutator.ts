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
import { NodeContext } from './nodes';
import { Strings } from './strings';
import { WorkerContext } from './worker';
import { EventSubscriptionProcessor } from './commands/event-subscription';
import { BoundingClientRectProcessor } from './commands/bounding-client-rect';

export class MutatorContext {
  strings_: Strings;
  nodeContext_: NodeContext;
  mutationQueue_: Array<TransferrableMutationRecord>;
  pendingMutations_: boolean;
  workerContext_: WorkerContext;
  sanitizer_: Sanitizer | undefined;
  mutators_: {
    [key: number]: (mutation: TransferrableMutationRecord, target: Node) => void;
  };

  /**
   * @param strings
   * @param nodeContext
   * @param workerContext
   * @param passedSanitizer Sanitizer to apply to content if needed.
   */
  constructor(strings: Strings, nodeContext: NodeContext, workerContext: WorkerContext, passedSanitizer?: Sanitizer) {
    this.strings_ = strings;
    this.nodeContext_ = nodeContext;
    this.workerContext_ = workerContext;
    this.sanitizer_ = passedSanitizer;
    this.mutationQueue_ = [];
    this.pendingMutations_ = false;

    const eventSubscriptionProcessor = new EventSubscriptionProcessor(strings, nodeContext, workerContext);
    const boundingClientRectProcessor = new BoundingClientRectProcessor(nodeContext, workerContext);

    this.mutators_ = {
      [MutationRecordType.CHILD_LIST]: this.mutateChildList_.bind(this),
      [MutationRecordType.ATTRIBUTES]: this.mutateAttributes_.bind(this),
      [MutationRecordType.CHARACTER_DATA]: this.mutateCharacterData_.bind(this),
      [MutationRecordType.PROPERTIES]: this.mutateProperties_.bind(this),
      [MutationRecordType.EVENT_SUBSCRIPTION]: eventSubscriptionProcessor.process.bind(eventSubscriptionProcessor),
      [MutationRecordType.GET_BOUNDING_CLIENT_RECT]: boundingClientRectProcessor.process.bind(boundingClientRectProcessor),
    };
  }

  /**
   * Process MutationRecords from worker thread applying changes to the existing DOM.
   * @param nodes New nodes to add in the main thread with the incoming mutations.
   * @param stringValues Additional string values to use in decoding messages.
   * @param mutations Changes to apply in both graph shape and content of Elements.
   */
  mutate(nodes: Array<TransferrableNode>, stringValues: Array<string>, mutations: Array<TransferrableMutationRecord>): void {
    //mutations: TransferrableMutationRecord[]): void {
    // TODO(KB): Restore signature requiring lastMutationTime. (lastGestureTime: number, mutations: TransferrableMutationRecord[])
    // if (performance.now() || Date.now() - lastGestureTime > GESTURE_TO_MUTATION_THRESHOLD) {
    //   return;
    // }
    // this.lastGestureTime = lastGestureTime;
    this.strings_.storeValues(stringValues);
    nodes.forEach(node => this.nodeContext_.createNode(node, this.sanitizer_));
    this.mutationQueue_ = this.mutationQueue_.concat(mutations);
    if (!this.pendingMutations_) {
      this.pendingMutations_ = true;
      requestAnimationFrame(this.syncFlush_.bind(this));
    }
  }

  /**
   * Apply all stored mutations syncronously. This method works well, but can cause jank if there are too many
   * mutations to apply in a single frame.
   *
   * Investigations in using asyncFlush to resolve are worth considering.
   */
  syncFlush_(): void {
    this.mutationQueue_.forEach(mutation => {
      const nodeId = mutation[TransferrableKeys.target];
      const node = this.nodeContext_.getNode(nodeId);
      if (!node) {
        console.error('getNode() yields a null value. Node id (' + nodeId + ') was not found.');
        return;
      }
      this.mutators_[mutation[TransferrableKeys.type]](mutation, node);
    });
    this.mutationQueue_ = [];
    this.pendingMutations_ = false;
  }

  mutateChildList_(mutation: TransferrableMutationRecord, target: HTMLElement) {
    (mutation[TransferrableKeys.removedNodes] || []).forEach(nodeReference => {
      const nodeId = nodeReference[TransferrableKeys.index];
      const node = this.nodeContext_.getNode(nodeId);
      if (!node) {
        console.error('getNode() yields a null value. Node id (' + nodeId + ') was not found.');
        return;
      }
      node.remove();
    });

    const addedNodes = mutation[TransferrableKeys.addedNodes];
    const nextSibling = mutation[TransferrableKeys.nextSibling];
    if (addedNodes) {
      addedNodes.forEach(node => {
        let newChild = null;
        newChild = this.nodeContext_.getNode(node[TransferrableKeys.index]);

        if (!newChild) {
          // Transferred nodes that are not stored were previously removed by the sanitizer.
          if (node[TransferrableKeys.transferred]) {
            return;
          } else {
            newChild = this.nodeContext_.createNode(node as TransferrableNode, this.sanitizer_);
          }
        }
        if (newChild) {
          target.insertBefore(newChild, (nextSibling && this.nodeContext_.getNode(nextSibling[TransferrableKeys.index])) || null);
        } else {
          // TODO(choumx): Inform worker that sanitizer removed newChild.
        }
      });
    }
  }

  mutateAttributes_(mutation: TransferrableMutationRecord, target: HTMLElement | SVGElement) {
    const attributeName =
      mutation[TransferrableKeys.attributeName] !== undefined ? this.strings_.get(mutation[TransferrableKeys.attributeName] as number) : null;
    const value = mutation[TransferrableKeys.value] !== undefined ? this.strings_.get(mutation[TransferrableKeys.value] as number) : null;
    if (attributeName != null) {
      if (value == null) {
        target.removeAttribute(attributeName);
      } else {
        if (!this.sanitizer_ || this.sanitizer_.validAttribute(target.nodeName, attributeName, value)) {
          target.setAttribute(attributeName, value);
        } else {
          // TODO(choumx): Inform worker that sanitizer ignored unsafe attribute value change.
        }
      }
    }
  }

  mutateCharacterData_(mutation: TransferrableMutationRecord, target: CharacterData) {
    const value = mutation[TransferrableKeys.value];
    if (value) {
      // Sanitization not necessary for textContent.
      target.textContent = this.strings_.get(value);
    }
  }

  mutateProperties_(mutation: TransferrableMutationRecord, target: RenderableElement) {
    const propertyName =
      mutation[TransferrableKeys.propertyName] !== undefined ? this.strings_.get(mutation[TransferrableKeys.propertyName] as number) : null;
    const value = mutation[TransferrableKeys.value] !== undefined ? this.strings_.get(mutation[TransferrableKeys.value] as number) : null;
    if (propertyName && value != null) {
      const stringValue = String(value);
      if (!this.sanitizer_ || this.sanitizer_.validProperty(target.nodeName, propertyName, stringValue)) {
        // TODO(choumx, #122): Proper support for non-string property mutations.
        const isBooleanProperty = propertyName == 'checked';
        target[propertyName] = isBooleanProperty ? value === 'true' : value;
      } else {
        // TODO(choumx): Inform worker that sanitizer ignored unsafe property value change.
      }
    }
  }
}
