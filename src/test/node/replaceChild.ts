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

test.beforeEach(t => {
  t.context = {
    node: new Element(NodeType.ELEMENT_NODE, 'div', null),
    child: new Element(NodeType.ELEMENT_NODE, 'div', null),
    childTwo: new Element(NodeType.ELEMENT_NODE, 'p', null),
    childThree: new Element(NodeType.ELEMENT_NODE, 'section', null),
  };
});

test('replacing the same child results in no changes', t => {
  const { node, child } = t.context as { node: Element; child: Element };

  node.appendChild(child);
  var previousNodes = node.childNodes;
  t.deepEqual(node.replaceChild(child, child), child, 'replaceChild returns node replaced even when NOOP');
  t.deepEqual(node.childNodes, previousNodes, 'child list remains the same after replacing one child with itself');
});

test('replacing a child with another when there is only a single child', t => {
  const { node, child, childTwo } = t.context as { node: Element; child: Element; childTwo: Element };

  node.appendChild(child);
  t.deepEqual(node.replaceChild(childTwo, child), child, 'replacing a child returns the removed child');
  t.deepEqual(node.childNodes[0], childTwo, 'the first child is now childTwo');
  t.is(node.childNodes.length, 1, 'the number of nodes remains at one');
});

test('replacing a child with another when there are multiple children', t => {
  const { node, child, childTwo, childThree } = t.context as { node: Element; child: Element; childTwo: Element; childThree: Element };

  node.appendChild(child);
  node.appendChild(childTwo);
  t.deepEqual(node.replaceChild(childThree, childTwo), childTwo, 'replacing a child returns the removed child');
  t.deepEqual(node.childNodes[1], childThree, 'the last child is now childThree');
  t.is(node.childNodes.length, 2, 'the number of nodes remains at two');
});
