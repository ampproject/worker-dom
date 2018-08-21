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

import test from 'ava';
import { documentForTesting as document } from '../../worker-thread/dom/Document';
import { MutationRecord, MutationRecordType } from '../../worker-thread/MutationRecord';

test.cb.serial('Element.removeAttribute mutation observed', t => {
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'data-foo',
          attributeNamespace: null,
          target: el,
          oldValue: 'bar',
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  el.setAttribute('data-foo', 'bar');
  document.body.appendChild(el);
  observer.observe(document.body);
  el.removeAttribute('data-foo');
});

test.cb.serial('Element.removeAttribute mutation observed, with namespace', t => {
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'data-foo',
          attributeNamespace: 'namespace',
          target: el,
          oldValue: 'bar',
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  el.setAttributeNS('namespace', 'data-foo', 'bar');
  document.body.appendChild(el);
  observer.observe(document.body);
  el.removeAttributeNS('namespace', 'data-foo');
});
