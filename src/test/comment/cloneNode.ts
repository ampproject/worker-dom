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
import { Element } from '../../worker-thread/dom/Element';
import { Comment } from '../../worker-thread/dom/Comment';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  parent: Element;
  comment: Comment;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();
  const parent = document.createElement('div');
  const comment = document.createComment('Super Comment');

  parent.appendChild(comment);
  document.body.appendChild(parent);

  t.context = {
    parent,
    comment,
  };
});

test('cloneNode should create a new node with the same tagName', t => {
  const { comment } = t.context;

  t.is(comment.cloneNode().tagName, comment.tagName);
});

test('cloneNode should create a new node with a different index', t => {
  const { comment } = t.context;

  t.not(comment.cloneNode()[TransferrableKeys.index], comment[TransferrableKeys.index]);
});

test('cloneNode should create a new node with the same children when the deep flag is set', t => {
  const { parent, comment } = t.context;
  const clone = parent.cloneNode(true);

  t.is(parent.childNodes.length, clone.childNodes.length);
  t.is(comment.tagName, clone.childNodes[0].tagName);
  t.is(comment.textContent, clone.childNodes[0].textContent);
});
