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
import { HTMLFormElement } from '../../worker-thread/dom/HTMLFormElement';
import { Element } from '../../worker-thread/dom/Element';

test.beforeEach(t => {
  t.context = {
    form: new HTMLFormElement(NodeType.ELEMENT_NODE, 'form', null),
    button: new Element(NodeType.ELEMENT_NODE, 'button', null),
    buttonTwo: new Element(NodeType.ELEMENT_NODE, 'button', null),
    fieldset: new Element(NodeType.ELEMENT_NODE, 'fieldset', null),
    input: new Element(NodeType.ELEMENT_NODE, 'input', null),
    output: new Element(NodeType.ELEMENT_NODE, 'output', null),
    select: new Element(NodeType.ELEMENT_NODE, 'select', null),
    textarea: new Element(NodeType.ELEMENT_NODE, 'textarea', null),
    div: new Element(NodeType.ELEMENT_NODE, 'div', null),
  };
});

test('length should be 0 by default', t => {
  const { form } = t.context as { form: HTMLFormElement };

  t.is(form.length, 0);
});

test('length should contain all valid elements', t => {
  const { form, button, fieldset, input, output, select, textarea } = t.context as {
    form: HTMLFormElement;
    button: Element;
    fieldset: Element;
    input: Element;
    output: Element;
    select: Element;
    textarea: Element;
  };

  form.appendChild(button);
  form.appendChild(fieldset);
  form.appendChild(input);
  form.appendChild(output);
  form.appendChild(select);
  form.appendChild(textarea);

  t.is(form.length, 6);
});

test('length should contain all valid elements, filtering invalid elements', t => {
  const { form, button, fieldset, input, output, select, textarea, div } = t.context as {
    form: HTMLFormElement;
    button: Element;
    fieldset: Element;
    input: Element;
    output: Element;
    select: Element;
    textarea: Element;
    div: Element;
  };

  form.appendChild(button);
  form.appendChild(fieldset);
  form.appendChild(input);
  form.appendChild(output);
  form.appendChild(select);
  div.appendChild(textarea);
  form.appendChild(div);

  t.is(form.length, 6);
});
