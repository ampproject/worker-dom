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

test('getter should be empty by default', t => {
  const { tokenList } = t.context as { tokenList: DOMTokenList };

  t.is(tokenList.value, '');
});

test('should accept new total values via setter', t => {
  const { tokenList } = t.context as { tokenList: DOMTokenList };

  tokenList.value = 'foo';
  t.is(tokenList.value, 'foo');
  tokenList.value = 'foo bar baz';
  t.is(tokenList.value, 'foo bar baz');
  tokenList.value = 'foo foo bar baz foo baz bar';
  t.is(tokenList.value, 'foo foo bar baz foo baz bar', 'duplicates are allowed and their position is retained');
});
