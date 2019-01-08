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
import { HTMLFormElement } from '../../worker-thread/dom/HTMLFormElement';
import { Element } from '../../worker-thread/dom/Element';
import { NodeType, HTML_NAMESPACE } from '../../transfer/TransferrableNodes';

const test = anyTest as TestInterface<{
  form: HTMLFormElement;
  button: Element;
  buttonTwo: Element;
  fieldset: Element;
  input: Element;
  output: Element;
  select: Element;
  textarea: Element;
  div: Element;
}>;

test.beforeEach(t => {
  t.context = {
    form: new HTMLFormElement(NodeType.ELEMENT_NODE, 'form', HTML_NAMESPACE),
    button: new Element(NodeType.ELEMENT_NODE, 'button', HTML_NAMESPACE),
    buttonTwo: new Element(NodeType.ELEMENT_NODE, 'button', HTML_NAMESPACE),
    fieldset: new Element(NodeType.ELEMENT_NODE, 'fieldset', HTML_NAMESPACE),
    input: new Element(NodeType.ELEMENT_NODE, 'input', HTML_NAMESPACE),
    output: new Element(NodeType.ELEMENT_NODE, 'output', HTML_NAMESPACE),
    select: new Element(NodeType.ELEMENT_NODE, 'select', HTML_NAMESPACE),
    textarea: new Element(NodeType.ELEMENT_NODE, 'textarea', HTML_NAMESPACE),
    div: new Element(NodeType.ELEMENT_NODE, 'div', HTML_NAMESPACE),
  };
});

test('length should be 0 by default', t => {
  const { form } = t.context;

  t.is(form.length, 0);
});

test('length should contain all valid elements', t => {
  const { form, button, fieldset, input, output, select, textarea } = t.context;

  form.appendChild(button);
  form.appendChild(fieldset);
  form.appendChild(input);
  form.appendChild(output);
  form.appendChild(select);
  form.appendChild(textarea);

  t.is(form.length, 6);
});

test('length should contain all valid elements, filtering invalid elements', t => {
  const { form, button, fieldset, input, output, select, textarea, div } = t.context;

  form.appendChild(button);
  form.appendChild(fieldset);
  form.appendChild(input);
  form.appendChild(output);
  form.appendChild(select);
  div.appendChild(textarea);
  form.appendChild(div);

  t.is(form.length, 6);
});
