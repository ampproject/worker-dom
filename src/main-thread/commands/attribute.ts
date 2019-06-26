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

  return {
    execute(mutations: Uint16Array, startPosition: number, target: RenderableElement): number {
      if (allowedExecution) {
        const attributeName = strings.get(mutations[startPosition + AttributeMutationIndex.Name]);
        // Value is sent as 0 when it's the default value or removal.
        // Value is sent as index + 1 when it's a valid value.
        const value =
          (mutations[startPosition + AttributeMutationIndex.Value] !== 0 &&
            strings.get(mutations[startPosition + AttributeMutationIndex.Value] - 1)) ||
          null;

        if (attributeName != null) {
          if (config.sanitizer) {
            const mutated = config.sanitizer.mutateAttribute(target, attributeName, value);
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
      }
      return startPosition + AttributeMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number, target?: RenderableElement | null): Object {
      const attributeName = strings.get(mutations[startPosition + AttributeMutationIndex.Name]);
      // Value is sent as 0 when it's the default value or removal.
      // Value is sent as index + 1 when it's a valid value.
      const value =
        (mutations[startPosition + AttributeMutationIndex.Value] !== 0 && strings.get(mutations[startPosition + AttributeMutationIndex.Value] - 1)) ||
        null;

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
