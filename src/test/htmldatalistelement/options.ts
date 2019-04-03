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
import { HTMLDataListElement } from '../../worker-thread/dom/HTMLDataListElement';
import { Text } from '../../worker-thread/dom/Text';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  node: HTMLDataListElement;
  option: Element;
  optionTwo: Element;
  text: Text;
  invalidElement: Element;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('datalist') as HTMLDataListElement,
    option: document.createElement('option'),
    optionTwo: document.createElement('option'),
    text: document.createTextNode(''),
    invalidElement: document.createElement('div'),
  };
});

test('options should be an empty array when there are no childNodes', t => {
  const { node } = t.context;

  t.is(node.options.length, 0);
  t.deepEqual(node.options, []);
});

test('options should contain all childNodes when all have the correct node name', t => {
  const { node, option, optionTwo } = t.context;

  node.appendChild(option);
  t.is(node.options.length, 1);
  node.appendChild(optionTwo);
  t.is(node.options.length, 2);
  t.deepEqual(node.options, [option, optionTwo]);
});

test('options should contain only childNodes of the correct node name', t => {
  const { node, option, optionTwo, text, invalidElement } = t.context;

  t.is(node.options.length, 0);
  node.appendChild(option);
  t.is(node.options.length, 1);
  node.appendChild(optionTwo);
  t.is(node.options.length, 2);
  node.appendChild(text);
  node.appendChild(invalidElement);
  t.is(node.options.length, 2);
  t.deepEqual(node.options, [option, optionTwo]);
});

test('options should be an empty array when there are no childNodes of correct node names', t => {
  const { node, invalidElement } = t.context;

  node.appendChild(invalidElement);
  t.is(node.options.length, 0);
  t.deepEqual(node.options, []);
});
