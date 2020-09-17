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

import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { MessageType } from '../../transfer/Messages';
import { CommandExecutorInterface } from './interface';
import { TransferrableMutationType, SetInnerHTMLMutationIndex } from '../../transfer/TransferrableMutation';
import { createHydrateableRootNode } from '../serialize';

export const SetInnerHTMLProcessor: CommandExecutorInterface = (stringContext, nodes, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.SET_INNER_HTML);

  return {
    execute(mutations: Uint16Array, startPosition: number, allowedMutation: boolean): number {
      if (allowedExecution && allowedMutation) {
        const targetIndex = mutations[startPosition + SetInnerHTMLMutationIndex.Target];
        const html = stringContext.get(mutations[startPosition + SetInnerHTMLMutationIndex.Value]);
        let target = nodes.getNode(targetIndex);
        if (!target) {
          target = document.createElement('div'); //  Disconnected node, just for calculating innerHTML.
        }
        target.innerHTML = html;

        const { skeleton, strings } = createHydrateableRootNode(target, config, workerContext);
        workerContext.messageToWorker({
          [TransferrableKeys.type]: MessageType.HYDRATE,
          [TransferrableKeys.target]: [targetIndex],
          [TransferrableKeys.nodes]: skeleton,
          [TransferrableKeys.strings]: strings,
        });
      }

      return startPosition + SetInnerHTMLMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number): {} {
      const targetIndex = mutations[startPosition + SetInnerHTMLMutationIndex.Target];
      const html = mutations[startPosition + SetInnerHTMLMutationIndex.Value];
      const target = nodes.getNode(targetIndex);
      return {
        type: 'SET_INNER_HTML',
        target,
        html,
        allowedExecution,
      };
    },
  };
};
