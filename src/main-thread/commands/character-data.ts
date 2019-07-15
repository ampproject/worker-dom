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

import { CharacterDataMutationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';

export const CharacterDataProcessor: CommandExecutorInterface = (strings, nodes, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.CHARACTER_DATA);

  return {
    execute(mutations: Uint16Array, startPosition: number): number {
      if (allowedExecution) {
        const targetIndex = mutations[startPosition + CharacterDataMutationIndex.Target];
        const target = nodes.getNode(targetIndex);
        const value = mutations[startPosition + CharacterDataMutationIndex.Value];
        if (target) {
          if (value) {
            // Sanitization not necessary for textContent.
            target.textContent = strings.get(value);
          }
        } else {
          console.error(`CHAR_DATA: getNode(${targetIndex}) is null.`);
        }
      }
      return startPosition + CharacterDataMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number): Object {
      const targetIndex = mutations[startPosition + CharacterDataMutationIndex.Target];
      const target = nodes.getNode(targetIndex);
      return {
        target,
        allowedExecution,
        value: strings.get(mutations[startPosition + CharacterDataMutationIndex.Value]),
      };
    },
  };
};
