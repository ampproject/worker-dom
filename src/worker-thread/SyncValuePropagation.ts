import { MessageToWorker, MessageType, ValueSyncToWorker } from '../transfer/Messages';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { get } from './nodes';
import { Document } from './dom/Document';
import { WorkerDOMGlobalScope } from './WorkerDOMGlobalScope';

/**
 * When an event is dispatched from the main thread, it needs to be propagated in the worker thread.
 * Propagate adds an event listener to the worker global scope and uses the WorkerDOM Node.dispatchEvent
 * method to dispatch the transfered event in the worker thread.
 */
export function propagate(global: WorkerDOMGlobalScope): void {
  const document = global.document;
  if (!document.addGlobalEventListener) {
    return;
  }
  document.addGlobalEventListener('message', ({ data }: { data: MessageToWorker }) => {
    if (data[TransferrableKeys.type] !== MessageType.SYNC) {
      return;
    }
    const sync = (data as ValueSyncToWorker)[TransferrableKeys.sync];
    const node = get(sync[TransferrableKeys.index]);
    if (node) {
      (node.ownerDocument as Document)[TransferrableKeys.allowTransfer] = false;
      // Modify the private backing ivar of `value` property to avoid mutation/sync cycle.
      node.value = sync[TransferrableKeys.value];
      (node.ownerDocument as Document)[TransferrableKeys.allowTransfer] = true;
    }
  });
}
