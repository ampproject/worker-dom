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

    const { skeleton, strings } = createHydrateableRootNode(baseElement, config);

    const cssKeys: Array<string> = [];
    for (const key in baseElement.style) {
      cssKeys.push(key);
    }

    // TODO(choumx): Sync read of all localStorage and sessionStorage a possible performance bottleneck?
    const localStorageData = config.sanitizer ? config.sanitizer.getStorage(StorageLocation.Local) : window.localStorage;
    const sessionStorageData = config.sanitizer ? config.sanitizer.getStorage(StorageLocation.Session) : window.sessionStorage;

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
          [${window.innerWidth}, ${window.innerHeight}],
          ${JSON.stringify(localStorageData)},
          ${JSON.stringify(sessionStorageData)}
        );
        workerDOM.document[${TransferrableKeys.observe}](this);
        Object.keys(workerDOM).forEach(key => self[key] = workerDOM[key]);
      }).call(self);
      ${authorScript}
      //# sourceURL=${encodeURI(config.authorURL)}`;
    this[TransferrableKeys.worker] = new Worker(URL.createObjectURL(new Blob([code])));
    if (DEBUG_ENABLED) {
      console.info('debug', 'hydratedNode', readableHydrateableRootNode(baseElement, config));
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
    if (DEBUG_ENABLED) {
      console.info('debug', 'messageToWorker', readableMessageToWorker(this.nodeContext, message));
    }
    if (this.config.onSendMessage) {
      this.config.onSendMessage(message);
    }
    this.worker.postMessage(message, transferables || []);
  }
}
