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
import { Text } from '../../worker-thread/dom/Text';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';

const test = anyTest as TestInterface<{
  parent: Element;
  text: Text;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    parent: document.createElement('div'),
    text: document.createTextNode('dogs are the best'),
  };

  t.context.parent.appendChild(t.context.text);
  document.body.appendChild(t.context.parent);
});

test('cloneNode should create a new node with the same tagName', t => {
  const { text } = t.context;

  t.is(text.cloneNode().tagName, text.tagName);
});

test('cloneNode should create a new node with a different index', t => {
  const { text } = t.context;

  t.not(text.cloneNode()[TransferrableKeys.index], text[TransferrableKeys.index]);
});

test('cloneNode should create a new node with the same children when the deep flag is set', t => {
  const { parent, text } = t.context;
  const clone = parent.cloneNode(true);

  t.is(parent.childNodes.length, clone.childNodes.length);
  t.is(text.tagName, clone.childNodes[0].tagName);
  t.is(text.textContent, clone.childNodes[0].textContent);
});
