import anyTest, { TestInterface } from 'ava';
import { Element } from '../../worker-thread/dom/Element';
import { Document } from '../../worker-thread/dom/Document';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
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
