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
import { HTMLOptionElement } from '../../worker-thread/dom/HTMLOptionElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  option: HTMLOptionElement;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    option: document.createElement('option') as HTMLOptionElement,
  };
});

test('selected should be false by default', t => {
  const { option } = t.context;

  t.is(option.selected, false);
});

test('selected should be settable to a boolean true value', t => {
  const { option } = t.context;

  option.selected = true;
  t.is(option.selected, true);
});

test('selected should be settable to a boolean false value', t => {
  const { option } = t.context;

  option.selected = false;
  t.is(option.selected, false);
});

test('selected should be settable to a string truthy value', t => {
  const { option } = t.context;

  option.selected = 'true';
  t.is((option.selected as unknown) as boolean, true);
});

test('selected should be settable to a string falsy value', t => {
  const { option } = t.context;

  option.selected = 'false';
  t.is((option.selected as unknown) as boolean, true, 'setting to falsy value causes selected to be true.');
});

test('selected should be settable to an empty string value', t => {
  const { option } = t.context;

  option.selected = '';
  t.is((option.selected as unknown) as boolean, false, 'setting to an empty string forces the value to be false.');
});

test('selected should be settable to a number truthy value', t => {
  const { option } = t.context;

  option.selected = 1;
  t.is((option.selected as unknown) as boolean, true);
});

test('selected should be settable to a number falsy value', t => {
  const { option } = t.context;

  option.selected = 0;
  t.is((option.selected as unknown) as boolean, false);
});

test('selected should be settable to null', t => {
  const { option } = t.context;

  option.selected = null;
  t.is((option.selected as unknown) as boolean, false);
});
