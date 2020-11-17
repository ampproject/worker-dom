/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { MessageToWorker } from '../transfer/Messages';
import { WorkerDOMConfiguration } from './configuration';
import { createHydrateableRootNode } from './serialize';
import { readableHydrateableRootNode, readableMessageToWorker } from './debugging';
import { NodeContext } from './nodes';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { StorageLocation } from '../transfer/TransferrableStorage';

export type StorageSupport = { supported: boolean; errorMsg?: string };
export class WorkerContext {
  private [TransferrableKeys.worker]: Worker;
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
    const localStorageSupportedStatus = getStorageSupportStatus('localStorage');
    const sessionStorageSupportedStatus = getStorageSupportStatus('sessionStorage');
    let localStorageData;
    if (localStorageSupportedStatus.supported) {
      localStorageData = config.sanitizer
        ? // TODO: how can this possibly work. sanitizer returns a promise!?
          config.sanitizer.getStorage(StorageLocation.Local)
        : window.localStorage;
    }
    let sessionStorageData;
    if (sessionStorageSupportedStatus.supported) {
      sessionStorageData = config.sanitizer ? config.sanitizer.getStorage(StorageLocation.Session) : window.sessionStorage;
    }

    for (const key in baseElement.style) {
      cssKeys.push(key);
    }
    for (const key in baseElement) {
      if (key.startsWith('on')) {
        globalEventHandlerKeys.push(key);
      }
    }

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
          ${JSON.stringify(localStorageSupportedStatus.errorMsg ?? localStorageData)},
          ${JSON.stringify(sessionStorageSupportedStatus.errorMsg ?? sessionStorageData)}
        );
        workerDOM.document[${TransferrableKeys.observe}](this);
        Object.keys(workerDOM).forEach(function(k){try{self[k]=workerDOM[k]}catch(e){}});
      }).call(self);
      ${authorScript}
      //# sourceURL=${encodeURI(config.authorURL)}`;
    this[TransferrableKeys.worker] = new Worker(URL.createObjectURL(new Blob([code])));
    if (WORKER_DOM_DEBUG) {
      console.info('debug', 'hydratedNode', readableHydrateableRootNode(baseElement, config, this));
    }
    if (config.onCreateWorker) {
      config.onCreateWorker(baseElement, strings, skeleton, cssKeys);
    }
  }

  /**
   * Returns the private worker.
   */
  get worker(): Worker {
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

function getStorageSupportStatus(type: 'localStorage' | 'sessionStorage'): StorageSupport {
  try {
    let randKey = 'WORKER_DOM_TEST_KEY';
    globalThis[type].setItem(randKey, '');
  } catch (err) {
    return { supported: false, errorMsg: err.message };
  }
  return { supported: true };
}
