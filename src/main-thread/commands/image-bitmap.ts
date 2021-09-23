import { CommandExecutorInterface } from './interface';
import { TransferrableMutationType, ImageBitmapMutationIndex } from '../../transfer/TransferrableMutation';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { MessageType } from '../../transfer/Messages';

export const ImageBitmapProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.IMAGE_BITMAP_INSTANCE);

  return {
    execute(mutations: Uint16Array, startPosition: number, allowedMutation: boolean): number {
      if (allowedExecution && allowedMutation) {
        const targetIndex = mutations[startPosition + ImageBitmapMutationIndex.Target];
        const target = nodeContext.getNode(targetIndex);
        if (target) {
          self.createImageBitmap(target as HTMLImageElement | HTMLCanvasElement).then((imageBitmap) => {
            workerContext.messageToWorker(
              {
                [TransferrableKeys.type]: MessageType.IMAGE_BITMAP_INSTANCE,
                [TransferrableKeys.callIndex]: mutations[startPosition + ImageBitmapMutationIndex.CallIndex],
                [TransferrableKeys.data]: imageBitmap,
              },
              [imageBitmap],
            );
          });
        } else {
          console.error(`IMAGE_BITMAP_INSTANCE: getNode(${targetIndex}) is null.`);
        }
      }

      return startPosition + ImageBitmapMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number): {} {
      const targetIndex = mutations[startPosition + ImageBitmapMutationIndex.Target];
      const target = nodeContext.getNode(targetIndex);
      return {
        type: 'IMAGE_BITMAP_INSTANCE',
        target,
        allowedExecution,
        callIndex: mutations[startPosition + ImageBitmapMutationIndex.CallIndex],
      };
    },
  };
};
