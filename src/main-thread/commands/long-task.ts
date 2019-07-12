/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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

import { CommandExecutor, CommandExecutorInterface } from './interface';
import { TransferrableMutationType, ReadableMutationType, LongTaskMutationIndex } from '../../transfer/TransferrableMutation';
import { StringContext } from '../strings';
import { NodeContext } from '../nodes';
import { WorkerContext } from '../worker';
import { WorkerDOMConfiguration } from '../configuration';
import { ObjectContext } from '../object-context';

export interface LongTaskCommandExecutorInterface extends CommandExecutorInterface {
  (
    stringContext: StringContext,
    nodeContext: NodeContext,
    workerContext: WorkerContext,
    objectContext: ObjectContext,
    config: WorkerDOMConfiguration,
  ): LongTaskCommandExecutor;
}
export interface LongTaskCommandExecutor extends CommandExecutor {
  active: boolean;
}

export const LongTaskExecutor: LongTaskCommandExecutorInterface = (
  stringContext: StringContext,
  nodeContext: NodeContext,
  workerContext: WorkerContext,
  objectContext: ObjectContext,
  config: WorkerDOMConfiguration,
) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.LONG_TASK_START);
  let index: number = 0;
  let currentResolver: Function | null;

  return {
    execute(mutations: Uint16Array, startPosition: number): number {
      if (allowedExecution && config.longTask) {
        if (mutations[startPosition] === TransferrableMutationType.LONG_TASK_START) {
          index++;
          if (!currentResolver) {
            config.longTask(new Promise(resolve => (currentResolver = resolve)));
          }
        } else if (mutations[startPosition] === TransferrableMutationType.LONG_TASK_END) {
          index--;
          if (currentResolver && index <= 0) {
            currentResolver();
            currentResolver = null;
            index = 0;
          }
        }
      }
      return startPosition + LongTaskMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number): Object {
      return {
        type: ReadableMutationType[mutations[startPosition]],
        allowedExecution,
      };
    },
    get active(): boolean {
      return currentResolver !== null;
    },
  };
};
