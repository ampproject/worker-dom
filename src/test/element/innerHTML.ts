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
import { Text } from '../../worker-thread/dom/Text';
import { Comment } from '../../worker-thread/dom/Comment';
import { NodeType, HTML_NAMESPACE } from '../../transfer/TransferrableNodes';

const test = anyTest as TestInterface<{
  node: Element;
  child: Element;
  text: Text;
  comment: Comment;
}>;

test.beforeEach(t => {
  t.context = {
    node: new Element(NodeType.ELEMENT_NODE, 'div', HTML_NAMESPACE),
    child: new Element(NodeType.ELEMENT_NODE, 'div', HTML_NAMESPACE),
    text: new Text('text'),
    comment: new Comment('comment'),
  };
});

test('element with no children', t => {
  const { node } = t.context;

  t.is(node.innerHTML, '');
  node.className = 'test';
  t.is(node.innerHTML, '');
});

test('element with a child', t => {
  const { node, child } = t.context;

  node.appendChild(child);
  t.is(node.innerHTML, '<div></div>');
});

test('element with text', t => {
  const { node, text } = t.context;

  node.appendChild(text);
  t.is(node.innerHTML, 'text');
});

test('element with comment', t => {
  const { node, comment } = t.context;

  node.appendChild(comment);
  t.is(node.innerHTML, '<!--comment-->');
});
