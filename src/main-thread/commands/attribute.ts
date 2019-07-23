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

import { AttributeMutationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';

export const AttributeProcessor: CommandExecutorInterface = (strings, nodes, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.ATTRIBUTES);

  /**
   * @param mutations
   * @param startPosition
   */
  const getValue = (mutations: Uint16Array, startPosition: number): string | null => {
    const value = mutations[startPosition + AttributeMutationIndex.Value];
    // Value is sent as 0 when it's the default value or removal.
    // Value is sent as index + 1 when it's a valid value.
    return value !== 0 ? strings.get(value - 1) : null;
  };

  return {
    execute(mutations: Uint16Array, startPosition: number): number {
      if (allowedExecution) {
        const targetIndex = mutations[startPosition + AttributeMutationIndex.Target];
        const target = nodes.getNode(targetIndex);

        const attributeName = strings.get(mutations[startPosition + AttributeMutationIndex.Name]);
        const value = getValue(mutations, startPosition);

        if (target) {
          if (attributeName != null) {
            if (config.sanitizer) {
              const mutated = config.sanitizer.changeAttribute(target, attributeName, value);
              if (!mutated) {
                // TODO(choumx): Inform worker that sanitizer ignored unsafe attribute value change.
              }
            } else {
              if (value == null) {
                target.removeAttribute(attributeName);
              } else {
                target.setAttribute(attributeName, value);
              }
            }
          }
        } else {
          console.error(`ATTR_LIST: getNode(${targetIndex}) is null.`);
        }
      }
      return startPosition + AttributeMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number): Object {
      const targetIndex = mutations[startPosition + AttributeMutationIndex.Target];
      const target = nodes.getNode(targetIndex);
      const attributeName = strings.get(mutations[startPosition + AttributeMutationIndex.Name]);
      const value = getValue(mutations, startPosition);

      return {
        target,
        allowedExecution,
        attributeName,
        value,
        remove: value == null,
      };
    },
  };
};
