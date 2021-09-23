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

test('should return 0 when no elements are appended', (t) => {
  const { node } = t.context;

  t.is(node.childElementCount, 0);
});

test('should return 1 when only one Element is appended', (t) => {
  const { node, child } = t.context;

  node.appendChild(child);
  t.is(node.childElementCount, 1);
});

test('should return only the number of Elements, not childNodes', (t) => {
  const { node, child, childTwo } = t.context;

  node.appendChild(child);
  node.appendChild(childTwo);
  t.is(node.childElementCount, 1);
});

test('should return 0 when an Element only contains Nodes of other types', (t) => {
  const { node, childTwo } = t.context;

  node.appendChild(childTwo);
  t.is(node.childElementCount, 0);
});
