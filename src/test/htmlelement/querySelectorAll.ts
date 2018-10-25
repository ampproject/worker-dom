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

test('test Element.querySelectorAll on id selectors', t => {
  const { div } = t.context as { div: HTMLElement };
  t.deepEqual(document.querySelectorAll(`#${DIV_ID}`), [div]);
});

test('test Element.querySelectorAll on class selectors', t => {
  const { div } = t.context as { div: HTMLElement };
  t.deepEqual(document.querySelectorAll(`.${DIV_CLASS}`), [div]);
});

test('test Element.querySelectorAll on tag selectors', t => {
  const { parentDiv, div } = t.context as { parentDiv: HTMLElement; div: HTMLElement };
  t.deepEqual(document.querySelectorAll('div'), [parentDiv, div]);
  t.deepEqual(parentDiv.querySelectorAll('div'), [div]);
});

test('test Element.querySelectorAll is case insensitive with regards to tags', t => {
  const { parentDiv, div } = t.context as { parentDiv: HTMLElement; div: HTMLElement };
  t.deepEqual(document.querySelectorAll('div'), [parentDiv, div]);
  t.deepEqual(parentDiv.querySelectorAll('div'), [div]);
  t.deepEqual(document.querySelectorAll('DIV'), [parentDiv, div]);
  t.deepEqual(parentDiv.querySelectorAll('DIV'), [div]);

  t.deepEqual(document.querySelectorAll('div'), document.querySelectorAll('DIV'));
  t.deepEqual(parentDiv.querySelectorAll('div'), parentDiv.querySelectorAll('DIV'));
});

test('test Element.querySelector returns the first result of Element.querySelectorAll', t => {
  const { parentDiv } = t.context as { parentDiv: HTMLElement; div: HTMLElement };
  let querySelectorAllResults = document.querySelectorAll('div');
  t.not(querySelectorAllResults, null);
  t.deepEqual(querySelectorAllResults![0], document.querySelector('div'));

  querySelectorAllResults = parentDiv.querySelectorAll('div');
  t.not(querySelectorAllResults, null);
  t.deepEqual(parentDiv.querySelectorAll('div')![0], parentDiv.querySelector('div'));

  querySelectorAllResults = document.querySelectorAll('DIV');
  t.not(querySelectorAllResults, null);
  t.deepEqual(document.querySelectorAll('DIV')![0], document.querySelector('DIV'));

  querySelectorAllResults = parentDiv.querySelectorAll('DIV');
  t.not(querySelectorAllResults, null);
  t.deepEqual(parentDiv.querySelectorAll('DIV')![0], parentDiv.querySelector('DIV'));
});
