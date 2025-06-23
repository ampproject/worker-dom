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

test('should return 0 when no elements are appended', (t) => {
  const { parentFragment } = t.context;

  t.is(parentFragment.childElementCount, 0);
});

test('should return 1 when only one Element is appended', (t) => {
  const { parentFragment, node } = t.context;

  parentFragment.appendChild(node);
  t.is(parentFragment.childElementCount, 1);
});

test('should return only the number of Elements, not childNodes', (t) => {
  const { parentFragment, node, text } = t.context;

  parentFragment.appendChild(node);
  parentFragment.appendChild(text);
  t.is(parentFragment.childElementCount, 1);
});

test('should return 0 when an Element only contains Nodes of other types', (t) => {
  const { parentFragment, text } = t.context;

  parentFragment.appendChild(text);
  t.is(parentFragment.childElementCount, 0);
});
