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
import { Element } from '../../worker-thread/dom/Element';
import { MutationRecord, MutationRecordType } from '../../worker-thread/MutationRecord';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { get } from '../../worker-thread/StringMapping';

test.beforeEach(t => {
  t.context = {
    el: document.createElement('div'),
    callback: () => undefined,
  };
});
test.afterEach(t => {
  document.body.childNodes.forEach(childNode => childNode.remove());
});

test.cb.serial('Element.removeEventListener mutation observed when node is connected.', t => {
  const { el, callback } = t.context as { el: Element; callback: () => undefined };
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.COMMAND,
          target: el,
          removedEvents: [
            {
              [TransferrableKeys.type]: get('mouseenter') as number,
              [TransferrableKeys._index_]: 3,
              [TransferrableKeys.index]: 0,
            },
          ],
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  document.body.appendChild(el);
  el.addEventListener('mouseenter', callback);
  observer.observe(document.body);
  el.removeEventListener('mouseenter', callback);
});

test.cb.serial('Element.removeEventListener mutation observed when node is not yet connected.', t => {
  const { el, callback } = t.context as { el: Element; callback: () => undefined };
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.COMMAND,
          target: el,
          removedEvents: [
            {
              [TransferrableKeys.type]: get('mouseenter') as number,
              [TransferrableKeys._index_]: 4,
              [TransferrableKeys.index]: 0,
            },
          ],
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  el.addEventListener('mouseenter', callback);
  observer.observe(document.body);
  el.removeEventListener('mouseenter', callback);
});
