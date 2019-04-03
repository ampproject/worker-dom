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
import { Comment } from '../../worker-thread/dom/Comment';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  comment: Comment;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    comment: document.createComment('default value'),
  };
});

test('get textContent', t => {
  const { comment } = t.context;

  t.is(comment.textContent, 'default value');
});

test('set textContent', t => {
  const { comment } = t.context;

  t.is(comment.textContent, 'default value');
  comment.textContent = 'new value';
  t.is(comment.textContent, 'new value');
});

test('textContent matches data', t => {
  const { comment } = t.context;

  t.is(comment.data, 'default value');
  t.is(comment.textContent, 'default value');

  comment.data = 'data setter';
  t.is(comment.data, 'data setter');
  t.is(comment.textContent, 'data setter');

  comment.textContent = 'textContent setter';
  t.is(comment.data, 'textContent setter');
  t.is(comment.textContent, 'textContent setter');
});
