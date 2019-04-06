import { CommandExecutor } from './interface';
import { WorkerContext } from '../worker';
import { OffscreenContextPolyfillMutationIndex } from '../../transfer/TransferrableMutation';
import { NumericBoolean } from '../../utils';
import { Strings } from '../strings';

export function OffscreenPolyfillCallProcessor(strings: Strings, workerContext: WorkerContext): CommandExecutor {
  return {
    execute(mutations: Float32Array, startPosition: number, target: RenderableElement): number {
      const isSetter = mutations[startPosition + OffscreenContextPolyfillMutationIndex.IsSetter] === NumericBoolean.TRUE;
      const argCount = mutations[startPosition + OffscreenContextPolyfillMutationIndex.ArgumentCount];
      const methodCalled = strings.get(mutations[startPosition + OffscreenContextPolyfillMutationIndex.MethodCalled]);
      const stringArgIndex = mutations[startPosition + OffscreenContextPolyfillMutationIndex.StringArgIndex];

      // since this case only runs with the polyfill, then this canvas
      // should not have transferred its control to offscreen.
      const mainContext = (target as HTMLCanvasElement).getContext('2d');
      const args = [] as any[];

      if (argCount > 0) {
        mutations
          .slice(startPosition + OffscreenContextPolyfillMutationIndex.Args, startPosition + OffscreenContextPolyfillMutationIndex.Args + argCount)
          .forEach((arg, i) => {
            if (stringArgIndex === i) {
              args.push(strings.get(arg));
            } else {
              args.push(arg);
            }
          });
      }

      if (isSetter) {
        if (argCount === 1) {
          (mainContext as any)[methodCalled] = args[0];
        } else {
          // do something (throw?)
        }
      } else {
        (mainContext as any)[methodCalled](...args);
      }

      return startPosition + OffscreenContextPolyfillMutationIndex.End + argCount;
    },
    print(mutations: Float32Array, startPosition: number, target?: RenderableElement | null): Object {
      return {
        type: 'OFFSCREEN_CONTEXT_CALL',
        target,
      };
    },
  };
}
