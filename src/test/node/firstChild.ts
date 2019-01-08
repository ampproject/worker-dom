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
import { NodeType, HTML_NAMESPACE } from '../../transfer/TransferrableNodes';

const test = anyTest as TestInterface<{
  node: Element;
  child: Element;
  childTwo: Element;
}>;

test.beforeEach(t => {
  t.context = {
    node: new Element(NodeType.ELEMENT_NODE, 'div', HTML_NAMESPACE),
    child: new Element(NodeType.ELEMENT_NODE, 'div', HTML_NAMESPACE),
    childTwo: new Element(NodeType.ELEMENT_NODE, 'div', HTML_NAMESPACE),
  };
});

test('return only child', t => {
  const { node, child } = t.context;

  node.appendChild(child);
  t.deepEqual(node.firstChild, child);
});

test('return first child when more than one child is available', t => {
  const { node, child, childTwo } = t.context;

  node.appendChild(child);
  node.appendChild(childTwo);
  t.deepEqual(node.firstChild, child);
});
