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
      const hasArrayArgument = mutationsArray[OffscreenContextPolyfillMutationIndex.HasArrayArgument] === NumericBoolean.TRUE;

      const mainContext = (target as HTMLCanvasElement).getContext('2d');
      let args = [] as any[];

      if (argCount > 0) {
        mutationsArray.slice(OffscreenContextPolyfillMutationIndex.Args, endOffset).forEach((arg: any, i: number) => {
          if (stringArgIndex - 1 === i) {
            args.push(strings.get(arg));
          } else {
            args.push(arg);
          }
        });

        if (hasArrayArgument) {
          args = [args];
        }
      }

      if (isSetter) {
        (mainContext as any)[methodCalled] = args[0];
      } else {
        (mainContext as any)[methodCalled](...args);
      }

      return startPosition + endOffset;
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
