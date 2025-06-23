import anyTest, { TestFn } from 'ava';
import { Element } from '../../worker-thread/dom/Element.js';
import { Comment } from '../../worker-thread/dom/Comment.js';
import { TransferrableKeys } from '../../transfer/TransferrableKeys.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  parent: Element;
  comment: Comment;
}>;

test.beforeEach((t) => {
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

test('cloneNode should create a new node with the same tagName', (t) => {
  const { comment } = t.context;

  t.is(comment.cloneNode().tagName, comment.tagName);
});

test('cloneNode should create a new node with a different index', (t) => {
  const { comment } = t.context;

  t.not(comment.cloneNode()[TransferrableKeys.index], comment[TransferrableKeys.index]);
});

test('cloneNode should create a new node with the same children when the deep flag is set', (t) => {
  const { parent, comment } = t.context;
  const clone = parent.cloneNode(true);

  t.is(parent.childNodes.length, clone.childNodes.length);
  t.is(comment.tagName, clone.childNodes[0].tagName);
  t.is(comment.textContent, clone.childNodes[0].textContent);
});
