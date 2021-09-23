import anyTest, { TestInterface } from 'ava';
import { Element } from '../../worker-thread/dom/Element';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  node: Element;
  child: Element;
  childTwo: Element;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('div'),
    child: document.createElement('div'),
    childTwo: document.createElement('div'),
  };
});

test('when a parent contains two children, the next sibling of the first is the second', (t) => {
  const { node, child, childTwo } = t.context;

  node.appendChild(child);
  node.appendChild(childTwo);
  t.deepEqual(child.nextSibling, childTwo);
});

test('when a node does not have a parent, its next sibling is null', (t) => {
  const { node } = t.context;

  t.is(node.nextSibling, null);
});

test('when a node is the last child of a parent, the next sibling is null', (t) => {
  const { node, child, childTwo } = t.context;

  node.appendChild(child);
  node.appendChild(childTwo);
  t.is(childTwo.nextSibling, null);
});
