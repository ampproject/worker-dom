import anyTest, { TestInterface } from 'ava';
import { Comment } from '../../worker-thread/dom/Comment';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  comment: Comment;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    comment: document.createComment('default value'),
  };
});

test('get textContent', (t) => {
  const { comment } = t.context;

  t.is(comment.textContent, 'default value');
});

test('set textContent', (t) => {
  const { comment } = t.context;

  t.is(comment.textContent, 'default value');
  comment.textContent = 'new value';
  t.is(comment.textContent, 'new value');
});

test('textContent matches data', (t) => {
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
