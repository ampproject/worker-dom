import anyTest, { TestFn } from 'ava';
import { createTestingDocument } from '../DocumentCreation.js';
import { Text } from '../../worker-thread/dom/Text.js';
import { DocumentFragment } from '../../worker-thread/dom/DocumentFragment.js';
import { Element } from '../../worker-thread/dom/Element.js';

const test = anyTest as TestFn<{
  parentFragment: DocumentFragment;
  node: Element;
  sibling: Element;
  text: Text;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    parentFragment: document.createDocumentFragment(),
    node: document.createElement('div'),
    sibling: document.createElement('div'),
    text: document.createTextNode('text'),
  };
});

test('children should be an empty array when there are no childNodes', (t) => {
  const { parentFragment } = t.context;

  t.is(parentFragment.children.length, 0);
  t.deepEqual(parentFragment.children, []);
});

test('children should contain all childNodes when all are the correct NodeType', (t) => {
  const { parentFragment, node } = t.context;

  parentFragment.appendChild(node);
  t.is(parentFragment.children.length, 1);
  t.deepEqual(parentFragment.children, [node]);
});

test('children should contain only childNodes of NodeType.ELEMENT_NODE', (t) => {
  const { parentFragment, node, text } = t.context;

  parentFragment.appendChild(node);
  parentFragment.appendChild(text);
  t.is(parentFragment.children.length, 1);
  t.deepEqual(parentFragment.children, [node]);
});

test('children should be an empty array when there are no childNodes of NodeType.ELEMENT_NODE', (t) => {
  const { parentFragment, text } = t.context;

  parentFragment.appendChild(text);
  t.is(parentFragment.children.length, 0);
  t.deepEqual(parentFragment.children, []);
});
