import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { MessageType, ImageBitmapToWorker } from '../../transfer/Messages';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { HTMLImageElement } from '../dom/HTMLImageElement';
import { HTMLCanvasElement } from '../dom/HTMLCanvasElement';
import { Document } from '../dom/Document';
import { transfer } from '../MutationTransfer';

let indexTracker = 0;

export function retrieveImageBitmap(image: HTMLImageElement | HTMLCanvasElement, canvas: HTMLCanvasElement): Promise<any> {
  const callIndex = indexTracker++;
  const document = canvas.ownerDocument as Document;

  return new Promise((resolve) => {
    const messageHandler = ({ data }: { data: ImageBitmapToWorker }) => {
      if (data[TransferrableKeys.type] === MessageType.IMAGE_BITMAP_INSTANCE && data[TransferrableKeys.callIndex] === callIndex) {
        document.removeGlobalEventListener('message', messageHandler);
        const transferredImageBitmap = (data as ImageBitmapToWorker)[TransferrableKeys.data];
        resolve(transferredImageBitmap);
      }
    };

    if (!document.addGlobalEventListener) {
      throw new Error('addGlobalEventListener is not defined.');
    } else {
      document.addGlobalEventListener('message', messageHandler);
      transfer(canvas.ownerDocument as Document, [TransferrableMutationType.IMAGE_BITMAP_INSTANCE, image[TransferrableKeys.index], callIndex]);
    }
  });
}
