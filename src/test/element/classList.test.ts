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

test('classList should be empty by default', t => {
  const { node } = t.context;

  t.is(node.classList.value, '');
  t.is(node.getAttribute('class'), null);
});

test('setAttribute should modify classList property', t => {
  const { node } = t.context;

  node.setAttribute('class', 'foo bar');
  t.is(node.getAttribute('class'), 'foo bar');
  t.is(node.className, 'foo bar');
});

test('classList.add of a single value should only add one class', t => {
  const { node } = t.context;

  node.classList.add('foo');
  t.is(node.classList.value, 'foo');
  t.is(node.className, 'foo');
  t.is(node.getAttribute('class'), 'foo');
});

test('classList.add of a multiple value should only add all classes', t => {
  const { node } = t.context;

  node.classList.add('foo', 'bar', 'baz');
  t.is(node.classList.value, 'foo bar baz');
  t.is(node.className, 'foo bar baz');
  t.is(node.getAttribute('class'), 'foo bar baz');
});

test('classList.remove of a single value should only remove one class', t => {
  const { node } = t.context;

  node.className = 'foo bar';
  node.classList.remove('foo');
  t.is(node.classList.value, 'bar');
  t.is(node.className, 'bar');
  t.is(node.getAttribute('class'), 'bar');
});

test('classList.remove of a multiple values should remove all values', t => {
  const { node } = t.context;

  node.className = 'foo bar baz';
  node.classList.remove('foo', 'bar');
  t.is(node.classList.value, 'baz');
  t.is(node.className, 'baz');
  t.is(node.getAttribute('class'), 'baz');
});

test('classList.toggle should add a value that is not present already', t => {
  const { node } = t.context;

  node.classList.toggle('foo');
  t.is(node.classList.value, 'foo');
  t.is(node.className, 'foo');
  t.is(node.getAttribute('class'), 'foo');
});

test('classList.toggle should remove a value that is present already', t => {
  const { node } = t.context;

  node.className = 'foo';
  node.classList.toggle('foo');
  t.is(node.classList.value, '');
  t.is(node.className, '');
  t.is(node.getAttribute('class'), '');
});
