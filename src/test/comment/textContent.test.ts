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

import { suite, Context } from 'uvu';
import * as assert from 'uvu/assert';
import { createTestingDocument } from '../DocumentCreation';
import { Document } from '../../worker-thread/dom/Document';

const test = suite<Context>('textContent', {
  document: Document,
});

test.before.each((context) => {
  context.document = createTestingDocument();
});

test('get textContent', (context) => {
  const { document } = context;
  const comment = document.createComment('default value');

  assert.is(comment.textContent, 'default value');
});

test('set textContent', (context) => {
  const { document } = context;
  const comment = document.createComment('default value');

  assert.is(comment.textContent, 'default value');
  comment.textContent = 'new value';
  assert.is(comment.textContent, 'new value');
});

test('textContent matches data', (context) => {
  const { document } = context;
  const comment = document.createComment('default value');

  assert.is(comment.data, 'default value');
  assert.is(comment.textContent, 'default value');

  comment.data = 'data setter';
  assert.is(comment.data, 'data setter');
  assert.is(comment.textContent, 'data setter');

  comment.textContent = 'textContent setter';
  assert.is(comment.data, 'textContent setter');
  assert.is(comment.textContent, 'textContent setter');
});

test.run();
