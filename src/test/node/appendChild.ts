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
import { Element } from '../../worker-thread/dom/Element';
import { NodeType, HTML_NAMESPACE } from '../../transfer/TransferrableNodes';
import { DocumentFragment } from '../../worker-thread/dom/DocumentFragment';

test.beforeEach(t => {
  t.context = {
    node: new Element(NodeType.ELEMENT_NODE, 'div', HTML_NAMESPACE),
    child: new Element(NodeType.ELEMENT_NODE, 'div', HTML_NAMESPACE),
    childTwo: new Element(NodeType.ELEMENT_NODE, 'div', HTML_NAMESPACE),
  };
});

test('appending to an Node with no childNodes', t => {
  const { node, child } = t.context as { node: Element, child: Element };

  node.appendChild(child);
  t.deepEqual(node.childNodes[0], child, 'childNode[0] = new child');
  t.deepEqual(child.parentNode, node, 'child.parentNode = Node');
});

test('appending to a Node with populated childNodes', t => {
  const { node, child, childTwo } = t.context as {node: Element, child: Element, childTwo: Element};

  node.appendChild(child);
  node.appendChild(childTwo);
  t.deepEqual(node.childNodes[1], childTwo, 'childNode[length] = new child');
});

test('reappending a known child', t => {
  const { node, child, childTwo } = t.context as {node: Element, child: Element, childTwo: Element};

  node.appendChild(child);
  node.appendChild(childTwo);
  node.appendChild(child);
  t.deepEqual(node.childNodes[0], childTwo, 'reappending a known child removes the child from exising position');
  t.deepEqual(node.childNodes[1], child, 'reappending a known child makes childNode[length] = new child');
});

test('appending returns the appended child', t => {
  const { node, child } = t.context as { node: Element, child: Element};

  const returned = node.appendChild(child);
  t.is(child, returned);
});

test('appending a document fragment with a single child', t => {
  const { node, child } = t.context as {node: Element, child: Element};
  const fragment = new DocumentFragment();

  fragment.appendChild(child);
  node.appendChild(fragment);
  t.deepEqual(node.childNodes[0], child);
});

test('appending a document fragment with a multiple children', t => {
  const { node, child, childTwo } = t.context as {node: Element, child: Element, childTwo: Element};
  const fragment = new DocumentFragment();

  fragment.appendChild(child);
  fragment.appendChild(childTwo);
  node.appendChild(fragment);
  t.deepEqual(node.childNodes[0], child);
  t.deepEqual(node.childNodes[1], childTwo);
});