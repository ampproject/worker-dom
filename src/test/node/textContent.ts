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
import { Text } from '../../worker-thread/dom/Text';
import { Element } from '../../worker-thread/dom/Element';
import { NodeType, HTML_NAMESPACE } from '../../transfer/TransferrableNodes';

const test = anyTest as TestInterface<{
  node: Element;
  child: Element;
  nodeText: Text;
  childText: Text;
}>;

test.beforeEach(t => {
  t.context = {
    node: new Element(NodeType.ELEMENT_NODE, 'div', HTML_NAMESPACE),
    child: new Element(NodeType.ELEMENT_NODE, 'p', HTML_NAMESPACE),
    nodeText: new Text('text in node'),
    childText: new Text(' text in child'),
  };
});

test('textContent getter returns empty string when there are no text childNodes.', t => {
  const { node } = t.context;

  t.is(node.textContent, '');
});

test('textContent getter returns the value of direct childNodes when there are no children', t => {
  const { node, nodeText } = t.context;

  node.appendChild(nodeText);
  t.is(node.textContent, nodeText.textContent);
  t.is(node.textContent, 'text in node');
});

test('textContent getter returns the value of all depths childNodes even when there are children with no textContent', t => {
  const { node, child, nodeText } = t.context;

  node.appendChild(nodeText);
  node.appendChild(child);
  t.is(node.textContent, nodeText.textContent);
  t.is(node.textContent, 'text in node');
});

test('textContent returns the value of all depths childNodes when there are children', t => {
  const { node, child, nodeText, childText } = t.context;

  child.appendChild(childText);
  node.appendChild(nodeText);
  node.appendChild(child);
  t.is(node.textContent, nodeText.textContent + childText.textContent);
  t.is(node.textContent, 'text in node text in child');
});
