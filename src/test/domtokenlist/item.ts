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

test('getting position zero should return the correct value', t => {
  const { tokenList } = t.context as { tokenList: DOMTokenList };

  tokenList.value = 'foo';
  t.is(tokenList.item(0), 'foo');
  tokenList.value = 'foo bar';
  t.is(tokenList.item(0), 'foo');
  tokenList.value = 'foo bar foo';
  t.is(tokenList.item(0), 'foo');
  tokenList.value = 'bar foo';
  t.is(tokenList.item(0), 'bar');
});

test('getting last position should return the correct value', t => {
  const { tokenList } = t.context as { tokenList: DOMTokenList };

  tokenList.value = 'foo';
  t.is(tokenList.item(tokenList.length - 1), 'foo');
  tokenList.value = 'foo bar';
  t.is(tokenList.item(tokenList.length - 1), 'bar');
  tokenList.value = 'foo bar foo';
  t.is(tokenList.item(tokenList.length - 1), 'foo');
  tokenList.value = 'bar foo';
  t.is(tokenList.item(tokenList.length - 1), 'foo');
});

test('getting middle positions should return the correct value', t => {
  const { tokenList } = t.context as { tokenList: DOMTokenList };

  tokenList.value = 'foo bar foo';
  t.is(tokenList.item(1), 'bar');
  tokenList.value = 'foo bar baz omega';
  t.is(tokenList.item(1), 'bar');
  t.is(tokenList.item(2), 'baz');
});
