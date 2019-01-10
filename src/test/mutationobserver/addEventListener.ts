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
import { createDocument, Document } from '../../worker-thread/dom/Document';
import { Element } from '../../worker-thread/dom/Element';
import { MutationRecord, MutationRecordType } from '../../worker-thread/MutationRecord';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { get } from '../../worker-thread/strings';

const test = anyTest as TestInterface<{
  document: Document;
  el: Element;
  callback: () => undefined;
}>;

test.beforeEach(t => {
  const document = createDocument();

  t.context = {
    document,
    el: document.createElement('div'),
    callback: () => undefined,
  };
});
test.afterEach(t => {
  t.context.document.body.childNodes.forEach(childNode => childNode.remove());
});

test.serial.cb('Element.addEventListener mutation observed when node is connected.', t => {
  const { document, el, callback } = t.context;
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.COMMAND,
          target: el,
          addedEvents: [
            {
              [TransferrableKeys.type]: get('mouseenter') as number,
              [TransferrableKeys.index]: 3,
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
  observer.observe(document.body);
  el.addEventListener('mouseenter', callback);
});

test.serial.cb('Element.addEventListener mutation observed when node is not yet connected.', t => {
  const { document, el, callback } = t.context;
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.COMMAND,
          target: el,
          addedEvents: [
            {
              [TransferrableKeys.type]: get('mouseenter') as number,
              [TransferrableKeys.index]: 4,
              [TransferrableKeys.index]: 0,
            },
          ],
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  observer.observe(document.body);
  el.addEventListener('mouseenter', callback);
});
