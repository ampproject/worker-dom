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
import { HTMLFieldSetElement } from '../../worker-thread/dom/HTMLFieldSetElement';
import { Element } from '../../worker-thread/dom/Element';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLFieldSetElement;
  button: Element;
  buttonTwo: Element;
  fieldset: HTMLFieldSetElement;
  input: Element;
  output: Element;
  select: Element;
  textarea: Element;
  div: Element;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('fieldset') as HTMLFieldSetElement,
    button: document.createElement('button'),
    buttonTwo: document.createElement('button'),
    fieldset: document.createElement('fieldset') as HTMLFieldSetElement,
    input: document.createElement('input'),
    output: document.createElement('output'),
    select: document.createElement('select'),
    textarea: document.createElement('textarea'),
    div: document.createElement('div'),
  };
});

test('elements should be empty by default', t => {
  const { element } = t.context;

  t.deepEqual(element.elements, []);
});

test('elements should contain a button element', t => {
  const { element, button } = t.context;

  element.appendChild(button);
  t.deepEqual(element.elements, [button]);
});

test('elements should contain two button elements', t => {
  const { element, button, buttonTwo } = t.context;

  element.appendChild(button);
  element.appendChild(buttonTwo);
  t.deepEqual(element.elements, [button, buttonTwo]);
});

test('elements should contain button element deeply nested, filtering invalid childNodes', t => {
  const { element, button, div } = t.context;

  div.appendChild(button);
  element.appendChild(div);
  // Quick note: .elements getter returns only a small subset of elements with specific tagNames.
  // See HTMLFormControlsMixin for the implementation.
  t.deepEqual(element.elements, [button]);
});

test('elements should contain all valid elements, filtering invalid childNodes', t => {
  const { element, button, fieldset, input, output, select, textarea, div } = t.context;

  element.appendChild(button);
  element.appendChild(fieldset);
  element.appendChild(input);
  element.appendChild(output);
  element.appendChild(select);
  element.appendChild(textarea);
  element.appendChild(div);

  t.deepEqual(element.elements, [button, fieldset, input, output, select, textarea]);
  t.is(element.elements.length, 6);
});
