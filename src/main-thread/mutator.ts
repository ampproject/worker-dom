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

import { BoundingClientRectProcessor } from './commands/bounding-client-rect';
import { EventSubscriptionProcessor } from './commands/event-subscription';
import { LongTaskProcessor } from './commands/long-task';
import { MutationPumpFunction, WorkerCallbacks } from './callbacks';
import { MutationRecordType } from '../worker-thread/MutationRecord';
import { NodeContext } from './nodes';
import { Phase } from '../transfer/phase';
import { Strings } from './strings';
import { TransferrableMutationRecord } from '../transfer/TransferrableRecord';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { TransferrableNode } from '../transfer/TransferrableNodes';
import { WorkerContext } from './worker';

export class MutatorProcessor {
  private strings: Strings;
  private nodeContext: NodeContext;
  private mutationPump: MutationPumpFunction;
  private boundSyncFlush: () => void;
  private mutationQueue: Array<TransferrableMutationRecord>;
  private stringQueue: Array<string>;
  private nodeQueue: Array<TransferrableNode>;
  private pendingQueue: boolean;
  private sanitizer: Sanitizer | undefined;
  private mutators: {
    [key: number]: (mutation: TransferrableMutationRecord, target: Node) => void;
  };

  /**
   * @param strings
   * @param nodeContext
   * @param workerContext
   * @param sanitizer Sanitizer to apply to content if needed.
   */
  constructor(strings: Strings, nodeContext: NodeContext, workerContext: WorkerContext, callbacks?: WorkerCallbacks, sanitizer?: Sanitizer) {
    this.strings = strings;
    this.nodeContext = nodeContext;
    this.sanitizer = sanitizer;
    this.mutationPump = (callbacks && callbacks.onMutationPump) || requestAnimationFrame.bind(null);
    this.boundSyncFlush = this.syncFlush.bind(this);
    this.stringQueue = [];
    this.nodeQueue = [];
    this.mutationQueue = [];
    this.pendingQueue = false;

    const eventSubscriptionProcessor = new EventSubscriptionProcessor(strings, nodeContext, workerContext);
    const boundingClientRectProcessor = new BoundingClientRectProcessor(nodeContext, workerContext);
    const longTaskProcessor = new LongTaskProcessor(callbacks);

    this.mutators = {
      [MutationRecordType.CHILD_LIST]: this.mutateChildList.bind(this),
      [MutationRecordType.ATTRIBUTES]: this.mutateAttributes.bind(this),
      [MutationRecordType.CHARACTER_DATA]: this.mutateCharacterData.bind(this),
      [MutationRecordType.PROPERTIES]: this.mutateProperties.bind(this),
      [MutationRecordType.EVENT_SUBSCRIPTION]: eventSubscriptionProcessor.process.bind(eventSubscriptionProcessor),
      [MutationRecordType.GET_BOUNDING_CLIENT_RECT]: boundingClientRectProcessor.process.bind(boundingClientRectProcessor),
      [MutationRecordType.LONG_TASK_START]: longTaskProcessor.processStart,
      [MutationRecordType.LONG_TASK_END]: longTaskProcessor.processEnd,
    };
  }

  /**
   * Process MutationRecords from worker thread applying changes to the existing DOM.
   * @param phase
   * @param nodes New nodes to add in the main thread with the incoming mutations.
   * @param stringValues Additional string values to use in decoding messages.
   * @param mutations Changes to apply in both graph shape and content of Elements.
   */
  mutate(phase: Phase, nodes: Array<TransferrableNode>, stringValues: Array<string>, mutations: Array<TransferrableMutationRecord>): void {
    this.stringQueue = this.stringQueue.concat(stringValues);
    this.nodeQueue = this.nodeQueue.concat(nodes);
    this.mutationQueue = this.mutationQueue.concat(mutations);
    if (!this.pendingQueue) {
      this.pendingQueue = true;
      this.mutationPump(this.boundSyncFlush, phase);
    }
  }

  /**
   * Apply all stored mutations syncronously. This method works well, but can cause jank if there are too many
   * mutations to apply in a single frame.
   *
   * Investigations in using asyncFlush to resolve are worth considering.
   */
  private syncFlush(): void {
    this.pendingQueue = false;

    this.strings.storeValues(this.stringQueue);
    this.stringQueue.length = 0;

    this.nodeQueue.forEach(node => this.nodeContext.createNode(node, this.sanitizer));
    this.nodeQueue.length = 0;

    this.mutationQueue.forEach(mutation => {
      const nodeId = mutation[TransferrableKeys.target];
      const node = this.nodeContext.getNode(nodeId);
      if (!node) {
        console.error('getNode() yields a null value. Node id (' + nodeId + ') was not found.');
        return;
      }
      this.mutators[mutation[TransferrableKeys.type]](mutation, node);
    });
    this.mutationQueue.length = 0;
  }

  private mutateChildList(mutation: TransferrableMutationRecord, target: HTMLElement) {
    (mutation[TransferrableKeys.removedNodes] || []).forEach(nodeReference => {
      const nodeId = nodeReference[TransferrableKeys.index];
      const node = this.nodeContext.getNode(nodeId);
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
        newChild = this.nodeContext.getNode(node[TransferrableKeys.index]);

        if (!newChild) {
          // Transferred nodes that are not stored were previously removed by the sanitizer.
          if (node[TransferrableKeys.transferred]) {
            return;
          } else {
            newChild = this.nodeContext.createNode(node as TransferrableNode, this.sanitizer);
          }
        }
        if (newChild) {
          target.insertBefore(newChild, (nextSibling && this.nodeContext.getNode(nextSibling[TransferrableKeys.index])) || null);
        } else {
          // TODO(choumx): Inform worker that sanitizer removed newChild.
        }
      });
    }
  }

  private mutateAttributes(mutation: TransferrableMutationRecord, target: HTMLElement | SVGElement) {
    const attributeName =
      mutation[TransferrableKeys.attributeName] !== undefined ? this.strings.get(mutation[TransferrableKeys.attributeName] as number) : null;
    const value = mutation[TransferrableKeys.value] !== undefined ? this.strings.get(mutation[TransferrableKeys.value] as number) : null;
    if (attributeName != null) {
      if (value == null) {
        target.removeAttribute(attributeName);
      } else {
        if (!this.sanitizer || this.sanitizer.validAttribute(target.nodeName, attributeName, value)) {
          target.setAttribute(attributeName, value);
        } else {
          // TODO(choumx): Inform worker that sanitizer ignored unsafe attribute value change.
        }
      }
    }
  }

  private mutateCharacterData(mutation: TransferrableMutationRecord, target: CharacterData) {
    const value = mutation[TransferrableKeys.value];
    if (value) {
      // Sanitization not necessary for textContent.
      target.textContent = this.strings.get(value);
    }
  }

  private mutateProperties(mutation: TransferrableMutationRecord, target: RenderableElement) {
    const propertyName =
      mutation[TransferrableKeys.propertyName] !== undefined ? this.strings.get(mutation[TransferrableKeys.propertyName] as number) : null;
    const value = mutation[TransferrableKeys.value] !== undefined ? this.strings.get(mutation[TransferrableKeys.value] as number) : null;
    if (propertyName && value != null) {
      const stringValue = String(value);
      if (!this.sanitizer || this.sanitizer.validProperty(target.nodeName, propertyName, stringValue)) {
        // TODO(choumx, #122): Proper support for non-string property mutations.
        const isBooleanProperty = propertyName == 'checked';
        target[propertyName] = isBooleanProperty ? value === 'true' : value;
      } else {
        // TODO(choumx): Inform worker that sanitizer ignored unsafe property value change.
      }
    }
  }
}
