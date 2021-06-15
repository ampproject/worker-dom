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

import { CommandExecutorInterface } from './interface';
import {
  TransferrableMutationType,
  ScrollIntoViewMutationIndex,
} from '../../transfer/TransferrableMutation';

export const ScrollIntoViewProcessor: CommandExecutorInterface = (
  strings,
  nodes,
  workerContext,
  objectContext,
  config,
) => {
  const allowedExecution = config.executorsAllowed.includes(
    TransferrableMutationType.SCROLL_INTO_VIEW,
  );

  return {
    execute(
      mutations: Uint16Array,
      startPosition: number,
      allowedMutation: boolean,
    ): number {
      if (allowedExecution && allowedMutation) {
        const targetIndex =
          mutations[startPosition + ScrollIntoViewMutationIndex.Target];
        const target = nodes.getNode(targetIndex);
        if (target) {
          target.scrollIntoView();
        } else {
          console.error(`SCROLL_INTO_VIEW: getNode(${targetIndex}) is null.`);
        }
      }

      return startPosition + ScrollIntoViewMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number): {} {
      const targetIndex =
        mutations[startPosition + ScrollIntoViewMutationIndex.Target];
      const target = nodes.getNode(targetIndex);
      return {
        type: 'SCROLL_INTO_VIEW',
        target,
        allowedExecution,
      };
    },
  };
};
