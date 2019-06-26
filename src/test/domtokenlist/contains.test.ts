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
import { DOMTokenList } from '../../worker-thread/dom/DOMTokenList';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  tokenList: DOMTokenList;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    tokenList: new DOMTokenList(document.createElement('div'), 'class'),
  };
});

test('by default nothing is contained', t => {
  const { tokenList } = t.context;

  t.is(tokenList.contains('foo'), false);
  t.is(tokenList.contains(''), false);
});

test('when only a single value is present, it is always contained', t => {
  const { tokenList } = t.context;

  tokenList.value = 'foo';
  t.is(tokenList.contains('foo'), true);
  t.is(tokenList.contains('bar'), false);
  tokenList.value = 'foo foo';
  t.is(tokenList.contains('foo'), true);
  t.is(tokenList.contains('bar'), false);
});

test('when multiple values are present, they are correctly contained', t => {
  const { tokenList } = t.context;

  tokenList.value = 'foo bar';
  t.is(tokenList.contains('foo'), true);
  t.is(tokenList.contains('bar'), true);
  t.is(tokenList.contains('baz'), false);
  tokenList.value = 'foo bar foo bar';
  t.is(tokenList.contains('foo'), true);
  t.is(tokenList.contains('bar'), true);
  t.is(tokenList.contains('baz'), false);
});
