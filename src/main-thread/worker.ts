import { MessageToWorker } from '../transfer/Messages';
import { WorkerDOMConfiguration } from './configuration';
import { createHydrateableRootNode } from './serialize';
import { readableHydrateableRootNode, readableMessageToWorker } from './debugging';
import { NodeContext } from './nodes';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { StorageLocation } from '../transfer/TransferrableStorage';
import { IframeWorker } from './iframe-worker';

// TODO: Sanitizer storage init is likely broken, since the code currently
// attempts to stringify a Promise.
export type StorageInit = { storage: Storage | Promise<StorageValue>; errorMsg: null } | { storage: null; errorMsg: string };
export class WorkerContext {
  private [TransferrableKeys.worker]: Worker | IframeWorker;
  private nodeContext: NodeContext;
  private config: WorkerDOMConfiguration;

  /**
   * @param baseElement
   * @param nodeContext
   * @param workerDOMScript
   * @param authorScript
   * @param config
   */
  constructor(baseElement: HTMLElement, nodeContext: NodeContext, workerDOMScript: string, authorScript: string, config: WorkerDOMConfiguration) {
    this.nodeContext = nodeContext;
    this.config = config;

    const { skeleton, strings } = createHydrateableRootNode(baseElement, config, this);
    const cssKeys: Array<string> = [];
    const globalEventHandlerKeys: Array<string> = [];
    // TODO(choumx): Sync read of all localStorage and sessionStorage a possible performance bottleneck?
    const localStorageInit = getStorageInit('localStorage');
    const sessionStorageInit = getStorageInit('sessionStorage');

    for (const key in baseElement.style) {
      cssKeys.push(key);
    }
    for (const key in baseElement) {
      if (key.startsWith('on')) {
        globalEventHandlerKeys.push(key);
      }
    }

    // We skip assigning the globals for localStorage and sessionStorage because
    // We've already installed them. Also, accessing them can throw in incognito mode.
    const code = `
      'use strict';
      (function(){
        ${workerDOMScript}
        self['window'] = self;
        var workerDOM = WorkerThread.workerDOM;
        WorkerThread.hydrate(
          workerDOM.document,
          ${JSON.stringify(strings)},
          ${JSON.stringify(skeleton)},
          ${JSON.stringify(cssKeys)},
          ${JSON.stringify(globalEventHandlerKeys)},
          [${window.innerWidth}, ${window.innerHeight}],
          ${JSON.stringify(localStorageInit)},
          ${JSON.stringify(sessionStorageInit)}
        );
        workerDOM.document[${TransferrableKeys.observe}](this);
        Object.assign(self, workerDOM);
      }).call(self);
      ${authorScript}
      //# sourceURL=${encodeURI(config.authorURL)}`;
    if (!config.sandbox) {
      this[TransferrableKeys.worker] = new Worker(URL.createObjectURL(new Blob([code])));
    } else if (IS_AMP) {
      this[TransferrableKeys.worker] = new IframeWorker(URL.createObjectURL(new Blob([code])), config.sandbox.iframeUrl);
    }
    if (WORKER_DOM_DEBUG) {
      console.info('debug', 'hydratedNode', readableHydrateableRootNode(baseElement, config, this));
    }
    if (config.onCreateWorker) {
      config.onCreateWorker(baseElement, strings, skeleton, cssKeys);
    }
  }

  /**
   * Returns a Promise that resolves when the Worker is ready to receive messages.
   * @returns {Promise<void>}
   */
  ready() {
    return (this.worker as IframeWorker).readyPromise || Promise.resolve();
  }

  /**
   * Returns the private worker.
   */
  get worker(): Worker | IframeWorker {
    return this[TransferrableKeys.worker];
  }

  /**
   * @param message
   */
  messageToWorker(message: MessageToWorker, transferables?: Transferable[]) {
    if (WORKER_DOM_DEBUG) {
      console.info('debug', 'messageToWorker', readableMessageToWorker(this.nodeContext, message));
    }
    if (this.config.onSendMessage) {
      this.config.onSendMessage(message);
    }
    this.worker.postMessage(message, transferables || []);
  }
}

function getStorageInit(type: 'localStorage' | 'sessionStorage', sanitizer?: Sanitizer): StorageInit {
  try {
    if (!sanitizer) {
      return { storage: window[type], errorMsg: null };
    }
    return {
      storage: sanitizer.getStorage(type == 'localStorage' ? StorageLocation.Local : StorageLocation.Session),
      errorMsg: null,
    };
  } catch (err) {
    return { errorMsg: err.message, storage: null };
  }
}
