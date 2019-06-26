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
import { Text } from '../../worker-thread/dom/Text';
import { Element } from '../../worker-thread/dom/Element';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  text: Text;
  element: Element;
  paragraph: Element;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    text: document.createTextNode('default value'),
    element: document.createElement('div'),
    paragraph: document.createElement('p'),
  };
});

test('unmounted text splitting', t => {
  const { text } = t.context;

  const offsetNode: Text = text.splitText(3);
  t.is(text.textContent, 'def');
  t.is(offsetNode.textContent, 'ault value');
  t.is(text.parentNode, null);
  t.is(offsetNode.previousSibling, null);
});

test('tree mounted text splitting', t => {
  const { text, element } = t.context;

  element.appendChild(text);

  const offsetNode: Text = text.splitText(3);
  t.is(text.textContent, 'def');
  t.is(offsetNode.textContent, 'ault value');
  t.is(text.parentNode, element);
  t.is(offsetNode.previousSibling, text);
});

test('tree with siblings mounted text splitting', t => {
  const { text, element, paragraph } = t.context;

  element.appendChild(text);
  element.appendChild(paragraph);

  const offsetNode: Text = text.splitText(3);
  t.is(text.textContent, 'def');
  t.is(offsetNode.textContent, 'ault value');
  t.is(text.parentNode, element);
  t.is(offsetNode.previousSibling, text);
  t.is(paragraph.previousSibling, offsetNode);
});
