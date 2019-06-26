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
import { HTMLAnchorElement } from '../../worker-thread/dom/HTMLAnchorElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLAnchorElement;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('a') as HTMLAnchorElement,
  };
});

test('relList should be empty by default', t => {
  const { element } = t.context;

  t.is(element.relList.value, '');
  t.is(element.getAttribute('rel'), null);
});

test('relList.add of a single value should only add one class', t => {
  const { element } = t.context;

  element.relList.add('foo');
  t.is(element.relList.value, 'foo');
  t.is(element.rel, 'foo');
  t.is(element.getAttribute('rel'), 'foo');
});

test('relList.add of a multiple value should only add all classes', t => {
  const { element } = t.context;

  element.relList.add('foo', 'bar', 'baz');
  t.is(element.relList.value, 'foo bar baz');
  t.is(element.rel, 'foo bar baz');
  t.is(element.getAttribute('rel'), 'foo bar baz');
});

test('relList.remove of a single value should only remove one class', t => {
  const { element } = t.context;

  element.rel = 'foo bar';
  element.relList.remove('foo');
  t.is(element.relList.value, 'bar');
  t.is(element.rel, 'bar');
  t.is(element.getAttribute('rel'), 'bar');
});

test('relList.remove of a multiple values should remove all values', t => {
  const { element } = t.context;

  element.rel = 'foo bar baz';
  element.relList.remove('foo', 'bar');
  t.is(element.relList.value, 'baz');
  t.is(element.rel, 'baz');
  t.is(element.getAttribute('rel'), 'baz');
});

test('relList.toggle should add a value that is not present already', t => {
  const { element } = t.context;

  element.relList.toggle('foo');
  t.is(element.relList.value, 'foo');
  t.is(element.rel, 'foo');
  t.is(element.getAttribute('rel'), 'foo');
});

test('relList.toggle should remove a value that is present already', t => {
  const { element } = t.context;

  element.rel = 'foo';
  element.relList.toggle('foo');
  t.is(element.relList.value, '');
  t.is(element.rel, '');
  t.is(element.getAttribute('rel'), '');
});
