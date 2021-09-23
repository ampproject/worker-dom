import anyTest, { TestInterface } from 'ava';
import { createTestingDocument } from '../DocumentCreation';
import { DocumentFragment } from '../../worker-thread/dom/DocumentFragment';
import { Element } from '../../worker-thread/dom/Element';
import { Text } from '../../worker-thread/dom/Text';

const test = anyTest as TestInterface<{
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

test('should return null when an Element does not have any childNodes.', (t) => {
  const { parentFragment } = t.context;

  t.is(parentFragment.firstElementChild, null);
});

test('should return the only child when only one Element is appended', (t) => {
  const { parentFragment, node } = t.context;

  parentFragment.appendChild(node);
  t.deepEqual(parentFragment.firstElementChild, node);
});

test('should return the first child when more than one Element is appended', (t) => {
  const { parentFragment, node, sibling } = t.context;

  parentFragment.appendChild(node);
  parentFragment.appendChild(sibling);
  t.deepEqual(parentFragment.firstElementChild, node);
});

test('should return the only Element in Node.childNodes, not another Node', (t) => {
  const { parentFragment, node, text } = t.context;

  parentFragment.appendChild(node);
  parentFragment.appendChild(text);
  t.deepEqual(parentFragment.firstElementChild, node);
});

test('should return null when an Element only contains Node childNodes', (t) => {
  const { parentFragment, text } = t.context;

  parentFragment.appendChild(text);
  t.is(parentFragment.firstElementChild, null);
});
