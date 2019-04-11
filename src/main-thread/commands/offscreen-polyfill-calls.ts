import { CommandExecutor } from './interface';
import { WorkerContext } from '../worker';
import { OffscreenContextPolyfillMutationIndex } from '../../transfer/TransferrableMutation';
import { NumericBoolean } from '../../utils';
import { Strings } from '../strings';

export function OffscreenPolyfillCallProcessor(strings: Strings, workerContext: WorkerContext): CommandExecutor {
  return {
    execute(mutations: Uint16Array, startPosition: number, target: RenderableElement): number {
      const float32Needed = mutations[startPosition + OffscreenContextPolyfillMutationIndex.Float32Needed] === NumericBoolean.TRUE;
      const mutationsArray = float32Needed ? new Float32Array(mutations.slice(startPosition).buffer) : mutations.slice(startPosition);
      const methodCalled = strings.get(mutationsArray[OffscreenContextPolyfillMutationIndex.MethodCalled]);
      const isSetter = mutationsArray[OffscreenContextPolyfillMutationIndex.IsSetter] === NumericBoolean.TRUE;
      const stringArgIndex = mutationsArray[OffscreenContextPolyfillMutationIndex.StringArgIndex];
      const argCount = mutationsArray[OffscreenContextPolyfillMutationIndex.ArgumentCount];

      const mainContext = (target as HTMLCanvasElement).getContext('2d');
      const args = [] as any[];

      if (argCount > 0) {
        mutationsArray
          .slice(OffscreenContextPolyfillMutationIndex.Args, OffscreenContextPolyfillMutationIndex.Args + argCount)
          .forEach((arg: any, i: number) => {
            if (stringArgIndex === i) {
              args.push(strings.get(arg));
            } else {
              args.push(arg);
            }
          });
      }

      if (isSetter) {
        (mainContext as any)[methodCalled] = args[0];
      } else {
        (mainContext as any)[methodCalled](...args);
      }

      return float32Needed
        ? startPosition + (OffscreenContextPolyfillMutationIndex.End + argCount) * 2
        : startPosition + OffscreenContextPolyfillMutationIndex.End + argCount;
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
