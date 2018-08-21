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
import { HTMLLabelElement } from '../../worker-thread/dom/HTMLLabelElement';
import { documentForTesting as document } from '../../worker-thread/dom/Document';
import { HTMLElement } from '../../worker-thread/dom/HTMLElement';

test.beforeEach(t => {
  t.context = {
    label: document.createElement('label'),
    form: document.createElement('form'),
    input: document.createElement('input'),
    div: document.createElement('div'),
  };
});
test.afterEach(t => {
  document.body.childNodes.forEach(childNode => childNode.remove());
});

test('control should be null by default', t => {
  const { label } = t.context as { label: HTMLLabelElement };

  t.is(label.control, null);
});

test('control should be sibling element with matching id to "for" attribute', t => {
  const { label, div, input } = t.context as { label: HTMLLabelElement; div: HTMLElement; input: HTMLElement };

  div.appendChild(label);
  div.appendChild(input);
  input.id = 'identifier';
  label.htmlFor = 'identifier';
  document.body.appendChild(div);
  t.is(label.control, input);
});

test('control should be null when there is no matching element to the id in "for" attribute', t => {
  const { label } = t.context as { label: HTMLLabelElement };

  label.htmlFor = 'identifier';
  document.body.appendChild(label);
  t.is(label.control, null);
});

test('control should be element with matching id to "for" attribute', t => {
  const { label, form, div, input } = t.context as { label: HTMLLabelElement; form: HTMLElement; div: HTMLElement; input: HTMLElement };

  form.appendChild(label);
  form.appendChild(div);
  div.appendChild(input);
  input.id = 'identifier';
  label.htmlFor = 'identifier';
  document.body.appendChild(form);
  t.is(label.control, input);
});

test('control should be input element child when no "for" attribute is specified', t => {
  const { label, form, input } = t.context as { label: HTMLLabelElement; form: HTMLElement; div: HTMLElement; input: HTMLElement };

  form.appendChild(label);
  label.appendChild(input);
  document.body.appendChild(form);
  t.is(label.control, input);
});

test('control should be null when no "for" attribute is specified, and there are no child input elements', t => {
  const { label, form } = t.context as { label: HTMLLabelElement; form: HTMLElement; div: HTMLElement; input: HTMLElement };

  form.appendChild(label);
  document.body.appendChild(form);
  t.is(label.control, null);
});
