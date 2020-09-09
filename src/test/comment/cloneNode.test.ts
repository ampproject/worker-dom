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
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { createTestingDocument } from '../DocumentCreation';
import { Element } from '../../worker-thread/dom/Element';
import { Comment } from '../../worker-thread/dom/Comment';

const test = suite<Context>('cloneNode', {
  parent: Element,
  comment: Comment,
});

test.before.each((context) => {
  const document = createTestingDocument();
  const parent = document.createElement('div');
  const comment = document.createComment('Super Comment');

  parent.appendChild(comment);
  document.body.appendChild(parent);

  context.parent = parent;
  context.comment = comment;
});

test('cloneNode should create a new node with the same tagName', (context) => {
  const { comment } = context;

  assert.is(comment.cloneNode().tagName, comment.tagName);
});

test('cloneNode should create a new node with a different index', (context) => {
  const { comment } = context;
  const clone = comment.cloneNode();

  assert.not.equal(clone[TransferrableKeys.index], comment[TransferrableKeys.index]);
});

test('cloneNode should create a new node with the same children when the deep flag is set', (context) => {
  const { parent, comment } = context;
  const clone = parent.cloneNode(true);

  assert.is(parent.childNodes.length, clone.childNodes.length);
  assert.is(comment.tagName, clone.childNodes[0].tagName);
  assert.is(comment.textContent, clone.childNodes[0].textContent);
});

test.run();
