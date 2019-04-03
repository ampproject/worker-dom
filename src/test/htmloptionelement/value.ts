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
import { HTMLOptionElement } from '../../worker-thread/dom/HTMLOptionElement';
import { Document } from '../../worker-thread/dom/Document';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  document: Document;
  option: HTMLOptionElement;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();
  const option = document.createElement('option') as HTMLOptionElement;

  t.context = {
    document,
    option,
  };
});

test('value should be an empty string by default', t => {
  const { option } = t.context;

  t.is(option.value, '');
});

test('value should be settable with string coercion', t => {
  const { option } = t.context;

  option.value = '1931';
  t.is(option.value, '1931');

  option.value = 1930;
  t.is(option.value, '1930');

  option.value = false;
  t.is(option.value, 'false');

  option.value = null;
  t.is(option.value, 'null');
});
