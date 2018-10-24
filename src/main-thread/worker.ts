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
import { readableMessageToWorker } from './debugging';
import { UserCallbacks } from './UserCallbacks';

/**
 * Stored user callbacks for the most recently created worker.
 * Note: This can be easily changed to a lookup table to support multiple workers.
 */
let callbacks_: UserCallbacks | null;

/**
 * TODO(KB): Fetch Polyfill for IE11.
 * @param workerDomURL
 * @param authorScriptURL
 * @param callbacks
 */
export function createWorker(workerDomURL: string, authorScriptURL: string, callbacks: UserCallbacks): Promise<Worker | null> {
  callbacks_ = callbacks;

  return Promise.all([fetch(workerDomURL).then(response => response.text()), fetch(authorScriptURL).then(response => response.text())])
    .then(([workerScript, authorScript]) => {
      // TODO(KB): Minify this output during build process.
      const keys: Array<string> = [];
      for (let key in document.body.style) {
        keys.push(`'${key}'`);
      }
      const code = `
        'use strict';
        ${workerScript}
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
          this.appendKeys([${keys}]);
          ${authorScript}
        }).call(WorkerThread.workerDOM);
//# sourceURL=${encodeURI(authorScriptURL)}`;
      return new Worker(URL.createObjectURL(new Blob([code])));
    })
    .catch(error => {
      return null;
    });
}

/**
 * @param worker
 * @param message
 */
export function messageToWorker(worker: Worker, message: MessageToWorker) {
  if (callbacks_ && callbacks_.onSendMessage) {
    const readable = readableMessageToWorker(message);
    callbacks_.onSendMessage(readable);
  }
  worker.postMessage(message);
}
