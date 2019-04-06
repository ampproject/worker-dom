/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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
import { Document } from '../../worker-thread/dom/Document';
import { MutationFromWorker } from '../../transfer/Messages';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { emitter, Emitter } from '../Emitter';
import { createTestingDocument } from '../DocumentCreation';
import { appendKeys } from '../../worker-thread/css/CSSStyleDeclaration';

const test = anyTest as TestInterface<{
  document: Document;
  emitter: Emitter;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    document,
    emitter: emitter(document),
  };
});

test.serial.cb('Element.style transfer single value', t => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [TransferrableMutationType.ATTRIBUTES, div[TransferrableKeys.index], strings.indexOf('style'), 0, strings.indexOf('width: 12px;') + 1],
      'mutation is as expected',
    );
    t.end();
  }

  document.body.appendChild(div);
  appendKeys(['width']);
  div.style.width = '10px';
  Promise.resolve().then(() => {
    emitter.once(transmitted);
    div.style.width = '12px';
  });
});

test.serial.cb('Element.style transfer multiple values', t => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [
        TransferrableMutationType.ATTRIBUTES,
        div[TransferrableKeys.index],
        strings.indexOf('style'),
        0,
        strings.indexOf('width: 14px; height: 12px;') + 1,
      ],
      'mutation is as expected',
    );
    t.end();
  }

  document.body.appendChild(div);
  appendKeys(['width', 'height']);
  div.style.width = '10px';
  div.style.height = '12px';
  Promise.resolve().then(() => {
    emitter.once(transmitted);
    div.style.width = '14px';
  });
});

test.serial.cb('Element.style transfer single value, setProperty', t => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [TransferrableMutationType.ATTRIBUTES, div[TransferrableKeys.index], strings.indexOf('style'), 0, strings.indexOf('width: 12px;') + 1],
      'mutation is as expected',
    );
    t.end();
  }

  document.body.appendChild(div);
  appendKeys(['width']);
  div.style.setProperty('width', '10px');
  Promise.resolve().then(() => {
    emitter.once(transmitted);
    div.style.setProperty('width', '12px');
  });
});

test.serial.cb('Element.style.width mutation observed, multiple values, via cssText', t => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [
        TransferrableMutationType.ATTRIBUTES,
        div[TransferrableKeys.index],
        strings.indexOf('style'),
        0,
        strings.indexOf('width: 12px; height: 14px;') + 1,
      ],
      'mutation is as expected',
    );
    t.end();
  }

  document.body.appendChild(div);
  appendKeys(['width', 'height']);
  div.style.cssText = 'width: 10px; height: 12px';
  Promise.resolve().then(() => {
    emitter.once(transmitted);
    div.style.cssText = 'width: 12px; height: 14px';
  });
});
