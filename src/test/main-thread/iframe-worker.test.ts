/**
 * Copyright 2021 The AMP HTML Authors. All Rights Reserved.
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

import anyTest, { TestInterface } from 'ava';
import { Env } from './helpers/env';
import { IframeWorker, MessageToIframe, MessageFromIframe } from '../../main-thread/iframe-worker';

const test = anyTest as TestInterface<{
  env: Env;
  fakeReceiveMessage: (msg: MessageFromIframe) => void;
  sentToIframe: MessageToIframe[];
  worker: IframeWorker;
}>;

test.beforeEach((t) => {
  const env = new Env();
  const sentToIframe: MessageToIframe[] = [];

  const messageListeners: any = [];
  env.window.addEventListener = (type: string, listener: any) => messageListeners.push(listener);

  global.fetch = (blob: any) =>
    Promise.resolve({
      text: () => Promise.resolve(blob.toString().slice('BLOB:'.length)),
    }) as any;
  const worker = new IframeWorker(URL.createObjectURL(new Blob(['worker code'])), 'https://example.com');
  const iframe = (worker as any).iframe as HTMLIFrameElement;

  const oldPostMessage = iframe.contentWindow!.postMessage.bind(iframe.contentWindow);
  iframe.contentWindow!.postMessage = (msg, targetOrigin, transferables) => {
    sentToIframe.push(msg);
    oldPostMessage(msg, targetOrigin, transferables);
  };

  function sendFromIframe(msg: Object): void {
    for (let listener of messageListeners) {
      listener({ data: msg, source: iframe.contentWindow });
    }
  }

  t.context = {
    env: new Env(),
    fakeReceiveMessage: sendFromIframe,
    sentToIframe,
    worker,
  };
});
test('No messages sent to subframe until it declares iframe-ready.', async (t) => {
  const { sentToIframe } = t.context;
  await new Promise(setTimeout as any);
  t.is(sentToIframe.length, 0);
});

test('Should listen for and respond to an iframe-ready signal.', async (t) => {
  const { fakeReceiveMessage, sentToIframe } = t.context;
  fakeReceiveMessage({ type: 'iframe-ready' });
  await new Promise(setTimeout as any);

  t.is(sentToIframe.length, 1);
  t.deepEqual(sentToIframe, [
    {
      type: 'init-worker',
      code: 'worker code',
    },
  ]);
});

test('Should proxy postMessage calls after init completes.', async (t) => {
  const { worker, sentToIframe, fakeReceiveMessage } = t.context;

  worker.postMessage({ hello: 'world' });
  t.is(sentToIframe.length, 0);

  fakeReceiveMessage({ type: 'worker-ready' });
  await new Promise(setTimeout as any);
  t.is(sentToIframe.length, 1);
  t.deepEqual(sentToIframe, [
    {
      type: 'postMessage',
      message: { hello: 'world' },
    },
  ]);
});

test('Should proxy iframed worker messages.', async (t) => {
  const { worker, fakeReceiveMessage } = t.context;
  const onmessageMessages: MessageEvent[] = [];
  const onerrorMessages: ErrorEvent[] = [];
  const onmessageerrorMessages: MessageEvent[] = [];

  worker.onmessage = (msg: MessageEvent) => onmessageMessages.push(msg);
  worker.onmessageerror = (msg: MessageEvent) => onmessageerrorMessages.push(msg);
  worker.onerror = (msg: ErrorEvent) => onerrorMessages.push(msg);

  fakeReceiveMessage({ type: 'onmessage', message: {} });
  fakeReceiveMessage({ type: 'onmessage', message: {} });

  fakeReceiveMessage({ type: 'onerror', message: { onerror: 1 } });
  fakeReceiveMessage({ type: 'onmessageerror', message: {} });

  t.is(onmessageMessages.length, 2);
  t.is(onmessageerrorMessages.length, 1);
  t.is(onerrorMessages.length, 1);
});

test('Should send terminate message', (t) => {
  const { worker, sentToIframe } = t.context;
  worker.terminate();
  t.deepEqual(sentToIframe, [{ type: 'terminate' }]);
});
