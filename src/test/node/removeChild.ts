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
  child: Element;
  childTwo: Element;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('div'),
    child: document.createElement('div'),
    childTwo: document.createElement('div'),
  };
});

test('remove only child Node from parent', t => {
  const { node, child } = t.context;

  node.appendChild(child);
  node.removeChild(child);
  t.is(node.childNodes.length, 0, 'removing the only child from childNode[] makes childNodes have no members');
  t.is(child.parentNode, null, 'removed node has no parentNode');
});

test('remove child Node from parent with multiple children', t => {
  const { node, child, childTwo } = t.context;

  node.appendChild(child);
  node.appendChild(childTwo);
  node.removeChild(childTwo);
  t.is(node.childNodes.length, 1, 'childNodes have the correct length');
  t.deepEqual(node.childNodes[0], child, 'does not remove other children');
});
