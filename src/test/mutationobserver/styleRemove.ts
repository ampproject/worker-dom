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
import { appendKeys } from '../../worker-thread/css/CSSStyleDeclaration';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  document: Document;
}>;

test.beforeEach(t => {
  t.context = {
    document: createTestingDocument(),
  };
});

test.serial.cb('Element.style.width mutation observed, single value', t => {
  const { document } = t.context;
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'style',

          target: el,
          value: '',
          oldValue: 'width: 10px;',
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  document.body.appendChild(el);
  appendKeys(['width']);
  el.style.width = '10px';
  observer.observe(document.body);
  el.style.width = '';
});

test.serial.cb('Element.style.width mutation observed, single value, via setProperty', t => {
  const { document } = t.context;
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'style',

          target: el,
          value: '',
          oldValue: 'width: 10px;',
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  document.body.appendChild(el);
  appendKeys(['width']);
  el.style.setProperty('width', '10px');
  observer.observe(document.body);
  el.style.setProperty('width', '');
});

test.serial.cb('Element.style.width mutation observed, single value, via removeProperty', t => {
  const { document } = t.context;
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'style',

          target: el,
          value: '',
          oldValue: 'width: 10px;',
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  document.body.appendChild(el);
  appendKeys(['width']);
  el.style.setProperty('width', '10px');
  observer.observe(document.body);
  el.style.removeProperty('width');
});

test.cb('Element.style.width mutation observed, single value, via cssText', t => {
  const { document } = t.context;
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'style',

          target: el,
          value: '',
          oldValue: 'width: 10px;',
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  document.body.appendChild(el);
  appendKeys(['width']);
  el.style.cssText = 'width: 10px';
  observer.observe(document.body);
  el.style.cssText = '';
});
