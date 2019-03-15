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

// import { TransferrableKeys } from '../transfer/TransferrableKeys';
// import { MutationRecordType } from '../worker-thread/MutationRecord';
// import { TransferrableNode } from '../transfer/replacement/TransferrableNodes';
import { NodeContext } from './nodes';
import { Strings } from './strings';
import { WorkerContext } from './worker';
import { TransferrableMutationType } from '../transfer/replacement/TransferrableMutation';
import { EventSubscriptionProcessor } from './commands/event-subscription';
import { BoundingClientRectProcessor } from './commands/bounding-client-rect';
import { ChildListProcessor } from './commands/child-list';
import { AttributeProcessor } from './commands/attribute';
import { CharacterDataProcessor } from './commands/character-data';
import { PropertyProcessor } from './commands/property';
import { CommandExecutor } from './commands/interface';

export class MutatorProcessor {
  private strings: Strings;
  private nodeContext: NodeContext;
  private mutationQueue: Array<Uint16Array> = [];
  private pendingMutations: boolean = false;
  private sanitizer: Sanitizer | undefined;
  private executors: {
    [key: number]: CommandExecutor;
  };

  /**
   * @param strings
   * @param nodeContext
   * @param workerContext
   * @param sanitizer Sanitizer to apply to content if needed.
   */
  constructor(strings: Strings, nodeContext: NodeContext, workerContext: WorkerContext, sanitizer?: Sanitizer) {
    this.strings = strings;
    this.nodeContext = nodeContext;
    this.sanitizer = sanitizer;

    this.executors = {
      [TransferrableMutationType.CHILD_LIST]: new ChildListProcessor(nodeContext),
      [TransferrableMutationType.ATTRIBUTES]: new AttributeProcessor(strings, sanitizer),
      [TransferrableMutationType.CHARACTER_DATA]: new CharacterDataProcessor(strings),
      [TransferrableMutationType.PROPERTIES]: new PropertyProcessor(strings, sanitizer),
      [TransferrableMutationType.EVENT_SUBSCRIPTION]: new EventSubscriptionProcessor(strings, workerContext),
      [TransferrableMutationType.GET_BOUNDING_CLIENT_RECT]: new BoundingClientRectProcessor(workerContext),
    };
  }

  /**
   * Process MutationRecords from worker thread applying changes to the existing DOM.
   * @param nodes New nodes to add in the main thread with the incoming mutations.
   * @param stringValues Additional string values to use in decoding messages.
   * @param mutations Changes to apply in both graph shape and content of Elements.
   */
  mutate(nodes: ArrayBuffer, stringValues: Array<string>, mutations: Uint16Array): void {
    this.strings.storeValues(stringValues);
    this.nodeContext.createNodes(nodes, this.sanitizer);
    this.mutationQueue = this.mutationQueue.concat(mutations);
    if (!this.pendingMutations) {
      this.pendingMutations = true;
      requestAnimationFrame(this.syncFlush);
    }
  }

  /**
   * Apply all stored mutations syncronously. This method works well, but can cause jank if there are too many
   * mutations to apply in a single frame.
   *
   * Investigations in using asyncFlush to resolve are worth considering.
   */
  private syncFlush = (): void => {
    this.mutationQueue.forEach(mutationArray => {
      let operationStart: number = 0;
      let length: number = mutationArray.length;

      while (operationStart < length) {
        const target = this.nodeContext.getNode(mutationArray[operationStart + 1]);
        if (!target) {
          console.error(`getNode() yields null – ${target}`);
          return;
        }
        if (DEBUG_ENABLED) {
          console.info('debug', 'mutation', this.executors[mutationArray[operationStart]].print(mutationArray, operationStart, target));
        }
        operationStart = this.executors[mutationArray[operationStart]].execute(mutationArray, operationStart, target);
      }
    });
    this.mutationQueue = [];
    this.pendingMutations = false;
  };
}
