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
import { HTMLOptionElement } from '../../worker-thread/dom/HTMLOptionElement';
import { documentForTesting as document } from '../../worker-thread/dom/Document';
import { Text } from '../../worker-thread/dom/Text';

test.beforeEach(t => {
  t.context = {
    option: document.createElement('option'),
    text: document.createTextNode('sample text'),
  };
});
test.afterEach(t => {
  document.body.childNodes.forEach(childNode => childNode.remove());
});

test('label should be Node.textContent by default', t => {
  const { option, text } = t.context as { option: HTMLOptionElement; text: Text };

  t.is(option.label, '');
  option.appendChild(text);
  t.is(option.label, 'sample text');
});

test('label is reflected from attribute when present', t => {
  const { option, text } = t.context as { option: HTMLOptionElement; text: Text };

  option.setAttribute('label', 'label attribute');
  t.is(option.label, 'label attribute');
  option.appendChild(text);
  t.is(option.label, 'label attribute');
});

test('label is Node.textContent when attribute is removed', t => {
  const { option, text } = t.context as { option: HTMLOptionElement; text: Text };

  option.setAttribute('label', 'label attribute');
  t.is(option.label, 'label attribute');
  option.appendChild(text);
  option.removeAttribute('label');
  t.is(option.label, 'sample text');
});
