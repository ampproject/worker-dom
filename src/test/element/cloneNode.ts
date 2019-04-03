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
import { createTestingDocument } from '../DocumentCreation';
import { Element } from '../../worker-thread/dom/Element';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { Text } from '../../worker-thread/dom/Text';

const test = anyTest as TestInterface<{
  parent: Element;
  child: Element;
  text: Text;
  sibling: Element;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    parent: document.createElement('div'),
    child: document.createElement('p'),
    text: document.createTextNode('text'),
    sibling: document.createElement('aside'),
  };

  t.context.child.appendChild(t.context.text);
  t.context.parent.appendChild(t.context.child);
  t.context.parent.appendChild(t.context.sibling);
  document.body.appendChild(t.context.parent);
});

test('cloneNode should create a new node with the same tagName', t => {
  const { parent } = t.context;

  t.is(parent.cloneNode().tagName, parent.tagName);
});

test('cloneNode should create a new node with a different index', t => {
  const { parent } = t.context;

  t.not(parent.cloneNode()[TransferrableKeys.index], parent[TransferrableKeys.index]);
});

test('cloneNode should create a new node with the same attribute', t => {
  const { parent } = t.context;
  parent.setAttribute('fancy', 'yes');

  t.is(parent.cloneNode().getAttribute('fancy'), 'yes');
});

test('cloneNode should create a new node with the same attributes', t => {
  const { parent } = t.context;
  parent.setAttribute('fancy', 'yes');
  parent.setAttribute('virtual', 'no');

  t.is(parent.cloneNode().getAttribute('fancy'), 'yes');
  t.is(parent.cloneNode().getAttribute('virtual'), 'no');
});

test('cloneNode should create a new node with the same attributes, but not preserve attributes across the instances', t => {
  const { parent } = t.context;
  parent.setAttribute('fancy', 'yes');
  const clone = parent.cloneNode();
  parent.setAttribute('fancy', 'no');

  t.is(clone.getAttribute('fancy'), 'yes');
  t.is(parent.getAttribute('fancy'), 'no');
});

test('cloneNode should create a new node without the same properties', t => {
  const { parent } = t.context;
  parent.value = 'property value';

  t.not(parent.cloneNode().value, 'property value');
});

test('cloneNode should create a new node without the same children when the deep flag is not set', t => {
  const { parent } = t.context;
  const clone = parent.cloneNode();

  t.is(clone.childNodes.length, 0);
});

test('cloneNode should create a new node with the same children when the deep flag is set', t => {
  const { parent } = t.context;
  const clone = parent.cloneNode(true);

  t.is(parent.childNodes.length, clone.childNodes.length);
  t.is(parent.childNodes[0].tagName, clone.childNodes[0].tagName);
  t.is(parent.childNodes[0].childNodes[0].textContent, clone.childNodes[0].childNodes[0].textContent);
});
