/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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
import { Document, createDocument } from '../../worker-thread/dom/Document';

const test = anyTest as TestInterface<{
  document: Document;
}>;

test.beforeEach(t => {
  const document = createDocument();
  t.context = { document };
});

test('createElement() should lowercase its input', t => {
  const { document } = t.context;

  let div = document.createElement('div');
  t.is(div.nodeName, 'DIV');
  t.is(div.localName, 'div');

  div = document.createElement('DIV');
  t.is(div.nodeName, 'DIV');
  t.is(div.localName, 'div');

  div = document.createElement('feImage');
  t.is(div.nodeName, 'FEIMAGE');
  t.is(div.localName, 'feimage');
});

test('createElementNS() should not modify its input', t => {
  const { document } = t.context;

  let div = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
  t.is(div.nodeName, 'DIV');
  t.is(div.localName, 'div');

  div = document.createElementNS('http://www.w3.org/1999/xhtml', 'DIV');
  t.is(div.nodeName, 'DIV');
  t.is(div.localName, 'DIV');

  div = document.createElementNS('http://www.w3.org/2000/svg', 'feImage');
  t.is(div.nodeName, 'feImage');
  t.is(div.localName, 'feImage');
});
