import anyTest, { TestInterface } from 'ava';
import { Element } from '../../worker-thread/dom/Element';
import { Node } from '../../worker-thread/dom/Node';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  node: Element;
  child: Element;
  childTwo: Element;
  textNode: Node;
  textNodeTwo: Node;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('div'),
    child: document.createElement('div'),
    childTwo: document.createElement('div'),
    textNode: document.createTextNode('Hello'),
    textNodeTwo: document.createTextNode('World'),
  };
});

test('when a parent contains two children, the next sibling of the first is the second', (t) => {
  const { node, child, childTwo } = t.context;

  node.appendChild(child);
  node.appendChild(childTwo);
  t.deepEqual(child.nextSibling, childTwo);
  t.deepEqual(child.nextElementSibling, childTwo);
});

test('when a node does not have a parent, its next sibling is null', (t) => {
  const { node } = t.context;

  t.is(node.nextSibling, null);
  t.is(node.nextElementSibling, null);
});

test('when a node is the last child of a parent, the next sibling is null', (t) => {
  const { node, child, childTwo } = t.context;

  node.appendChild(child);
  node.appendChild(childTwo);
  t.is(childTwo.nextSibling, null);
  t.is(childTwo.nextElementSibling, null);
});

test('nextElementSibling skips over text nodes', (t) => {
  const { node, child, childTwo, textNode, textNodeTwo } = t.context;

  node.appendChild(child);
  node.appendChild(textNode);
  node.appendChild(childTwo);
  node.appendChild(textNodeTwo);

  t.is(child.nextElementSibling, childTwo);
  t.is(textNode.nextElementSibling, childTwo);
  t.is(childTwo.nextElementSibling, null);
  t.is(textNodeTwo.nextElementSibling, null);
});
