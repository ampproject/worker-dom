/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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
import { Document } from '../../worker-thread/dom/Document';
import { HTMLSelectElement } from '../../worker-thread/dom/HTMLSelectElement';
import { HTMLOptionElement } from '../../worker-thread/dom/HTMLOptionElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  document: Document;
  select: HTMLSelectElement;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();
  const select = document.createElement('select') as HTMLSelectElement;

  t.context = {
    document,
    select,
  };
});

test('options returns empty array by default', t => {
  const { select } = t.context;

  t.deepEqual(select.options, []);
});

test('options returns singular array for single option child', t => {
  const { document, select } = t.context;
  const option = document.createElement('option') as HTMLOptionElement;

  select.appendChild(option);

  t.deepEqual(select.options, [option]);
});

test('options returns array for multiple option child', t => {
  const { document, select } = t.context;
  const option = document.createElement('option') as HTMLOptionElement;
  const optionTwo = document.createElement('option') as HTMLOptionElement;

  select.appendChild(option);
  select.appendChild(optionTwo);

  t.deepEqual(select.options, [option, optionTwo]);
});

test('options returns ordered array for multiple option child', t => {
  const { document, select } = t.context;
  const option = document.createElement('option') as HTMLOptionElement;
  const optionTwo = document.createElement('option') as HTMLOptionElement;

  select.appendChild(option);
  select.appendChild(optionTwo);
  select.removeChild(option);
  select.appendChild(option);

  t.deepEqual(select.options, [optionTwo, option]);
});
