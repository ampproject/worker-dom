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
import { createDocument } from '../../worker-thread/dom/Document';

const test = anyTest as TestInterface<{
  node: Element;
  child: Element;
}>;

test.beforeEach(t => {
  const document = createDocument();

  t.context = {
    node: document.createElement('div'),
    child: document.createElement('div'),
  };
});

test('element with no children', t => {
  const { node } = t.context;

  t.is(node.outerHTML, '<div></div>');
  node.className = 'test';
  t.is(node.outerHTML, '<div class="test"></div>');
});

test('element with a child', t => {
  const { node, child } = t.context;

  node.appendChild(child);
  t.is(node.outerHTML, '<div><div></div></div>');
});
