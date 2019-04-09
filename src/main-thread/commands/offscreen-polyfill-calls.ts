import { CommandExecutor } from './interface';
import { WorkerContext } from '../worker';
import { OffscreenContextPolyfillMutationIndex } from '../../transfer/TransferrableMutation';
import { NumericBoolean } from '../../utils';
import { Strings } from '../strings';

export function OffscreenPolyfillCallProcessor(strings: Strings, workerContext: WorkerContext): CommandExecutor {
  return {
    execute(mutations: Uint16Array, startPosition: number, target: RenderableElement): number {
      // TODO: find out if there's a way to know if this is necessary
      const float32Mutations = new Float32Array(mutations.buffer);

      const methodCalled = strings.get(float32Mutations[startPosition + OffscreenContextPolyfillMutationIndex.MethodCalled]);
      const isSetter = float32Mutations[startPosition + OffscreenContextPolyfillMutationIndex.IsSetter] === NumericBoolean.TRUE;
      const stringArgIndex = float32Mutations[startPosition + OffscreenContextPolyfillMutationIndex.StringArgIndex];
      const argCount = float32Mutations[startPosition + OffscreenContextPolyfillMutationIndex.ArgumentCount];

      // since this case only runs with the polyfill, then this canvas
      // should not have transferred its control to offscreen.
      const mainContext = (target as HTMLCanvasElement).getContext('2d');
      const args = [] as any[];

      if (argCount > 0) {
        float32Mutations
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
    print(mutations: Uint16Array, startPosition: number, target?: RenderableElement | null): Object {
      return {
        type: 'OFFSCREEN_CONTEXT_CALL',
        target,
      };
    },
  };
}
