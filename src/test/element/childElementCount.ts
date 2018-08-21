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
import { Node, NodeType } from '../../worker-thread/dom/Node';
import { Element } from '../../worker-thread/dom/Element';
import { Text } from '../../worker-thread/dom/Text';

test.beforeEach(t => {
  t.context = {
    node: new Element(NodeType.ELEMENT_NODE, 'div', null),
    child: new Element(NodeType.ELEMENT_NODE, 'div', null),
    childTwo: new Text(''),
  };
});

test('should return 0 when no elements are appended', t => {
  const { node } = t.context as { node: Element };

  t.is(node.childElementCount, 0);
});

test('should return 1 when only one Element is appended', t => {
  const { node, child } = t.context as { node: Element; child: Element };

  node.appendChild(child);
  t.is(node.childElementCount, 1);
});

test('should return only the number of Elements, not childNodes', t => {
  const { node, child, childTwo } = t.context as { node: Element; child: Element; childTwo: Node };

  node.appendChild(child);
  node.appendChild(childTwo);
  t.is(node.childElementCount, 1);
});

test('should return 0 when an Element only contains Nodes of other types', t => {
  const { node, childTwo } = t.context as { node: Element; childTwo: Node };

  node.appendChild(childTwo);
  t.is(node.childElementCount, 0);
});
