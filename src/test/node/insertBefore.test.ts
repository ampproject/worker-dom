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
import { Node } from '../../worker-thread/dom/Node';
import { Element } from '../../worker-thread/dom/Element';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  node: Element;
  child: Element;
  childTwo: Element;
  childThree: Element;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('div'),
    child: document.createElement('div'),
    childTwo: document.createElement('div'),
    childThree: document.createElement('div'),
  };
});

test('will not insert child when ref is not a direct child of Node', t => {
  const { node, child, childTwo } = t.context;
  t.is(node.insertBefore(child, childTwo), null);
});

test('will append child when ref is null or undefined', t => {
  const { node, child, childTwo } = t.context;
  t.is(node.insertBefore(child, undefined), child, 'inserting child before undefined ref returns the appended child');
  t.deepEqual(node.childNodes[0], child, 'child is appended when ref is undefined in insertBefore');
  t.is(node.insertBefore(childTwo, null), childTwo, 'inserting child before null ref returns the appended child');
  t.deepEqual(node.childNodes[1], childTwo, 'child is appended when ref is null in insertBefore');
});

test('will NOOP when requested to insert a child before the same child', t => {
  const { node, child } = t.context;
  const inserted: Node = node.insertBefore(child, null) as Node;
  t.is(node.childNodes.indexOf(child), 0);
  t.deepEqual(node.insertBefore(inserted, child), child, 'returns the child that passed as both arguments');
  t.is(node.childNodes.indexOf(child), 0, 'position of child inserted remains when Node.insertBefore');
});

test('will insert a child before ref', t => {
  const { node, child, childTwo } = t.context;
  node.insertBefore(child, null);
  t.deepEqual(node.insertBefore(childTwo, child), childTwo, 'will return childTwo inserted before child');
  t.is(node.childNodes.indexOf(childTwo), 0, 'childTwo was inserted before ref (child)');
});

test('will insert a child in the middle of Node.childNodes, when ref is later within Node.childNodes', t => {
  const { node, child, childTwo, childThree } = t.context;
  node.insertBefore(child, null);
  node.insertBefore(childTwo, null);
  t.deepEqual(node.insertBefore(childThree, childTwo), childThree);
  t.is(node.childNodes.indexOf(childThree), node.childNodes.indexOf(childTwo) - 1, 'childThree was inserted before childTwo');
});
