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
import { StringContext } from './strings';
import { WorkerContext } from './worker';
import { TransferrableMutationType, ReadableMutationType, isUserVisibleMutation } from '../transfer/TransferrableMutation';
import { CommandExecutor, CommandExecutorInterface } from './commands/interface';
import { WorkerDOMConfiguration, MutationPumpFunction } from './configuration';
import { Phase } from '../transfer/Phase';
import { ObjectContext } from './object-context';

export class MutatorProcessor {
  private stringContext: StringContext;
  private nodeContext: NodeContext;
  private mutationQueue: Array<Uint16Array> = [];
  private pendingMutations: boolean = false;
  private mutationPumpFunction: MutationPumpFunction;
  private sanitizer: Sanitizer | undefined;
  private executors: {
    [key: number]: CommandExecutor;
  };

  /**
   * @param stringContext
   * @param nodeContext
   * @param workerContext
   * @param sanitizer Sanitizer to apply to content if needed.
   */
  constructor(
    stringContext: StringContext,
    nodeContext: NodeContext,
    workerContext: WorkerContext,
    config: WorkerDOMConfiguration,
    objectContext: ObjectContext,
    getExecutors: (
      args: [StringContext, NodeContext, WorkerContext, ObjectContext, WorkerDOMConfiguration],
    ) => { [key: number]: CommandExecutorInterface },
  ) {
    this.stringContext = stringContext;
    this.nodeContext = nodeContext;
    this.sanitizer = config.sanitizer;
    this.mutationPumpFunction = config.mutationPump;
    const args: [StringContext, NodeContext, WorkerContext, ObjectContext, WorkerDOMConfiguration] = [
      stringContext,
      nodeContext,
      workerContext,
      objectContext,
      config,
    ];
    this.executors = {};
    Object.entries(getExecutors([stringContext, nodeContext, workerContext, objectContext, config])).forEach(
      ([index, executor]: [string, CommandExecutorInterface]) => {
        this.executors[+index] = executor.apply(null, args);
      },
    );
  }

  /**
   * Process MutationRecords from worker thread applying changes to the existing DOM.
   * @param phase Current Phase Worker Thread exists in.
   * @param nodes New nodes to add in the main thread with the incoming mutations.
   * @param stringValues Additional string values to use in decoding messages.
   * @param mutations Changes to apply in both graph shape and content of Elements.
   */
  public mutate(phase: Phase, nodes: ArrayBuffer, stringValues: Array<string>, mutations: Uint16Array): void {
    this.stringContext.storeValues(stringValues);
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
   *
   * @param allowVisibleMutations
   * @return Array of mutation types that were disallowed.
   */
  private syncFlush = (allowVisibleMutations: boolean = true): TransferrableMutationType[] => {
    if (WORKER_DOM_DEBUG) {
      console.group('Mutations');
    }
    const disallowedMutations: TransferrableMutationType[] = [];
    this.mutationQueue.forEach((mutationArray) => {
      const length: number = mutationArray.length;
      let operationStart: number = 0;

      while (operationStart < length) {
        // TransferrableMutationType is always at position 0.
        const mutationType = mutationArray[operationStart];
        // TODO(worker-dom): Hoist `allow` up to entry point (index.amp.ts) to avoid bundling `isUserVisibleMutation`.
        const allow = allowVisibleMutations || !isUserVisibleMutation(mutationType);
        if (!allow) {
          // TODO(worker-dom): Consider returning the strings from executor.print() for better error messaging.
          disallowedMutations.push(mutationType);
        }
        const executor = this.executors[mutationType];
        if (WORKER_DOM_DEBUG) {
          console.log(allow ? '' : '[disallowed]', ReadableMutationType[mutationType], executor.print(mutationArray, operationStart));
        }
        operationStart = executor.execute(mutationArray, operationStart, allow);
      }
    });
    if (WORKER_DOM_DEBUG) {
      console.groupEnd();
    }
    this.mutationQueue = [];
    this.pendingMutations = false;
    return disallowedMutations;
  };
}
