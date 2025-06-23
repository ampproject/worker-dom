import { TransferrableKeys } from '../../transfer/TransferrableKeys.js';
import { MessageType, ImageBitmapToWorker } from '../../transfer/Messages.js';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation.js';
import { HTMLImageElement } from '../dom/HTMLImageElement.js';
import { HTMLCanvasElement } from '../dom/HTMLCanvasElement.js';
import { Document } from '../dom/Document.js';
import { transfer } from '../MutationTransfer.js';

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
