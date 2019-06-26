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
import { TransferrableKeys } from '../../transfer/TransferrableKeys';

const test = anyTest as TestInterface<{
  node: Element;
  declaration: CSSStyleDeclaration;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('div'),
    declaration: new CSSStyleDeclaration(document.createElement('div')),
  };
});

test.serial('appending keys mutates a declaration instance', t => {
  const { declaration } = t.context;

  t.is(declaration.width, undefined);
  appendKeys(['width']);
  t.is(declaration.width, '');
});

test.serial('previously appended keys should exist on newly declared instances', t => {
  const declaration = new CSSStyleDeclaration(t.context.node);

  t.is(declaration.width, '');
});

test('invalid keys are filtered', t => {
  const initialLength = CSSStyleDeclaration.prototype.length;

  appendKeys(['0']);
  t.is(CSSStyleDeclaration.prototype.length, initialLength);
});

test('appending keys mutates all known declaration instances', t => {
  const firstDeclaration = new CSSStyleDeclaration(t.context.node);
  const secondDeclaration = new CSSStyleDeclaration(t.context.node);

  t.is(firstDeclaration.height, undefined);
  t.is(secondDeclaration.height, undefined);
  appendKeys(['height']);
  t.is(firstDeclaration.height, '');
  t.is(secondDeclaration.height, '');
});

test('reappending a key does not cause an error', t => {
  const declaration = new CSSStyleDeclaration(t.context.node);
  appendKeys(['width']);
  appendKeys(['width']);

  t.is(declaration.width, '');
});

test('appending as many keys as there are TransferrableKeys functions', t => {
  const declaration = new CSSStyleDeclaration(t.context.node);
  appendKeys(['width']);
  appendKeys(Array.from(Array(TransferrableKeys.END), (d, i) => i + 'key'));

  t.is(declaration.width, '');
  declaration.width = '40px';
  t.is(declaration.width, '40px');
});
