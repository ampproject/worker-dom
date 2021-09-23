import anyTest, { TestInterface } from 'ava';
import { Element } from '../../worker-thread/dom/Element';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  node: Element;
  child: Element;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('div'),
    child: document.createElement('div'),
  };
});

test('removes child Node from parent', (t) => {
  const { node, child } = t.context;

  node.appendChild(child);
  child.remove();
  t.is(node.childNodes.length, 0, 'removing a node from a known parent reduces Parent.childNodes[].length by 1');
  t.is(child.parentNode, null, 'removing a node makes the child have a null parentNode');
});

test('removes Node without parent', (t) => {
  const { node } = t.context;

  node.remove();
  t.pass('removing a node without a parent does not error');
});
