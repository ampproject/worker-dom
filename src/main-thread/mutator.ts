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

import { NodeContext } from './nodes';
import { Strings } from './strings';
import { WorkerContext } from './worker';
import { TransferrableMutationType, ReadableMutationType } from '../transfer/TransferrableMutation';
import { EventSubscriptionProcessor } from './commands/event-subscription';
import { BoundingClientRectProcessor } from './commands/bounding-client-rect';
import { ChildListProcessor } from './commands/child-list';
import { AttributeProcessor } from './commands/attribute';
import { CharacterDataProcessor } from './commands/character-data';
import { PropertyProcessor } from './commands/property';
import { LongTaskExecutor } from './commands/long-task';
import { CommandExecutor } from './commands/interface';
import { WorkerDOMConfiguration, MutationPumpFunction } from './configuration';
import { Phase } from '../transfer/Phase';

export class MutatorProcessor {
  private strings: Strings;
  private nodeContext: NodeContext;
  private mutationQueue: Array<Uint16Array> = [];
  private pendingMutations: boolean = false;
  private mutationPumpFunction: MutationPumpFunction;
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
  constructor(strings: Strings, nodeContext: NodeContext, workerContext: WorkerContext, config: WorkerDOMConfiguration) {
    this.strings = strings;
    this.nodeContext = nodeContext;
    this.sanitizer = config.sanitizer;
    this.mutationPumpFunction = config.mutationPump || requestAnimationFrame.bind(null);

    const LongTaskExecutorInstance = LongTaskExecutor(config);
    this.executors = {
      [TransferrableMutationType.CHILD_LIST]: ChildListProcessor(nodeContext),
      [TransferrableMutationType.ATTRIBUTES]: AttributeProcessor(strings, config),
      [TransferrableMutationType.CHARACTER_DATA]: CharacterDataProcessor(strings),
      [TransferrableMutationType.PROPERTIES]: PropertyProcessor(strings, config),
      [TransferrableMutationType.EVENT_SUBSCRIPTION]: EventSubscriptionProcessor(strings, nodeContext, workerContext),
      [TransferrableMutationType.GET_BOUNDING_CLIENT_RECT]: BoundingClientRectProcessor(workerContext),
      [TransferrableMutationType.LONG_TASK_START]: LongTaskExecutorInstance,
      [TransferrableMutationType.LONG_TASK_END]: LongTaskExecutorInstance,
    };
  }

  /**
   * Process MutationRecords from worker thread applying changes to the existing DOM.
   * @param phase Current Phase Worker Thread exists in.
   * @param nodes New nodes to add in the main thread with the incoming mutations.
   * @param stringValues Additional string values to use in decoding messages.
   * @param mutations Changes to apply in both graph shape and content of Elements.
   */
  public mutate(phase: Phase, nodes: ArrayBuffer, stringValues: Array<string>, mutations: Uint16Array): void {
    this.strings.storeValues(stringValues);
    this.nodeContext.createNodes(nodes, this.sanitizer);
    this.mutationQueue = this.mutationQueue.concat(mutations);
    if (!this.pendingMutations) {
      this.pendingMutations = true;
      this.mutationPumpFunction(this.syncFlush, phase);
    }
  }

  /**
   * Apply all stored mutations syncronously. This method works well, but can cause jank if there are too many
   * mutations to apply in a single frame.
   *
   * Investigations in using asyncFlush to resolve are worth considering.
   */
  private syncFlush = (): void => {
    if (DEBUG_ENABLED) {
      console.group('Mutations');
    }
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
          console.log(
            ReadableMutationType[mutationArray[operationStart]],
            this.executors[mutationArray[operationStart]].print(mutationArray, operationStart, target),
          );
        }
        operationStart = this.executors[mutationArray[operationStart]].execute(mutationArray, operationStart, target);
      }
    });
    if (DEBUG_ENABLED) {
      console.groupEnd();
    }
    this.mutationQueue = [];
    this.pendingMutations = false;
  };
}
