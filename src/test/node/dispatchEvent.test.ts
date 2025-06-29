import anyTest, { TestFn } from 'ava';
import { Event } from '../../worker-thread/Event.js';
import { Element } from '../../worker-thread/dom/Element.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  node: Element;
  event: Event;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();
  const node = document.createElement('div');
  const event = new Event('click', {});
  event.target = node;

  t.context = {
    node,
    event,
  };
});

test('calls handler functions registered with addEventListener', (t) => {
  const { node, event } = t.context;

  node.addEventListener('click', (event: Event) => {
    t.deepEqual(event.target, node, 'event target is the node the event was dispatched from');
    t.pass();
  });
  t.true(node.dispatchEvent(event));
});

test('does not call handler functions removed with removeEventListener', (t) => {
  const { node, event } = t.context;
  const functionRemoved = (event: Event) => t.fail('removeEventListener function handler was called');

  node.addEventListener('click', functionRemoved);
  node.removeEventListener('click', functionRemoved);
  t.true(node.dispatchEvent(event));
});

test('calls handler functions for only specified type of event', (t) => {
  const { node, event } = t.context;

  node.addEventListener('click', (event: Event) => {
    t.is(event.type, 'click', 'event type is correct');
  });
  node.addEventListener('foo', (event: Event) => {
    t.fail('handler for the incorrect type was called');
  });
  t.true(node.dispatchEvent(event));
});
