/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
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
  child: Element;
  childTwo: Element;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('div'),
    child: document.createElement('div'),
    childTwo: document.createElement('p'),
  };
});

test('single direct child with matching name', (t) => {
  const { node, child } = t.context;

  child.setAttribute('name', 'foo');
  node.appendChild(child);

  t.is(node.getElementsByName('foo').length, 1);
  t.is(node.getElementsByName('bar').length, 0);
  t.deepEqual(node.getElementsByName('foo'), [child]);
});

test('multiple direct children with matching name', (t) => {
  const { node, child, childTwo } = t.context;

  child.setAttribute('name', 'foo');
  childTwo.setAttribute('name', 'foo');
  node.appendChild(child);
  node.appendChild(childTwo);

  t.is(node.getElementsByName('foo').length, 2);
  t.is(node.getElementsByName('bar').length, 0);
  t.deepEqual(node.getElementsByName('foo'), [child, childTwo]);
});

test('tree with depth > 1, multiple matches', (t) => {
  const { node, child, childTwo } = t.context;

  child.setAttribute('name', 'foo');
  childTwo.setAttribute('name', 'foo');
  child.appendChild(childTwo);
  node.appendChild(child);

  t.is(node.getElementsByName('foo').length, 2);
  t.is(node.getElementsByName('bar').length, 0);
  t.deepEqual(node.getElementsByName('foo'), [child, childTwo]);
});

test('tree with depth > 1, singular match', (t) => {
  const { node, child, childTwo } = t.context;

  childTwo.setAttribute('name', 'foo');
  child.appendChild(childTwo);
  node.appendChild(child);

  t.is(node.getElementsByName('foo').length, 1);
  t.is(node.getElementsByName('bar').length, 0);
  t.deepEqual(node.getElementsByName('foo'), [childTwo]);
});
