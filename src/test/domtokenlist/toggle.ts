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

test('toggle off a token', t => {
  const { tokenList } = t.context as { tokenList: DOMTokenList };

  tokenList.value = 'foo';
  t.is(tokenList.toggle('foo'), false);
  t.is(tokenList.value, '');
});

test('toggle on a token', t => {
  const { tokenList } = t.context as { tokenList: DOMTokenList };

  tokenList.value = '';
  t.is(tokenList.toggle('foo'), true);
  t.is(tokenList.value, 'foo');
});

test('toggle off a token removes duplicates', t => {
  const { tokenList } = t.context as { tokenList: DOMTokenList };

  tokenList.value = 'foo foo';
  t.is(tokenList.toggle('foo'), false);
  t.is(tokenList.value, '');
});

test('toggle off a token removes duplicates and leaves other values', t => {
  const { tokenList } = t.context as { tokenList: DOMTokenList };

  tokenList.value = 'foo foo bar';
  t.is(tokenList.toggle('foo'), false);
  t.is(tokenList.value, 'bar');

  tokenList.value = 'foo foo bar bar';
  t.is(tokenList.toggle('foo'), false);
  t.is(tokenList.value, 'bar');
});

test('toggle on a token removes duplicates and leaves other values', t => {
  const { tokenList } = t.context as { tokenList: DOMTokenList };

  tokenList.value = 'foo foo bar';
  t.is(tokenList.toggle('baz'), true);
  t.is(tokenList.value, 'foo bar baz');

  tokenList.value = 'foo foo bar bar';
  t.is(tokenList.toggle('baz'), true);
  t.is(tokenList.value, 'foo bar baz');
});

test('toggle a token with force=false value', t => {
  const { tokenList } = t.context as { tokenList: DOMTokenList };

  tokenList.value = 'foo foo bar';
  t.is(tokenList.toggle('foo', false), false);
  t.is(tokenList.value, 'bar');

  tokenList.value = 'foo foo bar bar';
  t.is(tokenList.toggle('foo', false), false);
  t.is(tokenList.value, 'bar');
});

test('toggle a token with force=true value', t => {
  const { tokenList } = t.context as { tokenList: DOMTokenList };

  tokenList.value = 'foo foo bar';
  t.is(tokenList.toggle('foo', true), true);
  t.is(tokenList.value, 'foo foo bar');

  tokenList.value = 'foo foo bar bar';
  t.is(tokenList.toggle('foo', true), true);
  t.is(tokenList.value, 'foo foo bar bar');
});
