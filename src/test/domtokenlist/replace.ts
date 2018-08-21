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

test('replace a single value', t => {
  const { tokenList } = t.context as { tokenList: DOMTokenList };

  tokenList.value = 'foo';
  tokenList.replace('foo', '');
  t.is(tokenList.value, '');

  tokenList.value = 'foo bar';
  tokenList.replace('foo', 'baz');
  t.is(tokenList.value, 'bar baz');

  tokenList.value = 'foo foo bar';
  tokenList.replace('bar', 'baz');
  t.is(tokenList.value, 'foo baz');

  tokenList.value = 'foo foo bar';
  tokenList.replace('foo', 'baz');
  t.is(tokenList.value, 'bar baz');

  tokenList.value = 'foo foo bar';
  tokenList.replace('foo', 'foo');
  t.is(tokenList.value, 'foo bar');
});

test('replace an invalid value', t => {
  const { tokenList } = t.context as { tokenList: DOMTokenList };

  tokenList.value = 'foo';
  tokenList.replace('bar', '');
  t.is(tokenList.value, 'foo', 'when value is requested to be replaced that does not exist, the value is unchanged');

  tokenList.value = 'foo bar';
  tokenList.replace('', 'baz');
  t.is(tokenList.value, 'foo bar', 'when value is requested to be replaced that does not exist, the value is unchanged');

  tokenList.value = 'foo foo bar';
  tokenList.replace('baz', 'omega');
  t.is(tokenList.value, 'foo foo bar', 'when value is requested to be replaced that does not exist, the value is unchanged');
});
