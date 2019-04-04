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

    // TODO(KB): Minify this output during build process.
    const keys: Array<string> = [];
    const { skeleton, strings } = createHydrateableRootNode(baseElement);
    for (const key in baseElement.style) {
      keys.push(key);
    }
    const code = `
      'use strict';
      ${workerDOMScript}
      (function() {
        var self = this;
        var window = this;
        var document = this.document;
        var localStorage = this.localStorage;
        var location = this.location;
        var defaultView = document.defaultView;
        var Node = defaultView.Node;
        var Text = defaultView.Text;
        var Element = defaultView.Element;
        var SVGElement = defaultView.SVGElement;
        var Document = defaultView.Document;
        var Event = defaultView.Event;
        var MutationObserver = defaultView.MutationObserver;

        function addEventListener(type, handler) {
          return document.addEventListener(type, handler);
        }
        function removeEventListener(type, handler) {
          return document.removeEventListener(type, handler);
        }
        window.innerWidth = ${window.innerWidth};
        window.innerHeight = ${window.innerHeight};
        this.initialize(document, ${JSON.stringify(strings)}, ${JSON.stringify(skeleton)}, ${JSON.stringify(keys)});
        document.observe(window);
        ${authorScript}
      }).call(WorkerThread.workerDOM);
  //# sourceURL=${encodeURI(config.authorURL)}`;
    this[TransferrableKeys.worker] = new Worker(URL.createObjectURL(new Blob([code])));
    if (DEBUG_ENABLED) {
      console.info('debug', 'hydratedNode', readableHydrateableRootNode(baseElement));
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
  messageToWorker(message: MessageToWorker) {
    if (DEBUG_ENABLED) {
      console.info('debug', 'messageToWorker', readableMessageToWorker(this.nodeContext, message));
    }
    if (this.config.onSendMessage) {
      this.config.onSendMessage(message);
    }
    this.worker.postMessage(message);
  }
}
