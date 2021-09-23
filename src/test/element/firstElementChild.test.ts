import anyTest, { TestInterface } from 'ava';
import { Element } from '../../worker-thread/dom/Element';
import { Text } from '../../worker-thread/dom/Text';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  node: Element;
  child: Element;
  childTwo: Text;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('div'),
    child: document.createElement('div'),
    childTwo: document.createTextNode(''),
  };
});

test('should return null when an Element does not have any childNodes.', (t) => {
  const { node } = t.context;

  t.is(node.firstElementChild, null);
});

test('should return the only child when only one Element is appended', (t) => {
  const { node, child } = t.context;

  node.appendChild(child);
  t.deepEqual(node.firstElementChild, child);
});

test('should return the only Element in Node.childNodes, not another Node', (t) => {
  const { node, child, childTwo } = t.context;

  node.appendChild(childTwo);
  node.appendChild(child);
  t.deepEqual(node.firstElementChild, child);
});

test('should return null when an Element only contains Node childNodes', (t) => {
  const { node, childTwo } = t.context;

  node.appendChild(childTwo);
  t.is(node.firstElementChild, null);
});
