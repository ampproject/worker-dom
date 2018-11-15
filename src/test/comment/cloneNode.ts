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
import { documentForTesting as document } from '../../worker-thread/dom/Document';
import { Element } from '../../worker-thread/dom/Element';
import { Comment } from '../../worker-thread/dom/Comment';

test.beforeEach(t => {
  t.context = {
    parent: document.createElement('div'),
    comment: document.createComment('Super Comment'),
  };

  t.context.parent.appendChild(t.context.comment);
  document.body.appendChild(t.context.parent);
});
test.afterEach(_ => {
  document.body.childNodes.forEach(childNode => childNode.remove());
});

test('cloneNode should create a new node with the same tagName', t => {
  const { comment } = t.context as { comment: Comment };

  t.is(comment.cloneNode().tagName, comment.tagName);
});

test('cloneNode should create a new node with a different _index_', t => {
  const { comment } = t.context as { comment: Comment };

  t.not(comment.cloneNode()._index_, comment._index_);
});

test('cloneNode should create a new node with the same children when the deep flag is set', t => {
  const { parent, comment } = t.context as { parent: Element; comment: Comment };
  const clone = parent.cloneNode(true);

  t.is(parent.childNodes.length, clone.childNodes.length);
  t.is(comment.tagName, clone.childNodes[0].tagName);
  t.is(comment.textContent, clone.childNodes[0].textContent);
});
