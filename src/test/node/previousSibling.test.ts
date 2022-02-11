import anyTest, { TestInterface } from 'ava';
import { Element } from '../../worker-thread/dom/Element';
import { Node } from '../../worker-thread/dom/Node';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  node: Element;
  child: Element;
  childTwo: Element;
  textNode: Node;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('div'),
    child: document.createElement('div'),
    childTwo: document.createElement('div'),
    textNode: document.createTextNode('Hello world');
  };
});

test('when a parent contains two children, the previous sibling of the second is the first', (t) => {
  const { node, child, childTwo } = t.context;

  node.appendChild(child);
  node.appendChild(childTwo);
  t.deepEqual(childTwo.previousSibling, child);
  t.deepEqual(childTwo.previousElementSibling, child);
});

test('when a node does not have a parent, its previous sibling is null', (t) => {
  const { node } = t.context;

  t.is(node.previousSibling, null);
  t.is(node.previousElementSibling, null);
});

test('when a node is the first child of a parent, the previous sibling is null', (t) => {
  const { node, child } = t.context;

  node.appendChild(child);
  t.is(child.previousSibling, null);
});

test('previousElementSibling skips over text nodes', (t) => {
  const { node, child, childTwo, textNode } = t.context;

  node.appendChild(child);
  node.appendChild(textNode)
  node.appendChild(childTwo);
  t.is(childTwo.previousElementSibling, child);
});
