import { MessageToWorker, MessageType, ResizeSyncToWorker } from '../transfer/Messages';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { WorkerDOMGlobalScope } from './WorkerDOMGlobalScope';

export function propagate(global: WorkerDOMGlobalScope): void {
  const document = global.document;
  if (!document.addGlobalEventListener) {
    return;
  }
  document.addGlobalEventListener('message', ({ data }: { data: MessageToWorker }) => {
    if (data[TransferrableKeys.type] !== MessageType.RESIZE) {
      return;
    }
    const sync = (data as ResizeSyncToWorker)[TransferrableKeys.sync];
    if (sync) {
      global.innerWidth = sync[0];
      global.innerHeight = sync[1];
    }
  });
}
