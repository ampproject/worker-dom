import { CommandExecutorInterface } from './interface';
import { ImageBitmapMutationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { MessageType } from '../../transfer/Messages';

export const ImageBitmapProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.IMAGE_BITMAP_INSTANCE);

  return {
    execute(mutations: any[], allowedMutation: boolean) {
      if (allowedExecution && allowedMutation) {
        const target = mutations[ImageBitmapMutationIndex.Target];
        if (target) {
          self.createImageBitmap(target as HTMLImageElement | HTMLCanvasElement).then((imageBitmap) => {
            workerContext.messageToWorker(
              {
                [TransferrableKeys.type]: MessageType.IMAGE_BITMAP_INSTANCE,
                [TransferrableKeys.callIndex]: mutations[ImageBitmapMutationIndex.CallIndex],
                [TransferrableKeys.data]: imageBitmap,
              },
              [imageBitmap],
            );
          });
        } else {
          console.error(`IMAGE_BITMAP_INSTANCE: target is null.`);
        }
      }
    },
    print(mutations: any[]): {} {
      const target = mutations[ImageBitmapMutationIndex.Target];
      return {
        type: 'IMAGE_BITMAP_INSTANCE',
        target,
        allowedExecution,
        callIndex: mutations[ImageBitmapMutationIndex.CallIndex],
      };
    },
  };
};
