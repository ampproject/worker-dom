import anyTest, { TestInterface } from 'ava';
import { Element } from '../../worker-thread/dom/Element';
import { Document } from '../../worker-thread/dom/Document';
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

test('appending to an Node with no childNodes', (t) => {
  const { node, child } = t.context;

  node.appendChild(child);
  t.deepEqual(node.childNodes[0], child, 'childNode[0] = new child');
  t.deepEqual(child.parentNode, node, 'child.parentNode = Node');
});

test('appending to a Node with populated childNodes', (t) => {
  const { node, child, childTwo } = t.context;

  node.appendChild(child);
  node.appendChild(childTwo);
  t.deepEqual(node.childNodes[1], childTwo, 'childNode[length] = new child');
});

test('reappending a known child', (t) => {
  const { node, child, childTwo } = t.context;

  node.appendChild(child);
  node.appendChild(childTwo);
  node.appendChild(child);
  t.deepEqual(node.childNodes[0], childTwo, 'reappending a known child removes the child from exising position');
  t.deepEqual(node.childNodes[1], child, 'reappending a known child makes childNode[length] = new child');
});

test('appending returns the appended child', (t) => {
  const { node, child } = t.context;

  const returned = node.appendChild(child);
  t.is(child, returned);
});

test('appending a document fragment with a single child', (t) => {
  const { document, node, child } = t.context;
  const fragment = document.createDocumentFragment();

  fragment.appendChild(child);
  node.appendChild(fragment);
  t.deepEqual(node.childNodes[0], child);
});

test('appending a document fragment with a multiple children', (t) => {
  const { document, node, child, childTwo } = t.context;
  const fragment = document.createDocumentFragment();

  fragment.appendChild(child);
  fragment.appendChild(childTwo);
  node.appendChild(fragment);
  t.deepEqual(node.childNodes[0], child);
  t.deepEqual(node.childNodes[1], childTwo);
});
