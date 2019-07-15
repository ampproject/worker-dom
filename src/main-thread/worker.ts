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

    const keys: Array<string> = [];
    const { skeleton, strings } = createHydrateableRootNode(baseElement, config);
    for (const key in baseElement.style) {
      keys.push(key);
    }
    const code = `
      'use strict';
      (function(){
        ${workerDOMScript}
        var window = self['window'] = WorkerThread.workerDOM;
        window.innerWidth = ${window.innerWidth};
        window.innerHeight = ${window.innerHeight};
        WorkerThread.hydrate(window.document, ${JSON.stringify(strings)}, ${JSON.stringify(skeleton)}, ${JSON.stringify(keys)});
        window.document[${TransferrableKeys.observe}](this);
        Object.keys(window).forEach(key => self[key] = window[key]);
      }).call(self);
      ${authorScript}
      //# sourceURL=${encodeURI(config.authorURL)}`;
    this[TransferrableKeys.worker] = new Worker(URL.createObjectURL(new Blob([code])));
    if (DEBUG_ENABLED) {
      console.info('debug', 'hydratedNode', readableHydrateableRootNode(baseElement, config));
    }
    if (config.onCreateWorker) {
      config.onCreateWorker(baseElement, strings, skeleton, keys);
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
    this.worker.postMessage(message, transferables);
  }
}
