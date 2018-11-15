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

test.beforeEach(t => {
  t.context = {
    parent: document.createElement('div'),
    child: document.createElement('p'),
    text: document.createTextNode('text'),
    sibling: document.createElement('aside'),
  };

  t.context.child.appendChild(t.context.text);
  t.context.parent.appendChild(t.context.child);
  t.context.parent.appendChild(t.context.sibling);
  document.body.appendChild(t.context.parent);
});
test.afterEach(t => {
  document.body.childNodes.forEach(childNode => childNode.remove());
});

test('cloneNode should create a new node with the same tagName', t => {
  const { parent } = t.context as { parent: Element };

  t.is(parent.cloneNode().tagName, parent.tagName);
});

test('cloneNode should create a new node with a different _index_', t => {
  const { parent } = t.context as { parent: Element };

  t.not(parent.cloneNode()._index_, parent._index_);
});

test('cloneNode should create a new node with the same attribute', t => {
  const { parent } = t.context as { parent: Element };
  parent.setAttribute('fancy', 'yes');

  t.is(parent.cloneNode().getAttribute('fancy'), 'yes');
});

test('cloneNode should create a new node with the same attributes', t => {
  const { parent } = t.context as { parent: Element };
  parent.setAttribute('fancy', 'yes');
  parent.setAttribute('virtual', 'no');

  t.is(parent.cloneNode().getAttribute('fancy'), 'yes');
  t.is(parent.cloneNode().getAttribute('virtual'), 'no');
});

test('cloneNode should create a new node without the same properties', t => {
  const { parent } = t.context as { parent: Element };
  parent.value = 'property value';

  t.not(parent.cloneNode().value, 'property value');
});

test('cloneNode should create a new node without the same children when the deep flag is not set', t => {
  const { parent } = t.context as { parent: Element };
  const clone = parent.cloneNode();

  t.is(clone.childNodes.length, 0);
});

test('cloneNode should create a new node with the same children when the deep flag is set', t => {
  const { parent } = t.context as { parent: Element };
  const clone = parent.cloneNode(true);

  t.is(parent.childNodes.length, clone.childNodes.length);
  t.is(parent.childNodes[0].tagName, clone.childNodes[0].tagName);
  t.is(parent.childNodes[0].childNodes[0].textContent, clone.childNodes[0].childNodes[0].textContent);
});
