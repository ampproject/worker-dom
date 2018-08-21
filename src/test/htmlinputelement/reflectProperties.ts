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
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { NodeType } from '../../worker-thread/dom/Node';
import { HTMLInputElement } from '../../worker-thread/dom/HTMLInputElement';

test.beforeEach(t => {
  t.context = {
    element: new HTMLInputElement(NodeType.ELEMENT_NODE, 'input', null),
  };
});

testReflectedProperties([
  { formAction: [''] },
  { formEncType: [''] },
  { formMethod: [''] },
  { formTarget: [''] },
  { name: [''] },
  { type: ['text'] },
  { disabled: [false] },
  { autofocus: [false] },
  { required: [false] },
  { defaultChecked: [false, 'checked'] },
  { alt: [''] },
  { height: [0] },
  { src: [''] },
  { width: [0] },
  { accept: [''] },
  { autocomplete: [''] },
  { maxLength: [0] },
  { size: [0] },
  { pattern: [''] },
  { placeholder: [''] },
  { readOnly: [false] },
  { min: [''] },
  { max: [''] },
  { defaultValue: ['', 'value'] },
  { dirName: [''] },
  { multiple: [false] },
  { step: [''] },
  { autocapitalize: [''] },
]);
