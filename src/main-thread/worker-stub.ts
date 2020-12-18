/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
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

declare type MessageEventHandler = (event: MessageEvent) => void;
// const enum MessageToIframeType {
//   INIT = 'init-worker',
//   IFRAME_READY = 'iframe-ready',
// }

interface MessageToIframe {
  data: {
    type: string;
  };
  //source: Window,
}

/**
 * A lightweight Document stub for the no-dom amp binary.
 */
export class IframeWorker {
  // Internal variables.
  private iframe: HTMLIFrameElement;
  public onmessageerror: Function;
  public terminate: Function;
  public onerror: Function;
  private handler?: MessageEventHandler;

  /**
   * @param workerDOMSrc
   */
  constructor(workerDOMSrc: String) {
    this.iframe = document.createElement('iframe');
    this.iframe.setAttribute('sandbox', 'allow-scripts');
    this.initWorkerInIframe(workerDOMSrc);
    this.listenToWorker();
  }

  isSrcSupported() {
    // Safari doesn't allow worker script from blobUrl, load iframe from cdn.ampproject.net
    return true;
  }

  initWorkerInIframe(workerDOMSrc: String) {
    if (!this.isSrcSupported()) {
      console.error('Browser Not Supported Yet');
    } else {
      // TODO: Compile iframe srcdoc, and move out of the function
      const iframeCode: string = `
        parent.postMessage({
          'type': 'iframe-ready',
        }, '*');
        window.addEventListener('message', event => {
          const data = event.data;
          const origin = event.origin;
          if (data.type == 'init-worker') {
            const src = data.workerDOMSrc;
            const worker = new Worker(URL.createObjectURL(new Blob([src])));
          }
        });
      `;
      const iframeHtml: string = `
        <html>
          <!-- Heres a comment  -->
          <sxript>${iframeCode}</sxript>
        </html>
      `.replace(/sxript/g, 'script');
      this.iframe.setAttribute('srcdoc', iframeHtml);
    }

    //
    const listener = (event: MessageToIframe) => {
      // TODO: Need to verify event.source
      // How to declare event source in MessageToIframe?
      if (this.iframe.contentWindow && event.data.type == 'iframe-ready') {
        this.iframe.contentWindow.postMessage(
          {
            type: 'init-worker',
            workerDOMSrc: workerDOMSrc,
          },
          '*',
        );
      }
    };
    window.addEventListener('message', listener);
    document.body.appendChild(this.iframe);
  }

  listenToWorker() {
    this.iframe.addEventListener('message', (event) => {
      if (event.type == 'worker-response') {
        if (this.handler) {
          // Declare the event format
          this.handler(new MessageEvent(event.type, {}));
        }
      }
    });
  }

  public postMessage(message: MessageToWorker, transferables: Array<Transferable>) {
    if (this.iframe.contentWindow) {
      this.iframe.contentWindow.postMessage(
        {
          type: 'worker-msg',
          message: message,
        },
        '*',
        transferables,
      );
    }
  }

  set onmessage(handler: MessageEventHandler) {
    this.handler = handler;
  }
}
