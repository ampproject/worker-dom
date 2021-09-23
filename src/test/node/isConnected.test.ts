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
    childTwo: document.createElement('p'),
  };
});

test('without a connected parent, tree depth 1 nodes are not connected', (t) => {
  const { node } = t.context;

  t.is(node.isConnected, false);
});

test('without a connected parent, tree depth > 1 are not connected', (t) => {
  const { node, child } = t.context;

  node.appendChild(child);

  t.is(node.isConnected, false);
  t.is(child.isConnected, false);
});

test('with a connected parent, nodes are connected during append', (t) => {
  const { node, child, childTwo } = t.context;

  node.isConnected = true;
  child.appendChild(childTwo);
  node.appendChild(child);

  t.is(node.isConnected, true);
  t.is(child.isConnected, true);
  t.is(childTwo.isConnected, true);
});

test('nodes are disconnected during removal', (t) => {
  const { node, child, childTwo } = t.context;

  node.isConnected = true;
  child.appendChild(childTwo);
  node.appendChild(child);
  node.removeChild(child);

  t.is(node.isConnected, true);
  t.is(child.isConnected, false);
  t.is(childTwo.isConnected, false);
});
