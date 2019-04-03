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
import { CSSStyleDeclaration, appendKeys } from '../../worker-thread/css/CSSStyleDeclaration';
import { Element } from '../../worker-thread/dom/Element';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  node: Element;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('div'),
  };
});

test('removing a value stored eliminates the stored value', t => {
  const declaration = new CSSStyleDeclaration(t.context.node);

  appendKeys(['width']);
  declaration.width = '10px';
  t.is(declaration.width, '10px');
  declaration.removeProperty('width');
  t.is(declaration.width, '');
});

test('removing a value stored returns the previously stored value', t => {
  const declaration = new CSSStyleDeclaration(t.context.node);

  appendKeys(['width']);
  declaration.width = '10px';
  const oldValue = declaration.removeProperty('width');
  t.is(oldValue, '10px');
});
