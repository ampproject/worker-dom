import anyTest, { TestFn } from 'ava';
import * as sinon from 'sinon';
import { Element } from '../../worker-thread/dom/Element.js';
import { Document } from '../../worker-thread/dom/Document.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  document: Document;
  node: Element;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    document,
    node: document.createElement('div'),
  };
});

test('detached node returns default value', async (t) => {
  const { node } = t.context;

  t.deepEqual(await node.getBoundingClientRectAsync(), {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
});

test('attached node returns default value in node environment', async (t) => {
  const { document, node } = t.context;

  document.body.appendChild(node);
  t.deepEqual(await node.getBoundingClientRectAsync(), {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
});

test('timeout removes global message listener', async (t) => {
  const { document, node } = t.context;
  const listeners = new Set<Function>();
  document.addGlobalEventListener = (_type: string, handler: Function) => listeners.add(handler);
  document.removeGlobalEventListener = (_type: string, handler: Function) => listeners.delete(handler);
  document.body.appendChild(node);
  const clock = sinon.useFakeTimers();

  try {
    const result = node.getBoundingClientRectAsync();
    t.is(listeners.size, 1);
    await clock.tickAsync(500);
    t.deepEqual(await result, {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
    });
    t.is(listeners.size, 0);
  } finally {
    clock.restore();
  }
});
