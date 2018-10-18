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
import { documentForTesting as document } from '../../worker-thread/dom/Document';
import { HTMLElement } from '../../worker-thread/dom/HTMLElement';

const DIV_ID = 'DIV_ID';
const DIV_CLASS = 'DIV_CLASS';

test.beforeEach(t => {
  const parentDiv = document.createElement('div');
  const div = document.createElement('div');
  div.setAttribute('id', DIV_ID);
  div.setAttribute('class', DIV_CLASS);
  parentDiv.appendChild(div);
  document.body.appendChild(parentDiv);
  t.context = {
    parentDiv,
    div,
  };
});

test.afterEach(t => {
  document.body.childNodes.forEach(childNode => childNode.remove());
});

test('test Element.querySelector on id selectors', t => {
  const { div } = t.context as { div: HTMLElement };
  t.deepEqual(document.querySelector(`#${DIV_ID}`), div);
});

test('test Element.querySelector on class selectors', t => {
  const { div } = t.context as { div: HTMLElement };
  t.deepEqual(document.querySelector(`.${DIV_CLASS}`), div);
});

test('test Element.querySelector on tag selectors', t => {
  const { parentDiv, div } = t.context as { parentDiv: HTMLElement; div: HTMLElement };
  t.deepEqual(document.querySelector('div'), parentDiv);
  t.deepEqual(parentDiv.querySelector('div'), div);
});

test('test Element.querySelector is case insensitive with regards to tags', t => {
  const { parentDiv, div } = t.context as { parentDiv: HTMLElement; div: HTMLElement };
  t.deepEqual(document.querySelector('div'), parentDiv);
  t.deepEqual(parentDiv.querySelector('div'), div);
  t.deepEqual(document.querySelector('DIV'), parentDiv);
  t.deepEqual(parentDiv.querySelector('DIV'), div);

  t.deepEqual(document.querySelector('div'), document.querySelector('DIV'));
  t.deepEqual(parentDiv.querySelector('div'), parentDiv.querySelector('DIV'));
});
