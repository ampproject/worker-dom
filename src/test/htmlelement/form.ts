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
import { HTMLElement } from '../../worker-thread/dom/HTMLElement';
import { Element } from '../../worker-thread/dom/Element';
import { NodeType, HTML_NAMESPACE } from '../../transfer/TransferrableNodes';

const test = anyTest as TestInterface<{
  element: HTMLElement;
  form: Element;
  intermediary: Element;
}>;

test.beforeEach(t => {
  t.context = {
    element: new HTMLElement(NodeType.ELEMENT_NODE, 'label', HTML_NAMESPACE),
    form: new Element(NodeType.ELEMENT_NODE, 'form', HTML_NAMESPACE),
    intermediary: new Element(NodeType.ELEMENT_NODE, 'div', HTML_NAMESPACE),
  };
});

test('form should be null by default', t => {
  const { element } = t.context;

  t.is(element.form, null);
});

test('form should return direct parent when a child of a form', t => {
  const { element, form } = t.context;

  form.appendChild(element);
  t.is(element.form, form);
});

test('form should return only form parent when deeply nested', t => {
  const { element, form, intermediary } = t.context;

  form.appendChild(intermediary);
  intermediary.appendChild(element);
  t.is(element.form, form);
});

test('form should return closest form to the fieldset element', t => {
  const { element, form, intermediary } = t.context;
  const secondForm = new Element(NodeType.ELEMENT_NODE, 'form', HTML_NAMESPACE);

  secondForm.appendChild(form);
  form.appendChild(intermediary);
  intermediary.appendChild(element);
  t.is(element.form, form);
});

test('form should return null when there is no parent form element', t => {
  const { element, intermediary } = t.context;

  intermediary.appendChild(element);
  t.is(element.form, null);
});
