import { Document } from '../dom/Document';
import { StorageLocation } from '../../transfer/TransferrableStorage';
import { StorageValueToWorker, MessageType, MessageToWorker, GetOrSet } from '../../transfer/Messages';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { store } from '../strings';
import { transfer } from '../MutationTransfer';
import { DocumentStub } from '../dom/DocumentStub';

export class AMP {
  private document: Document | DocumentStub;

  constructor(document: Document | DocumentStub) {
    this.document = document;
  }

  /**
   * Returns a promise that resolves with the value of `key`.
   * @param key
   */
  getState(key: string = ''): Promise<{} | null> {
    return new Promise((resolve) => {
      const messageHandler = (event: MessageEvent) => {
        const message: MessageToWorker = event.data;
        if (message[TransferrableKeys.type] !== MessageType.GET_STORAGE) {
          return;
        }
        // TODO: There is a race condition here if there are multiple concurrent
        // getState(k) messages in flight, where k is the same value.
        const storageMessage = message as StorageValueToWorker;
        if (storageMessage[TransferrableKeys.storageKey] !== key) {
          return;
        }
        this.document.removeGlobalEventListener('message', messageHandler);
        const value = storageMessage[TransferrableKeys.value];
        resolve(value);
      };

      this.document.addGlobalEventListener('message', messageHandler);
      transfer(this.document, [TransferrableMutationType.STORAGE, GetOrSet.GET, StorageLocation.AmpState, /* key */ store(key) + 1, /* value */ 0]);
      setTimeout(resolve, 500, null); // TODO: Why a magical constant, define and explain.
    });
  }

  /**
   * Deep-merges `state` into the existing state.
   * @param state
   */
  setState(state: {}): void {
    // Stringify `state` so it can be post-messaged as a transferrable.
    let stringified;
    try {
      stringified = JSON.stringify(state);
    } catch (e) {
      throw new Error(`AMP.setState only accepts valid JSON as input.`);
    }
    transfer(this.document, [TransferrableMutationType.STORAGE, GetOrSet.SET, StorageLocation.AmpState, /* key */ 0, /* value */ store(stringified) + 1]);
  }
}
