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
import { Text } from '../../worker-thread/dom/Text';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  text: Text;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    text: document.createTextNode('default value'),
  };
});

test('get textContent', t => {
  const { text } = t.context;

  t.is(text.textContent, 'default value');
});

test('set textContent', t => {
  const { text } = t.context;

  text.textContent = 'new value';
  t.is(text.textContent, 'new value');
});

test('textContent matches data', t => {
  const { text } = t.context;

  t.is(text.data, 'default value');
  t.is(text.textContent, 'default value');

  text.data = 'data setter';
  t.is(text.data, 'data setter');
  t.is(text.textContent, 'data setter');

  text.textContent = 'textContent setter';
  t.is(text.data, 'textContent setter');
  t.is(text.textContent, 'textContent setter');
});
