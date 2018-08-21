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
import { HTMLOptionElement } from '../../worker-thread/dom/HTMLOptionElement';
import { documentForTesting as document } from '../../worker-thread/dom/Document';
import { HTMLElement } from '../../worker-thread/dom/HTMLElement';

test.beforeEach(t => {
  t.context = {
    option: document.createElement('option'),
    optionTwo: document.createElement('option'),
    optionThree: document.createElement('option'),
    select: document.createElement('select'),
  };
});
test.afterEach(t => {
  document.body.childNodes.forEach(childNode => childNode.remove());
});

test('index should be 0 by default', t => {
  const { option } = t.context as { option: HTMLOptionElement };

  t.is(option.index, 0);
});

test('index should be 0 for single item', t => {
  const { option, select } = t.context as { option: HTMLOptionElement; select: HTMLElement };

  select.appendChild(option);
  t.is(option.index, 0);
});

test('index should be 0 and 1 for two items', t => {
  const { option, optionTwo, select } = t.context as { option: HTMLOptionElement; optionTwo: HTMLOptionElement; select: HTMLElement };

  select.appendChild(option);
  select.appendChild(optionTwo);
  t.is(option.index, 0);
  t.is(optionTwo.index, 1);
});

test('index should be the live index when moved', t => {
  const { option, optionTwo, optionThree, select } = t.context as {
    option: HTMLOptionElement;
    optionTwo: HTMLOptionElement;
    optionThree: HTMLOptionElement;
    select: HTMLElement;
  };

  select.appendChild(option);
  select.appendChild(optionTwo);
  select.appendChild(optionThree);
  t.is(option.index, 0);
  t.is(optionTwo.index, 1);
  t.is(optionThree.index, 2);

  select.appendChild(option);
  t.is(option.index, 2);
});
