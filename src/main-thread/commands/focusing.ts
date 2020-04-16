/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
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

import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { FocusMutationIndex } from '../../transfer/TransferrableFocus';
import { CommandExecutorInterface } from './interface';

function Processor(type: TransferrableMutationType): CommandExecutorInterface {
  return (strings, nodes, workerContext, objectContext, config) => {
    const allowedExecution = config.executorsAllowed.includes(type);

    return {
      execute(mutations: Uint16Array, startPosition: number, allowedMutation: boolean): number {
        if (allowedExecution && allowedMutation) {
          const targetIndex = mutations[startPosition + FocusMutationIndex.Target];
          const target = nodes.getNode(targetIndex);

          if (!target) {
            console.error(`PROPERTY: getNode(${targetIndex}) is null.`);
          } else if (type === TransferrableMutationType.FOCUS) {
            target.focus();
          } else if (type === TransferrableMutationType.BLUR) {
            target.blur();
          }
        }

        return startPosition + FocusMutationIndex.End;
      },
      print(mutations: Uint16Array, startPosition: number): {} {
        const targetIndex = mutations[startPosition + FocusMutationIndex.Target];
        const target = nodes.getNode(targetIndex);

        return {
          type: 'FOCUSING/BLURRING',
          target,
        };
      },
    };
  };
}

export const FocusProcessor: CommandExecutorInterface = Processor(TransferrableMutationType.FOCUS);
export const BlurProcessor: CommandExecutorInterface = Processor(TransferrableMutationType.BLUR);
