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
import { Element } from '../../worker-thread/dom/Element';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  node: Element;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('div'),
  };
});

test('hasAttribute is false by default', t => {
  const { node } = t.context;

  t.is(node.hasAttribute('class'), false);
});

test('hasAttribute is true, when attribute is added', t => {
  const { node } = t.context;

  node.setAttribute('data-foo', 'bar');
  t.is(node.hasAttribute('data-foo'), true);
});

test('hasAttribute is true, when empty className is added', t => {
  const { node } = t.context;

  node.className = '';
  t.is(node.hasAttribute('class'), true);
});

test('hasAttribute is true, when valid className is added', t => {
  const { node } = t.context;

  node.className = 'foo';
  t.is(node.hasAttribute('class'), true);
});

test('hasAttribute is true, when DOMTokenList is set to empty string', t => {
  const { node } = t.context;

  node.classList.value = '';
  t.is(node.hasAttribute('class'), true);
});

test('hasAttribute is true when last value is removed from DOMTokenList driven attribute', t => {
  const { node } = t.context;

  node.classList.value = 'foo';
  node.classList.toggle('foo');
  t.is(node.hasAttribute('class'), true);
});
