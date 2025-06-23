import anyTest, { TestFn } from 'ava';
import { Document } from '../../worker-thread/dom/Document.js';
import { Event } from '../../worker-thread/Event.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  document: Document;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();
  t.context = { document };
});

test('createEvent()', (t) => {
  const { document } = t.context;

  const e = document.createEvent('foo');
  t.is(e.type, 'foo');
  t.false(e.bubbles);
  t.false(e.cancelable);
});

test('Event constructor', (t) => {
  let e = new Event('foo', {});
  t.is(e.type, 'foo');
  t.false(e.bubbles);
  t.false(e.cancelable);

  e = new Event('foo', { bubbles: true, cancelable: true });
  t.is(e.type, 'foo');
  t.true(e.bubbles);
  t.true(e.cancelable);

  e = new Event('foo', {});
  e.initEvent('bar', true, true);
  t.is(e.type, 'bar');
  t.true(e.bubbles);
  t.true(e.cancelable);
});
