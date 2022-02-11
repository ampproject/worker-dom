import anyTest, { TestInterface } from 'ava';
import { Comment } from '../../worker-thread/dom/Comment';
import { Element } from '../../worker-thread/dom/Element';
import { Text } from '../../worker-thread/dom/Text';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  node: Element;
  child: Element;
  childTwo: Element;
  textNode: Text;
  textNodeTwo: Text;
  commentNode: Comment;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('div'),
    child: document.createElement('div'),
    childTwo: document.createElement('div'),
    textNode: document.createTextNode('Hello world'),
    textNodeTwo: document.createTextNode('World'),
    commentNode: document.createComment('comment'),
  };
});

test('when a parent contains two children, the previous sibling of the second is the first', (t) => {
  const { node, child, childTwo } = t.context;

  node.appendChild(child);
  node.appendChild(childTwo);
  t.deepEqual(childTwo.previousSibling, child);
  t.deepEqual(childTwo.previousElementSibling, child);
});

test('when a node does not have a parent, its previous sibling is null', (t) => {
  const { node } = t.context;

  t.is(node.previousSibling, null);
  t.is(node.previousElementSibling, null);
});

test('when a node is the first child of a parent, the previous sibling is null', (t) => {
  const { node, child } = t.context;

  node.appendChild(child);
  t.is(child.previousSibling, null);
});

test('previousElementSibling skips over text nodes', (t) => {
  const { node, child, childTwo, textNode, textNodeTwo, commentNode } = t.context;

  node.appendChild(child);
  node.appendChild(commentNode);
  node.appendChild(textNode);
  node.appendChild(textNodeTwo);
  node.appendChild(childTwo);

  t.is(commentNode.previousElementSibling, child);
  t.is(textNode.previousElementSibling, child);
  t.is(textNodeTwo.previousElementSibling, child);
  t.is(childTwo.previousElementSibling, child);

  node.innerHTML = '';
  node.appendChild(textNode);
  node.appendChild(textNodeTwo);
  t.is(textNodeTwo.previousElementSibling, null);
});
