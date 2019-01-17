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
import { set as setPhase, Phases } from '../transfer/phase';
import { createHydrateableNode, initialStrings } from './serialize';
import { WorkerCallbacks } from './callbacks';

/**
 * Stored callbacks for the most recently created worker.
 * Note: This can be easily changed to a lookup table to support multiple workers.
 */
let callbacks_: WorkerCallbacks | undefined;

/**
 * TODO(KB): Fetch Polyfill for IE11.
 * @param baseElement
 * @param workerDOMURL
 * @param authorScriptURL
 * @param callbacks
 */
export function fetchAndCreateWorker(
  baseElement: HTMLElement,
  workerDOMURL: string,
  authorScriptURL: string,
  callbacks?: WorkerCallbacks,
): Promise<Worker | null> {
  callbacks_ = callbacks;
  return Promise.all([fetch(workerDOMURL).then(response => response.text()), fetch(authorScriptURL).then(response => response.text())])
    .then(([workerDOMScript, authorScript]) => {
      const worker = createWorker(baseElement, workerDOMScript, authorScript, authorScriptURL);
      setPhase(Phases.Hydrating);
      return worker;
    })
    .catch(error => {
      return null;
    });
}

/**
 * @param baseElement
 * @param workerDOMScript
 * @param authorScript
 * @param authorScriptURL
 */
export function createWorker(baseElement: HTMLElement, workerDOMScript: string, authorScript: string, authorScriptURL: string): Worker {
  // TODO(KB): Minify this output during build process.
  const keys: Array<string> = [];
  const hydratedNode = createHydrateableNode(baseElement);
  for (const key in document.body.style) {
    keys.push(`'${key}'`);
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
      this.consumeInitialDOM(document, ${JSON.stringify(initialStrings)}, ${JSON.stringify(hydratedNode)});
      this.appendKeys([${keys}]);
      document.observe();
      ${authorScript}
    }).call(WorkerThread.workerDOM);
//# sourceURL=${encodeURI(authorScriptURL)}`;
  return new Worker(URL.createObjectURL(new Blob([code])));
}

/**
 * @param worker
 * @param message
 */
export function messageToWorker(worker: Worker, message: MessageToWorker) {
  if (callbacks_ && callbacks_.onSendMessage) {
    callbacks_.onSendMessage(message);
  }
  worker.postMessage(message);
}
