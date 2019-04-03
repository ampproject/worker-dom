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
import { HTMLButtonElement } from '../../worker-thread/dom/HTMLButtonElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLButtonElement;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('button') as HTMLButtonElement,
  };
});

test('autofocus should be false by default', t => {
  const { element } = t.context;

  t.is(element.autofocus, false);
});

test('autofocus should be settable to a single value', t => {
  const { element } = t.context;

  element.autofocus = true;
  t.is(element.autofocus, true);
});

test('autofocus property change should be reflected in attribute', t => {
  const { element } = t.context;

  element.autofocus = true;
  t.true(element.hasAttribute('autofocus'));

  element.autofocus = false;
  t.false(element.hasAttribute('autofocus'));
});

test('autofocus attribute change should be reflected in property', t => {
  const { element } = t.context;

  element.setAttribute('autofocus', '');
  t.true(element.autofocus);

  element.removeAttribute('autofocus');
  t.false(element.autofocus);
});
