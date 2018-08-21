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
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLAnchorElement } from '../../worker-thread/dom/HTMLAnchorElement';

test.beforeEach(t => {
  t.context = {
    node: new HTMLAnchorElement(NodeType.ELEMENT_NODE, 'a', null),
  };
});

test('relList should be empty by default', t => {
  const { node } = t.context as { node: HTMLAnchorElement };

  t.is(node.relList.value, '');
  t.is(node.getAttribute('rel'), null);
});

test('relList.add of a single value should only add one class', t => {
  const { node } = t.context as { node: HTMLAnchorElement };

  node.relList.add('foo');
  t.is(node.relList.value, 'foo');
  t.is(node.rel, 'foo');
  t.is(node.getAttribute('rel'), 'foo');
});

test('relList.add of a multiple value should only add all classes', t => {
  const { node } = t.context as { node: HTMLAnchorElement };

  node.relList.add('foo', 'bar', 'baz');
  t.is(node.relList.value, 'foo bar baz');
  t.is(node.rel, 'foo bar baz');
  t.is(node.getAttribute('rel'), 'foo bar baz');
});

test('relList.remove of a single value should only remove one class', t => {
  const { node } = t.context as { node: HTMLAnchorElement };

  node.rel = 'foo bar';
  node.relList.remove('foo');
  t.is(node.relList.value, 'bar');
  t.is(node.rel, 'bar');
  t.is(node.getAttribute('rel'), 'bar');
});

test('relList.remove of a multiple values should remove all values', t => {
  const { node } = t.context as { node: HTMLAnchorElement };

  node.rel = 'foo bar baz';
  node.relList.remove('foo', 'bar');
  t.is(node.relList.value, 'baz');
  t.is(node.rel, 'baz');
  t.is(node.getAttribute('rel'), 'baz');
});

test('relList.toggle should add a value that is not present already', t => {
  const { node } = t.context as { node: HTMLAnchorElement };

  node.relList.toggle('foo');
  t.is(node.relList.value, 'foo');
  t.is(node.rel, 'foo');
  t.is(node.getAttribute('rel'), 'foo');
});

test('relList.toggle should remove a value that is present already', t => {
  const { node } = t.context as { node: HTMLAnchorElement };

  node.rel = 'foo';
  node.relList.toggle('foo');
  t.is(node.relList.value, '');
  t.is(node.rel, '');
  t.is(node.getAttribute('rel'), '');
});
