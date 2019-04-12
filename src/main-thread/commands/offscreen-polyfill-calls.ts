import { CommandExecutor } from './interface';
import { WorkerContext } from '../worker';
import { OffscreenContextPolyfillMutationIndex } from '../../transfer/TransferrableMutation';
import { NumericBoolean } from '../../utils';
import { Strings } from '../strings';

export function OffscreenPolyfillCallProcessor(strings: Strings, workerContext: WorkerContext): CommandExecutor {
  return {
    execute(mutations: Uint16Array, startPosition: number, target: RenderableElement): number {
      const float32Needed = mutations[startPosition + OffscreenContextPolyfillMutationIndex.Float32Needed] === NumericBoolean.TRUE;
      const argCount = mutations[startPosition + OffscreenContextPolyfillMutationIndex.ArgumentCount];
      const methodCalled = strings.get(mutations[startPosition + OffscreenContextPolyfillMutationIndex.MethodCalled]);
      const isSetter = mutations[startPosition + OffscreenContextPolyfillMutationIndex.IsSetter] === NumericBoolean.TRUE;
      const stringArgIndex = mutations[startPosition + OffscreenContextPolyfillMutationIndex.StringArgIndex];
      const argsStart = startPosition + OffscreenContextPolyfillMutationIndex.Args;

      let argsTypedArray: Uint16Array | Float32Array;
      let argOffset = argCount;

      if (float32Needed) {
        argOffset *= 2;
        argsTypedArray = new Float32Array(mutations.slice(argsStart, argsStart + argOffset).buffer);
      } else {
        argsTypedArray = mutations.slice(argsStart, argsStart + argOffset);
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

        if (methodCalled === 'setLineDash') {
          args = [args];
        }
      }

      if (isSetter) {
        (mainContext as any)[methodCalled] = args[0];
      } else {
        (mainContext as any)[methodCalled](...args);
      }

      return startPosition + OffscreenContextPolyfillMutationIndex.End + argOffset;
    },
    print(mutations: Uint16Array, startPosition: number, target?: RenderableElement | null): Object {
      const float32Needed = mutations[startPosition + OffscreenContextPolyfillMutationIndex.Float32Needed] === NumericBoolean.TRUE;
      const argCount = mutations[startPosition + OffscreenContextPolyfillMutationIndex.ArgumentCount];
      let mutationsArray: Uint16Array | Float32Array;
      let endOffset = OffscreenContextPolyfillMutationIndex.End + argCount;

      if (float32Needed) {
        endOffset = endOffset * 2;
        mutationsArray = new Float32Array(mutations.slice(startPosition, startPosition + endOffset).buffer);
      } else {
        mutationsArray = mutations.slice(startPosition, startPosition + endOffset);
      }

      const methodCalled = strings.get(mutationsArray[OffscreenContextPolyfillMutationIndex.MethodCalled]);
      const isSetter = mutationsArray[OffscreenContextPolyfillMutationIndex.IsSetter] === NumericBoolean.TRUE;
      const stringArgIndex = mutationsArray[OffscreenContextPolyfillMutationIndex.StringArgIndex];

      return {
        type: 'OFFSCREEN_POLYFILL',
        target,
        IsFloat32ArrayNeeded: float32Needed,
        MethodName: methodCalled,
        IsSetter: isSetter,
        StringArgIndex: stringArgIndex,
        ArgCount: argCount,
        End: endOffset,
      };
    },
  };
}
