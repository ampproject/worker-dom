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
import { Text } from '../../worker-thread/dom/Text';
import { Element } from '../../worker-thread/dom/Element';
import { NodeType } from '../../worker-thread/dom/Node';

test.beforeEach(t => {
  t.context = {
    text: new Text('default value'),
    element: new Element(NodeType.ELEMENT_NODE, 'div', null),
    paragraph: new Element(NodeType.ELEMENT_NODE, 'p', null),
  };
});

test('unmounted text splitting', t => {
  const { text } = t.context as { text: Text };

  const offsetNode: Text = text.splitText(3);
  t.is(text.textContent, 'def');
  t.is(offsetNode.textContent, 'ault value');
  t.is(text.parentNode, null);
  t.is(offsetNode.previousSibling, null);
});

test('tree mounted text splitting', t => {
  const { text, element } = t.context as { text: Text; element: Element };

  element.appendChild(text);

  const offsetNode: Text = text.splitText(3);
  t.is(text.textContent, 'def');
  t.is(offsetNode.textContent, 'ault value');
  t.is(text.parentNode, element);
  t.is(offsetNode.previousSibling, text);
});

test('tree with siblings mounted text splitting', t => {
  const { text, element, paragraph } = t.context as { text: Text; element: Element; paragraph: Element };

  element.appendChild(text);
  element.appendChild(paragraph);

  const offsetNode: Text = text.splitText(3);
  t.is(text.textContent, 'def');
  t.is(offsetNode.textContent, 'ault value');
  t.is(text.parentNode, element);
  t.is(offsetNode.previousSibling, text);
  t.is(paragraph.previousSibling, offsetNode);
});
