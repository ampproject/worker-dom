import anyTest, { TestFn } from 'ava';
import { Element } from '../../worker-thread/dom/Element.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
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

test('return false when node contains no children', (t) => {
  const { node } = t.context;

  t.is(node.hasChildNodes(), false);
});

test('return true when node contains a child', (t) => {
  const { node, child } = t.context;

  node.appendChild(child);
  t.is(node.hasChildNodes(), true);
});

test('return true when node contains multiple children', (t) => {
  const { node, child, childTwo } = t.context;

  node.appendChild(child);
  node.appendChild(childTwo);
  t.is(node.hasChildNodes(), true);
});
