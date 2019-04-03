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
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { HTMLImageElement } from '../../worker-thread/dom/HTMLImageElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLImageElement;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('img') as HTMLImageElement,
  };
});

testReflectedProperties([
  { alt: [''] },
  { crossOrigin: [''] },
  { height: [0] },
  { isMap: [false] },
  { referrerPolicy: [''] },
  { src: [''] },
  { sizes: [''] },
  { srcset: [''] },
  { useMap: [''] },
  { width: [0] },
]);
