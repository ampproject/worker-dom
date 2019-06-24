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
import { testReflectedProperty } from '../reflectPropertiesHelper';
import { HTMLCanvasElement } from '../../worker-thread/dom/HTMLCanvasElement';
import { CanvasRenderingContext2DShim } from '../../worker-thread/canvas/CanvasRenderingContext2D';
import { CanvasRenderingContext2D } from '../../worker-thread/canvas/CanvasTypes';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLCanvasElement;
}>;

test.beforeEach(t => {
  const document = createTestingDocument({ OffscreenCanvas: FakeOffscreenCanvas });

  t.context = {
    element: document.createElement('canvas') as HTMLCanvasElement,
  };
});

class FakeOffscreenCanvas {
  getContext(c: string): CanvasRenderingContext2D {
    return ({} as unknown) as CanvasRenderingContext2D;
  }
}

testReflectedProperty({ width: [0] });
testReflectedProperty({ height: [0] });

test('getContext throws for unsupported types of context', t => {
  const { element } = t.context;
  t.throws(() => {
    element.getContext('webgl');
  });
});

test('getContext retrieves 2D context', t => {
  const { element } = t.context;
  const ctx = element.getContext('2d');
  t.true(ctx instanceof CanvasRenderingContext2DShim);
});

test('getContext will retrieve same instance always', t => {
  const { element } = t.context;
  const firstRetrieval = element.getContext('2d');
  const secondRetrieval = element.getContext('2d');
  t.true(firstRetrieval === secondRetrieval);
});
