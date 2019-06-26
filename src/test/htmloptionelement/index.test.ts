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
import { Element } from '../../worker-thread/dom/Element';

const test = anyTest as TestInterface<{
  option: HTMLOptionElement;
  optionTwo: HTMLOptionElement;
  optionThree: HTMLOptionElement;
  select: Element;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    option: document.createElement('option') as HTMLOptionElement,
    optionTwo: document.createElement('option') as HTMLOptionElement,
    optionThree: document.createElement('option') as HTMLOptionElement,
    select: document.createElement('select'),
  };
});

test('index should be 0 by default', t => {
  const { option } = t.context;

  t.is(option.index, 0);
});

test('index should be 0 for single item', t => {
  const { option, select } = t.context;

  select.appendChild(option);
  t.is(option.index, 0);
});

test('index should be 0 and 1 for two items', t => {
  const { option, optionTwo, select } = t.context;

  select.appendChild(option);
  select.appendChild(optionTwo);
  t.is(option.index, 0);
  t.is(optionTwo.index, 1);
});

test('index should be the live index when moved', t => {
  const { option, optionTwo, optionThree, select } = t.context;

  select.appendChild(option);
  select.appendChild(optionTwo);
  select.appendChild(optionThree);
  t.is(option.index, 0);
  t.is(optionTwo.index, 1);
  t.is(optionThree.index, 2);

  select.appendChild(option);
  t.is(option.index, 2);
});
