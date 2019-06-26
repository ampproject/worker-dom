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

test('className should be empty by default', t => {
  const { node } = t.context;

  t.is(node.className, '');
});

test('className should be settable to a single value', t => {
  const { node } = t.context;

  node.className = 'foo';
  t.is(node.className, 'foo');
});

test('className should be settable to multiple values', t => {
  const { node } = t.context;

  node.className = 'foo bar baz';
  t.is(node.className, 'foo bar baz');
});
