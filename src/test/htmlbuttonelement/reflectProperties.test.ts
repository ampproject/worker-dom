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
import { testReflectedProperty } from '../reflectPropertiesHelper';
import { HTMLButtonElement } from '../../worker-thread/dom/HTMLButtonElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLButtonElement;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('button') as HTMLButtonElement,
  };
});

testReflectedProperty({ disabled: [false] });
testReflectedProperty({ formAction: [''] }, 'hello');
testReflectedProperty({ formEnctype: [''] });
testReflectedProperty({ formMethod: [''] });
testReflectedProperty({ formTarget: [''] });
testReflectedProperty({ name: [''] });
testReflectedProperty({ type: ['submit'] });
testReflectedProperty({ value: [''] });
testReflectedProperty({ autofocus: [false] });
