import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { MessageType } from '../../transfer/Messages';
import { CommandExecutorInterface } from './interface';
import { OffscreenCanvasMutationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';

export const OffscreenCanvasProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.OFFSCREEN_CANVAS_INSTANCE);

  return {
    execute(mutations: Uint16Array, startPosition: number, allowedMutation: boolean): number {
      if (allowedExecution && allowedMutation) {
        const targetIndex = mutations[startPosition + OffscreenCanvasMutationIndex.Target];
        const target = nodeContext.getNode(targetIndex);
        if (target) {
          const offscreen = (target as HTMLCanvasElement).transferControlToOffscreen();
          workerContext.messageToWorker(
            {
              [TransferrableKeys.type]: MessageType.OFFSCREEN_CANVAS_INSTANCE,
              [TransferrableKeys.target]: [target._index_],
              [TransferrableKeys.data]: offscreen, // Object, an OffscreenCanvas
            },
            [offscreen],
          );
        } else {
          console.error(`'OFFSCREEN_CANVAS_INSTANCE': getNode(${targetIndex}) is null.`);
        }
      }

      return startPosition + OffscreenCanvasMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number, target?: RenderableElement | null): {} {
      return {
        type: 'OFFSCREEN_CANVAS_INSTANCE',
        target,
        allowedExecution,
      };
    },
  };
};
