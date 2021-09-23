type MessageFromWorker = {
  type: 'onmessage' | 'onerror' | 'onmessageerror';
  message: any;
};
export type MessageFromIframe = { type: 'iframe-ready' } | { type: 'worker-ready' } | MessageFromWorker;
export type MessageToIframe = { type: 'terminate' } | { type: 'init-worker'; code: string } | { type: 'postMessage'; message: any };

/**
 * An almost drop-in replacement for a standard Web Worker, although this one
 * within a sandboxed cross-origin iframe for a heightened security boundary.
 * For more details on Worker, see: https://developer.mozilla.org/en-US/docs/Web/API/Worker
 *
 * The iframe used for sandboxing must follow a specific contract. It:
 *   1. Must send a ready message to the main-thread.
 *   2. Must listen for a message from main-thread with the code to initialize a Worker with.
 *   3. Must send "worker-ready" once worker is initialized.
 *   4. Must proxy all messages between the Worker and Parent, including errors.
 */
class IframeWorker {
  // Public Worker API
  public onerror: (this: IframeWorker, ev: ErrorEvent) => any;
  public onmessage: (this: IframeWorker, ev: MessageEvent) => any;
  public onmessageerror: (this: IframeWorker, ev: MessageEvent) => any;
  public readyPromise: Promise<void>;

  // Internal variables.
  private iframe: HTMLIFrameElement;
  private readyPromiseResolve: Function;

  /**
   * @param url The URL to initiate the worker from.
   * @param iframeUrl The URL of the iframe to use as the worker proxy.
   */
  constructor(private url: string | URL, iframeUrl: string) {
    this.iframe = window.document.createElement('iframe');
    this.iframe.setAttribute('sandbox', 'allow-scripts');
    this.iframe.setAttribute('style', 'display:none');
    this.iframe.setAttribute('src', iframeUrl);
    this.url = url;
    this.readyPromise = new Promise((resolve) => {
      this.readyPromiseResolve = resolve;
    });

    this.setupInit();
    this.proxyFromWorker();
    window.document.body.appendChild(this.iframe);
  }

  private setupInit() {
    const listener = (event: MessageEvent) => {
      if (event.source != this.iframe.contentWindow) {
        return;
      }

      fetch(this.url.toString())
        .then((res) => res.text())
        .then((code) => {
          const data = event.data as MessageFromIframe;
          if (data.type == 'iframe-ready') {
            const msg: MessageToIframe = { type: 'init-worker', code };
            this.iframe.contentWindow!.postMessage(msg, '*');
          } else if (data.type === 'worker-ready') {
            this.readyPromiseResolve();
            window.removeEventListener('message', listener);
          }
        });
    };
    window.addEventListener('message', listener);
  }

  private proxyFromWorker() {
    window.addEventListener('message', (event: MessageEvent) => {
      if (event.source != this.iframe.contentWindow) {
        return;
      }

      const { type, message } = event.data as MessageFromWorker;
      if (type == 'onmessage' && this.onmessage) {
        this.onmessage({ ...event, data: message });
      } else if (type === 'onerror' && this.onerror) {
        this.onerror(message);
      } else if (type === 'onmessageerror' && this.onmessageerror) {
        this.onmessageerror({ ...event, data: message });
      }
    });
  }

  /**
   * See https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage
   * @param message
   * @param transferables
   */
  postMessage(message: any, transferables?: Array<Transferable>) {
    const msg: MessageToIframe = { type: 'postMessage', message };
    this.readyPromise.then(() => {
      this.iframe.contentWindow!.postMessage(msg, '*', transferables);
    });
  }

  /**
   * See https://developer.mozilla.org/en-US/docs/Web/API/Worker/terminate
   */
  terminate() {
    const msg: MessageToIframe = { type: 'terminate' };
    this.iframe.contentWindow!.postMessage(msg, '*');
    this.iframe.remove();
  }
}

export { IframeWorker };
