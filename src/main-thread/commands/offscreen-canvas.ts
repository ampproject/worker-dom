import { WorkerContext } from '../worker';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { MessageType } from '../../transfer/Messages';
import { CommandExecutor } from './interface';
import { OffscreenCanvasMutationIndex } from '../../transfer/TransferrableMutation';

export function OffscreenCanvasProcessor(workerContext: WorkerContext): CommandExecutor {
  return {
    execute(mutations: Uint16Array, startPosition: number, target: RenderableElement): number {
      if (target) {
        const canvas = target as HTMLCanvasElement;
        const offscreen = canvas.transferControlToOffscreen();
        workerContext.messageToWorker(
          {
            [TransferrableKeys.type]: MessageType.OFFSCREEN_CANVAS_INSTANCE,
            [TransferrableKeys.target]: [target._index_],
            [TransferrableKeys.data]: offscreen, // Object, an OffscreenCanvas
          },
          [offscreen],
        );
      } else {
        console.error(`getNode() yields null – ${target}`);
      }

      return startPosition + OffscreenCanvasMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number, target?: RenderableElement | null): Object {

      return {
        type: 'OFFSCREEN_CANVAS_INSTANCE',
        target,
      };
    },
  };
}
