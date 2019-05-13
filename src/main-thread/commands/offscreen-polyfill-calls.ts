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

import { CommandExecutor } from './interface';
import { OffscreenContextPolyfillMutationIndex } from '../../transfer/TransferrableMutation';
import { NumericBoolean } from '../../utils';
import { Strings } from '../strings';

/**
 * Processes all calls to an OffscreenCanvas Polyfill on this thread (since manually synchronized).
 * @param strings Transferred strings.
 */
export function OffscreenPolyfillCallProcessor(strings: Strings): CommandExecutor {
  return {
    execute(mutations: Uint16Array, startPosition: number, target: RenderableElement): number {
      const float32Needed = mutations[startPosition + OffscreenContextPolyfillMutationIndex.Float32Needed] === NumericBoolean.TRUE;
      const argCount = mutations[startPosition + OffscreenContextPolyfillMutationIndex.ArgumentCount];
      const methodCalled = strings.get(mutations[startPosition + OffscreenContextPolyfillMutationIndex.MethodCalled]);
      const isSetter = mutations[startPosition + OffscreenContextPolyfillMutationIndex.IsSetter] === NumericBoolean.TRUE;
      const stringArgIndex = mutations[startPosition + OffscreenContextPolyfillMutationIndex.StringArgIndex];

      const argsStart = startPosition + OffscreenContextPolyfillMutationIndex.Args;
      let argsTypedArray: Uint16Array | Float32Array;
      let argEnd = argCount;

      if (float32Needed) {
        argEnd *= 2;
        argsTypedArray = new Float32Array(mutations.slice(argsStart, argsStart + argEnd).buffer);
      } else {
        argsTypedArray = mutations.slice(argsStart, argsStart + argEnd);
      }

      const mainContext = (target as HTMLCanvasElement).getContext('2d');
      let args = [] as any[];

      if (argCount > 0) {
        argsTypedArray.forEach((arg: any, i: number) => {
          if (stringArgIndex - 1 === i) {
            args.push(strings.get(arg));
          } else {
            args.push(arg);
          }
        });

        // setLineDash has a single argument: number[]
        // values from the array argument are transferred independently, so we must do this
        if (methodCalled === 'setLineDash') {
          args = [args];
        }
      }

      if (isSetter) {
        (mainContext as any)[methodCalled] = args[0];
      } else {
        (mainContext as any)[methodCalled](...args);
      }

      return startPosition + OffscreenContextPolyfillMutationIndex.End + argEnd;
    },
    print(mutations: Uint16Array, startPosition: number, target?: RenderableElement | null): Object {
      const float32Needed = mutations[startPosition + OffscreenContextPolyfillMutationIndex.Float32Needed] === NumericBoolean.TRUE;
      const argCount = mutations[startPosition + OffscreenContextPolyfillMutationIndex.ArgumentCount];
      const methodCalled = strings.get(mutations[startPosition + OffscreenContextPolyfillMutationIndex.MethodCalled]);
      const isSetter = mutations[startPosition + OffscreenContextPolyfillMutationIndex.IsSetter] === NumericBoolean.TRUE;
      const stringArgIndex = mutations[startPosition + OffscreenContextPolyfillMutationIndex.StringArgIndex];

      const argsStart = startPosition + OffscreenContextPolyfillMutationIndex.Args;
      let argsTypedArray: Uint16Array | Float32Array;
      let argEnd = argCount;

      if (float32Needed) {
        argEnd *= 2;
        argsTypedArray = new Float32Array(mutations.slice(argsStart, argsStart + argEnd).buffer);
      } else {
        argsTypedArray = mutations.slice(argsStart, argsStart + argEnd);
      }

      let args = [] as any[];

      if (argCount > 0) {
        argsTypedArray.forEach((arg: any, i: number) => {
          if (stringArgIndex - 1 === i) {
            args.push(strings.get(arg));
          } else {
            args.push(arg);
          }
        });

        // setLineDash has a single argument: number[]
        // values from the array argument are transferred independently, so we must do this
        if (methodCalled === 'setLineDash') {
          args = [args];
        }
      }

      return {
        type: 'OFFSCREEN_POLYFILL',
        target,
        Float32Needed: float32Needed,
        ArgumentCount: argCount,
        MethodCalled: methodCalled,
        IsSetter: isSetter,
        StringArgIndex: stringArgIndex,
        Args: args,
        End: startPosition + OffscreenContextPolyfillMutationIndex.End + argEnd,
      };
    },
  };
}
