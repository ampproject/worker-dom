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
import { Node } from '../../worker-thread/dom/Node';
import { DocumentFragment } from '../../worker-thread/dom/DocumentFragment';

const PARENT_DIV_ID = 'PARENT_DIV_ID';
const PARENT_DIV_CLASS = 'PARENT_DIV_CLASS';

const DIV_ID = 'DIV_ID';
const DIV_CLASS = 'DIV_CLASS';

test.beforeEach(t => {
  const parentFragment = document.createDocumentFragment();
  const parentDiv = document.createElement('div');
  parentDiv.setAttribute('id', PARENT_DIV_ID);
  parentDiv.setAttribute('class', PARENT_DIV_CLASS);
  const div = document.createElement('div');
  div.setAttribute('id', DIV_ID);
  div.setAttribute('class', DIV_CLASS);
  parentDiv.appendChild(div);
  parentFragment.appendChild(parentDiv);
  t.context = {
    parentFragment,
    parentDiv,
    div,
  };
});

test.afterEach(t => {
  (t.context.parentFragment.childNodes as Node[]).forEach(childNode => childNode.remove());
});

test('test Element.querySelector on id selectors', t => {
  const { parentFragment, div } = t.context as { parentFragment: DocumentFragment; div: HTMLElement };
  t.deepEqual(parentFragment.querySelector(`#${DIV_ID}`), div);
});

test('test Element.querySelector on class selectors', t => {
  const { parentFragment, div } = t.context as { parentFragment: DocumentFragment; div: HTMLElement };
  t.deepEqual(parentFragment.querySelector(`.${DIV_CLASS}`), div);
});

test('test Element.querySelector on tag selectors', t => {
  const { parentFragment, parentDiv, div } = t.context as { parentFragment: DocumentFragment; parentDiv: HTMLElement; div: HTMLElement };
  t.deepEqual(parentFragment.querySelector('div'), parentDiv);
  t.deepEqual(parentDiv.querySelector('div'), div);
});

test('test Element.querySelector is case insensitive with regards to tags', t => {
  const { parentFragment, parentDiv, div } = t.context as { parentFragment: DocumentFragment; parentDiv: HTMLElement; div: HTMLElement };
  t.deepEqual(parentFragment.querySelector('div'), parentDiv);
  t.deepEqual(parentDiv.querySelector('div'), div);
  t.deepEqual(parentFragment.querySelector('DIV'), parentDiv);
  t.deepEqual(parentDiv.querySelector('DIV'), div);

  t.deepEqual(parentFragment.querySelector('div'), parentFragment.querySelector('DIV'));
  t.deepEqual(parentDiv.querySelector('div'), parentDiv.querySelector('DIV'));
});
