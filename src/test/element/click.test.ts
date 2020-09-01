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
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{}>;

test('HTMLElement.click() can be programatically triggered', (t) => {
  const doc = createTestingDocument();
  const input = doc.createElement('input');

  let resolve: Function;
  let promise: Promise<void> = new Promise((res) => (resolve = res));

  input.addEventListener('click', () => {
    t.pass();
    resolve();
  });
  input.click();

  return promise;
});
