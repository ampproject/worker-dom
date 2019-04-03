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

import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { MutationFromWorker } from '../../transfer/Messages';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { emitter, Emitter } from '../Emitter';
import { createTestingDocument } from '../DocumentCreation';

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

test.serial.cb('Node.removeChild transfer only child', t => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [TransferrableMutationType.CHILD_LIST, document.body[TransferrableKeys.index], 0, 0, 0, 1, div[TransferrableKeys.index]],
      'mutation is as expected',
    );
    t.end();
  }

  document.body.appendChild(div);
  Promise.resolve().then(() => {
    emitter.once(transmitted);
    document.body.removeChild(div);
  });
});

test.serial.cb('Node.removeChild transfer, one of siblings', t => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');
  const p = document.createElement('p');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [TransferrableMutationType.CHILD_LIST, document.body[TransferrableKeys.index], 0, 0, 0, 1, div[TransferrableKeys.index]],
      'mutation is as expected',
    );
    t.end();
  }

  document.body.appendChild(div);
  document.body.appendChild(p);
  Promise.resolve().then(() => {
    emitter.once(transmitted);
    document.body.removeChild(div);
  });
});

test.serial.cb('Node.removeChild transfer, multiple sibling nodes', t => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');
  const p = document.createElement('p');
  const input = document.createElement('input');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [
        TransferrableMutationType.CHILD_LIST,
        document.body[TransferrableKeys.index],
        0,
        0,
        0,
        1,
        div[TransferrableKeys.index],
        TransferrableMutationType.CHILD_LIST,
        document.body[TransferrableKeys.index],
        0,
        0,
        0,
        1,
        input[TransferrableKeys.index],
      ],
      'mutation is as expected',
    );
    t.end();
  }

  document.body.appendChild(div);
  document.body.appendChild(p);
  document.body.appendChild(input);
  Promise.resolve().then(() => {
    emitter.once(transmitted);
    document.body.removeChild(div);
    document.body.removeChild(input);
  });
});

test.serial.cb('Node.removeChild transfer, tree > 1 depth', t => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');
  const p = document.createElement('p');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [TransferrableMutationType.CHILD_LIST, div[TransferrableKeys.index], 0, 0, 0, 1, p[TransferrableKeys.index]],
      'mutation is as expected',
    );
    t.end();
  }

  document.body.appendChild(div);
  div.appendChild(p);
  Promise.resolve().then(() => {
    emitter.once(transmitted);
    div.removeChild(p);
  });
});
