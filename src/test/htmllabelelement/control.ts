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
import { HTMLLabelElement } from '../../worker-thread/dom/HTMLLabelElement';
import { Document } from '../../worker-thread/dom/Document';
import { Element } from '../../worker-thread/dom/Element';
import { createTestingDocument } from '../DocumentCreation';

// NOTE FOR KRIS
// --
// The issue is the `globalDocument` in `Node` is set once and cannot be reassigned when a new document is created.
// for testing purposes, this needs to be altered.

const test = anyTest as TestInterface<{
  document: Document;
  label: HTMLLabelElement;
  form: Element;
  input: Element;
  div: Element;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    document,
    label: document.createElement('label') as HTMLLabelElement,
    form: document.createElement('form'),
    input: document.createElement('input'),
    div: document.createElement('div'),
  };
});

test.serial('control should be null by default', t => {
  const { label } = t.context;

  t.is(label.control, null);
});

test.serial('control should be sibling element with matching id to "for" attribute', t => {
  const { document, label, div, input } = t.context;

  div.appendChild(label);
  div.appendChild(input);
  input.id = 'identifier';
  label.htmlFor = 'identifier';
  document.body.appendChild(div);

  t.is(label.control, input);
});

test('control should be null when there is no matching element to the id in "for" attribute', t => {
  const { document, label } = t.context;

  label.htmlFor = 'identifier';
  document.body.appendChild(label);
  t.is(document.body.childElementCount, 1);
  t.is(label.control, null);
});

test('control should be element with matching id to "for" attribute', t => {
  const { document, label, form, div, input } = t.context;

  form.appendChild(label);
  form.appendChild(div);
  div.appendChild(input);
  input.id = 'identifier';
  label.htmlFor = 'identifier';
  document.body.appendChild(form);
  t.is(label.control, input);
});

test('control should be input element child when no "for" attribute is specified', t => {
  const { document, label, form, input } = t.context;

  form.appendChild(label);
  label.appendChild(input);
  document.body.appendChild(form);
  t.is(label.control, input);
});

test('control should be null when no "for" attribute is specified, and there are no child input elements', t => {
  const { document, label, form } = t.context;

  form.appendChild(label);
  document.body.appendChild(form);
  t.is(label.control, null);
});
