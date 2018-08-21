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
import { NodeType } from '../../worker-thread/dom/Node';
import { Element } from '../../worker-thread/dom/Element';
import { DOMTokenList } from '../../worker-thread/dom/DOMTokenList';

test.beforeEach(t => {
  t.context = {
    tokenList: new DOMTokenList(Element, new Element(NodeType.ELEMENT_NODE, 'div', null), 'class', null, null),
  };
});

test('remove a single value', t => {
  const { tokenList } = t.context as { tokenList: DOMTokenList };

  tokenList.value = 'foo';
  tokenList.remove('foo');
  t.is(tokenList.value, '');

  tokenList.value = 'foo foo';
  tokenList.remove('foo');
  t.is(tokenList.value, '', 'removing a single value that is stored more than once currently removes duplicates');

  tokenList.value = 'foo foo';
  tokenList.remove('bar');
  t.is(tokenList.value, 'foo', 'removing a single value not within stored values removes duplicates');

  tokenList.value = 'foo bar bar foo';
  tokenList.remove('foo');
  t.is(
    tokenList.value,
    'bar',
    'removing a single value that is stored more than once currently removes duplicates and leaves other unique values intact',
  );
});

test('removing multiple values', t => {
  const { tokenList } = t.context as { tokenList: DOMTokenList };

  tokenList.value = 'foo bar';
  tokenList.remove('foo', 'bar');
  t.is(tokenList.value, '');

  tokenList.value = 'foo foo';
  tokenList.remove('foo', 'foo');
  t.is(tokenList.value, '', 'removing multiple values of the same value that is stored more than once currently removes duplicates');

  tokenList.value = 'foo bar foo bar';
  tokenList.remove('foo', 'foo');
  t.is(
    tokenList.value,
    'bar',
    'removing multiple values of the same value that is stored more than once currently removes duplicates and leaves other unique values intact',
  );

  tokenList.value = 'foo bar foo bar';
  tokenList.remove('foo', 'bar');
  t.is(tokenList.value, '', 'removing multiple values can remove all values');
});
