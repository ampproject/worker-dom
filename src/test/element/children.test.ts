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

test('children should be an empty array when there are no childNodes', (t) => {
  const { node } = t.context;

  t.is(node.children.length, 0);
  t.deepEqual(node.children, []);
});

test('children should contain all childNodes when all are the correct NodeType', (t) => {
  const { node, child } = t.context;

  node.appendChild(child);
  t.is(node.children.length, 1);
  t.deepEqual(node.children, [child]);
});

test('children should contain only childNodes of NodeType.ELEMENT_NODE', (t) => {
  const { node, child, childTwo } = t.context;

  node.appendChild(child);
  node.appendChild(childTwo);
  t.is(node.children.length, 1);
  t.deepEqual(node.children, [child]);
});

test('children should be an empty array when there are no childNodes of NodeType.ELEMENT_NODE', (t) => {
  const { node, childTwo } = t.context;

  node.appendChild(childTwo);
  t.is(node.children.length, 0);
  t.deepEqual(node.children, []);
});
