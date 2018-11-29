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
import { DocumentFragment } from '../../worker-thread/dom/DocumentFragment';
import { Element } from '../../worker-thread/dom/Element';
import { Node } from '../../worker-thread/dom/Node';
import { Text } from '../../worker-thread/dom/Text';

test.beforeEach(t => {
  const parentFragment = document.createDocumentFragment();
  const node = document.createElement('div');
  const sibling = document.createElement('div');
  const text = document.createTextNode('text');

  t.context = {
    parentFragment,
    node,
    sibling,
    text,
  };
});
test.afterEach(t => {
  (t.context.parentFragment.childNodes as Node[]).forEach(childNode => childNode.remove());
});

test('should return null when an Element does not have any childNodes.', t => {
  const { parentFragment } = t.context as { parentFragment: DocumentFragment };

  t.is(parentFragment.firstElementChild, null);
});

test('should return the only child when only one Element is appended', t => {
  const { parentFragment, node } = t.context as { parentFragment: DocumentFragment; node: Element };

  parentFragment.appendChild(node);
  t.deepEqual(parentFragment.firstElementChild, node);
});

test('should return the first child when more than one Element is appended', t => {
  const { parentFragment, node, sibling } = t.context as { parentFragment: DocumentFragment; node: Element; sibling: Element };

  parentFragment.appendChild(node);
  parentFragment.appendChild(sibling);
  t.deepEqual(parentFragment.firstElementChild, node);
});

test('should return the only Element in Node.childNodes, not another Node', t => {
  const { parentFragment, node, text } = t.context as { parentFragment: DocumentFragment; node: Element; text: Text };

  parentFragment.appendChild(node);
  parentFragment.appendChild(text);
  t.deepEqual(parentFragment.firstElementChild, node);
});

test('should return null when an Element only contains Node childNodes', t => {
  const { parentFragment, text } = t.context as { parentFragment: DocumentFragment; text: Text };

  parentFragment.appendChild(text);
  t.is(parentFragment.firstElementChild, null);
});
