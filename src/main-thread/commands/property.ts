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

import { PropertyMutationIndex } from '../../transfer/TransferrableMutation';
import { CommandExecutor } from './interface';
import { Strings } from '../strings';
import { WorkerDOMConfiguration } from '../configuration';

export function PropertyProcessor(strings: Strings, config: WorkerDOMConfiguration): CommandExecutor {
  return {
    execute(mutations: Uint16Array, startPosition: number, target: RenderableElement): number {
      const name = strings.get(mutations[startPosition + PropertyMutationIndex.Name]);
      const value =
        (mutations[startPosition + PropertyMutationIndex.Value] !== 0 && strings.get(mutations[startPosition + PropertyMutationIndex.Value])) || null;
      if (name && value != null) {
        const stringValue = String(value);
        if (!config.sanitizer || config.sanitizer.validProperty(target.nodeName, name, stringValue)) {
          // TODO(choumx, #122): Proper support for non-string property mutations.
          const isBooleanProperty = name == 'checked';
          target[name] = isBooleanProperty ? value === 'true' : value;
        } else {
          // TODO(choumx): Inform worker that sanitizer ignored unsafe property value change.
        }
      }
      return startPosition + PropertyMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number, target?: RenderableElement | null): Object {
      const name = strings.get(mutations[startPosition + PropertyMutationIndex.Name]);
      const value =
        (mutations[startPosition + PropertyMutationIndex.Value] !== 0 && strings.get(mutations[startPosition + PropertyMutationIndex.Value])) || null;

      return {
        target,
        name,
        value,
      };
    },
  };
}
