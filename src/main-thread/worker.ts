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
import { WorkerCallbacks } from './callbacks';
import { createHydrateableRootNode } from './serialize';

export class WorkerContext {
  private worker: Worker;

  /**
   * Stored callbacks for the most recently created worker.
   * Note: This can be easily changed to a lookup table to support multiple workers.
   */
  private callbacks: WorkerCallbacks | undefined;

  /**
   * @param baseElement
   * @param workerDOMScript
   * @param authorScript
   * @param authorScriptURL
   */
  constructor(baseElement: HTMLElement, workerDOMScript: string, authorScript: string, authorScriptURL: string, callbacks?: WorkerCallbacks) {
    this.callbacks = callbacks;

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
        this.consumeInitialDOM(document, ${JSON.stringify(strings)}, ${JSON.stringify(skeleton)});
        this.appendKeys(${JSON.stringify(keys)});
        document.observe();
        ${authorScript}
      }).call(WorkerThread.workerDOM);
  //# sourceURL=${encodeURI(authorScriptURL)}`;
    this.worker = new Worker(URL.createObjectURL(new Blob([code])));
    if (callbacks && callbacks.onCreateWorker) {
      callbacks.onCreateWorker(baseElement);
    }
  }

  getWorker(): Worker {
    return this.worker;
  }

  /**
   * @param message
   */
  messageToWorker(message: MessageToWorker) {
    if (this.callbacks && this.callbacks.onSendMessage) {
      this.callbacks.onSendMessage(message);
    }
    this.worker.postMessage(message);
  }
}
