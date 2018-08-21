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
import { Element } from '../../worker-thread/dom/Element';
import { Text } from '../../worker-thread/dom/Text';

test.beforeEach(t => {
  t.context = {
    node: new Element(NodeType.ELEMENT_NODE, 'div', null),
    child: new Element(NodeType.ELEMENT_NODE, 'div', null),
    childTwo: new Text(''),
  };
});

test('should return null when an Element does not have any childNodes.', t => {
  const { node } = t.context as { node: Element };

  t.is(node.firstElementChild, null);
});

test('should return the only child when only one Element is appended', t => {
  const { node, child } = t.context as { node: Element; child: Element };

  node.appendChild(child);
  t.deepEqual(node.firstElementChild, child);
});

test('should return the only Element in Node.childNodes, not another Node', t => {
  const { node, child, childTwo } = t.context as { node: Element; child: Element; childTwo: Text };

  node.appendChild(childTwo);
  node.appendChild(child);
  t.deepEqual(node.firstElementChild, child);
});

test('should return null when an Element only contains Node childNodes', t => {
  const { node, childTwo } = t.context as { node: Element; childTwo: Text };

  node.appendChild(childTwo);
  t.is(node.firstElementChild, null);
});
