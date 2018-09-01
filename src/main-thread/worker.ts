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

// TODO(KB): Fetch Polyfill for IE11.
export function createWorker(workerDomURL: string, authorScriptURL: string): Promise<Worker | null> {
  if (authorSharesDocumentHostname(authorScriptURL)) {
    // Allow the worker to be created if the author code lives
    // on the same hostname as the hosting document.
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
      .catch(_ => {
        return null;
      });
  }
  // When the author code lives on another hostname, disallow creation of a worker.
  return new Promise(_ => null);
}

/**
 * Posts a message to the worker.
 * @param worker 
 * @param message 
 */
export function messageToWorker(worker: Worker, message: MessageToWorker) {
  worker.postMessage(message);
}

/**
 * Validates the hostname of the author script matches the document.
 * @param authorScriptURL 
 * @returns boolean if the hostname of the document and the author script match.
 */
function authorSharesDocumentHostname(authorScriptURL: string): boolean {
  if (window.URL && window.URL.prototype && ('href' in window.URL.prototype)) {
    // If URL constructor is available, use it directly instead.
    return new URL(authorScriptURL, location.href).hostname === location.hostname;
  }

  const anchorElement: HTMLAnchorElement = document.createElement('a');
  anchorElement.href = authorScriptURL;

  // IE11 doesn't provide full URL components when parsing relative URLs.
  // Assigning to itself again does the trick #3449.
  if (!anchorElement.protocol) {
    anchorElement.href = anchorElement.href;
  }

  return anchorElement.hostname === location.hostname;
}
