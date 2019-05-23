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

import { CommandExecutorInterface } from './interface';
import { OffscreenContextPolyfillMutationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { NumericBoolean } from '../../utils';
import { deserialize } from '../global-id';

export const OffscreenPolyfillCallProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.OFFSCREEN_POLYFILL);

  return {
    execute(mutations: Uint16Array, startPosition: number, target: RenderableElement): number {
      const argCount = mutations[startPosition + OffscreenContextPolyfillMutationIndex.ArgumentCount];
      const methodCalled = strings.get(mutations[startPosition + OffscreenContextPolyfillMutationIndex.MethodCalled]);
      const isSetter = mutations[startPosition + OffscreenContextPolyfillMutationIndex.IsSetter] === NumericBoolean.TRUE;

      const argsStart = startPosition + OffscreenContextPolyfillMutationIndex.Args;
      let { offset, args } = deserialize(mutations, argsStart, argCount, strings);

      if (allowedExecution) {
        const mainContext = (target as HTMLCanvasElement).getContext('2d');
        if (isSetter) {
          (mainContext as any)[methodCalled] = args[0];
        } else {
          (mainContext as any)[methodCalled](...args);
        }
      }

      return offset;
    },
    print(mutations: Uint16Array, startPosition: number, target?: RenderableElement | null): Object {
      const argCount = mutations[startPosition + OffscreenContextPolyfillMutationIndex.ArgumentCount];
      const methodCalled = strings.get(mutations[startPosition + OffscreenContextPolyfillMutationIndex.MethodCalled]);
      const isSetter = mutations[startPosition + OffscreenContextPolyfillMutationIndex.IsSetter] === NumericBoolean.TRUE;

      const argsStart = startPosition + OffscreenContextPolyfillMutationIndex.Args;
      let { offset, args } = deserialize(mutations, argsStart, argCount, strings);

      return {
        type: 'OFFSCREEN_POLYFILL',
        allowedExecution,
        target,
        ArgumentCount: argCount,
        MethodCalled: methodCalled,
        IsSetter: isSetter,
        Args: args,
        End: offset,
      };
    },
  };
};
