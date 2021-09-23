import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { Element } from '../../worker-thread/dom/Element';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  document: Document;
  node: Element;
  child: Element;
  childTwo: Element;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    document,
    node: document.createElement('div'),
    child: document.createElement('div'),
    childTwo: document.createElement('div'),
  };
});

test('returns true for a node containing itself', (t) => {
  const { node } = t.context;

  t.is(node.contains(node), true);
});

test('returns false for a node not contained by a parent', (t) => {
  const { node, child } = t.context;

  t.is(node.contains(child), false);
});

test('returns true for a node contained in the document', (t) => {
  const { document, node, child } = t.context;

  node.appendChild(child);
  document.body.appendChild(node);
  t.is(document.contains(node), true);
});

test('returns true for a node contained deeper within a tree', (t) => {
  const { node, child, childTwo } = t.context;

  child.appendChild(childTwo);
  node.appendChild(child);
  t.is(node.contains(childTwo), true, 'for a node contained deeper within a tree, return true');
});

test('returns false for a node deep within a tree containing parents', (t) => {
  const { node, child, childTwo } = t.context;

  child.appendChild(childTwo);
  node.appendChild(child);
  t.is(childTwo.contains(node), false);
});
