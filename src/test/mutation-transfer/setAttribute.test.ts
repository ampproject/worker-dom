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
import { HTML_NAMESPACE } from '../../transfer/TransferrableNodes';
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

test.serial.cb('Element.setAttribute transfers new attribute', t => {
  const { document, emitter } = t.context;
  const el = document.createElement('div');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [
        TransferrableMutationType.ATTRIBUTES,
        el[TransferrableKeys.index],
        strings.indexOf('data-foo'),
        strings.indexOf(HTML_NAMESPACE),
        strings.indexOf('bar') + 1,
      ],
      'mutation is as expected',
    );
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    el.setAttribute('data-foo', 'bar');
  });
});

test.serial.cb('Element.setAttribute transfers attribute overwrite', t => {
  const { document, emitter } = t.context;
  const el = document.createElement('div');
  el.setAttribute('data-foo', 'bar');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [
        TransferrableMutationType.ATTRIBUTES,
        el[TransferrableKeys.index],
        strings.indexOf('data-foo'),
        strings.indexOf(HTML_NAMESPACE),
        strings.indexOf('baz') + 1,
      ],
      'mutation is as expected',
    );
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    el.setAttribute('data-foo', 'baz');
  });
});

test.serial.cb('Element.setAttribute transfers new attribute with namespace', t => {
  const { document, emitter } = t.context;
  const el = document.createElement('div');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [
        TransferrableMutationType.ATTRIBUTES,
        el[TransferrableKeys.index],
        strings.indexOf('data-foo'),
        strings.indexOf('namespace'),
        strings.indexOf('bar') + 1,
      ],
      'mutation is as expected',
    );
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    el.setAttributeNS('namespace', 'data-foo', 'bar');
  });
});

test.serial.cb('Element.setAttribute transfers attribute overwrite with namespace', t => {
  const { document, emitter } = t.context;
  const el = document.createElement('div');
  el.setAttributeNS('namespace', 'data-foo', 'bar');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [
        TransferrableMutationType.ATTRIBUTES,
        el[TransferrableKeys.index],
        strings.indexOf('data-foo'),
        strings.indexOf('namespace'),
        strings.indexOf('baz') + 1,
      ],
      'mutation is as expected',
    );
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    el.setAttributeNS('namespace', 'data-foo', 'baz');
  });
});
