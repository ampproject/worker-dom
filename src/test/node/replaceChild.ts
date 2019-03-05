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
import { Element } from '../../worker-thread/dom/Element';
import { createDocument } from '../../worker-thread/dom/Document';

const test = anyTest as TestInterface<{
  parent: Element;
  x: Element;
  y: Element;
  z: Element;
}>;

test.beforeEach(t => {
  const document = createDocument();

  t.context = {
    parent: document.createElement('div'),
    x: document.createElement('div'),
    y: document.createElement('p'),
    z: document.createElement('section'),
  };
});

test('replacing the same child results in no changes', t => {
  const { parent, x } = t.context;

  parent.appendChild(x);
  t.is(x.parentNode, parent);

  const replaced = parent.replaceChild(x, x);

  t.is(x.parentNode, parent);
  t.is(replaced, x);
  t.deepEqual(parent.childNodes, [x]);
});

test('replacing a child with another when there is only a single child', t => {
  const { parent, x, y } = t.context;

  parent.appendChild(x);
  t.is(x.parentNode, parent);
  t.is(y.parentNode, null);

  const replaced = parent.replaceChild(y, x);

  t.is(replaced, x);
  t.is(x.parentNode, null);
  t.is(y.parentNode, parent);
  t.deepEqual(parent.childNodes, [y]);
});

test('replacing a child with another when there are multiple children', t => {
  const { parent, x, y, z } = t.context;

  parent.appendChild(x);
  parent.appendChild(y);
  t.is(x.parentNode, parent);
  t.is(y.parentNode, parent);

  const replaced = parent.replaceChild(z, y);

  t.is(replaced, y);
  t.is(y.parentNode, null);
  t.is(z.parentNode, parent);
  t.deepEqual(parent.childNodes, [x, z]);
});
