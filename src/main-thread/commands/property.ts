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

import { PropertyMutationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';
import { NumericBoolean } from '../../utils';

export const PropertyProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.PROPERTIES);

  return {
    execute(mutations: Uint16Array, startPosition: number): number {
      if (allowedExecution) {
        const targetIndex = mutations[startPosition + PropertyMutationIndex.Target];
        const target = nodeContext.getNode(targetIndex);
        const name = strings.get(mutations[startPosition + PropertyMutationIndex.Name]);
        const isBooleanProperty = mutations[startPosition + PropertyMutationIndex.IsBoolean] === NumericBoolean.TRUE;
        const value = isBooleanProperty
          ? mutations[startPosition + PropertyMutationIndex.Value] === NumericBoolean.TRUE
          : (mutations[startPosition + PropertyMutationIndex.Value] !== 0 && strings.get(mutations[startPosition + PropertyMutationIndex.Value])) ||
            null;

        if (target) {
          if (name && value != null) {
            if (config.sanitizer) {
              const mutated = config.sanitizer.changeProperty(target, name, String(value));
              if (!mutated) {
                // TODO(choumx): Inform worker that sanitizer ignored unsafe property value change.
              }
            } else {
              target[name] = value;
            }
          }
        } else {
          console.error(`PROPERTY: getNode(${targetIndex}) is null.`);
        }
      }

      return startPosition + PropertyMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number): Object {
      const targetIndex = mutations[startPosition + PropertyMutationIndex.Target];
      const target = nodeContext.getNode(targetIndex);
      const name = strings.get(mutations[startPosition + PropertyMutationIndex.Name]);
      const isBooleanProperty = mutations[startPosition + PropertyMutationIndex.IsBoolean] === NumericBoolean.TRUE;
      const value = isBooleanProperty
        ? mutations[startPosition + PropertyMutationIndex.Value] === NumericBoolean.TRUE
        : (mutations[startPosition + PropertyMutationIndex.Value] !== 0 && strings.get(mutations[startPosition + PropertyMutationIndex.Value])) ||
          null;

      return {
        target,
        name,
        value,
        allowedExecution,
      };
    },
  };
};
