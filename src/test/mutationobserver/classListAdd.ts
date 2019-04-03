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
import { MutationRecord, MutationRecordType } from '../../worker-thread/MutationRecord';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  document: Document;
}>;

test.beforeEach(t => {
  t.context = {
    document: createTestingDocument(),
  };
});

test.serial.cb('Element.classList.add mutation observed, single value', t => {
  const { document } = t.context;
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'class',
          target: el,
          value: 'bar',
          oldValue: '',
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  document.body.appendChild(el);
  observer.observe(document.body);
  el.classList.add('bar');
});

test.serial.cb('Element.classList.add mutation observed, single value to existing values', t => {
  const { document } = t.context;
  const el = document.createElement('div');
  el.classList.value = 'foo';
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'class',
          target: el,
          value: 'foo bar',
          oldValue: 'foo',
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  document.body.appendChild(el);
  observer.observe(document.body);
  el.classList.add('bar');
});

test.serial.cb('Element.classList.add mutation observed, multiple values', t => {
  const { document } = t.context;
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'class',
          target: el,
          value: 'foo bar',
          oldValue: '',
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  document.body.appendChild(el);
  observer.observe(document.body);
  el.classList.add('foo', 'bar');
});

test.serial.cb('Element.classList.add mutation observed, multiple value to existing values', t => {
  const { document } = t.context;
  const el = document.createElement('div');
  el.classList.value = 'foo';
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'class',
          target: el,
          value: 'foo bar baz',
          oldValue: 'foo',
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  document.body.appendChild(el);
  observer.observe(document.body);
  el.classList.add('bar', 'baz');
});
