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

test('remove only child Node from parent', (t) => {
  const { node, child } = t.context;

  node.appendChild(child);
  node.removeChild(child);
  t.is(node.childNodes.length, 0, 'removing the only child from childNode[] makes childNodes have no members');
  t.is(child.parentNode, null, 'removed node has no parentNode');
});

test('remove child Node from parent with multiple children', (t) => {
  const { node, child, childTwo } = t.context;

  node.appendChild(child);
  node.appendChild(childTwo);
  node.removeChild(childTwo);
  t.is(node.childNodes.length, 1, 'childNodes have the correct length');
  t.deepEqual(node.childNodes[0], child, 'does not remove other children');
});
