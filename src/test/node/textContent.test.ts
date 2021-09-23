import anyTest, { TestInterface } from 'ava';
import { Text } from '../../worker-thread/dom/Text';
import { Element } from '../../worker-thread/dom/Element';
import { Document } from '../../worker-thread/dom/Document';
import { NodeType } from '../../transfer/TransferrableNodes';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  document: Document;
  node: Element;
  child: Element;
  nodeText: Text;
  childText: Text;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    document,
    node: document.createElement('div'),
    child: document.createElement('p'),
    nodeText: document.createTextNode('text in node'),
    childText: document.createTextNode(' text in child'),
  };
});

test('textContent getter returns empty string when there are no text childNodes.', (t) => {
  const { node } = t.context;

  t.is(node.textContent, '');
});

test('textContent getter returns the value of direct childNodes when there are no children', (t) => {
  const { node, nodeText } = t.context;

  node.appendChild(nodeText);
  t.is(node.textContent, nodeText.textContent);
  t.is(node.textContent, 'text in node');
});

test('textContent getter returns the value of all depths childNodes even when there are children with no textContent', (t) => {
  const { node, child, nodeText } = t.context;

  node.appendChild(nodeText);
  node.appendChild(child);
  t.is(node.textContent, nodeText.textContent);
  t.is(node.textContent, 'text in node');
});

test('textContent returns the value of all depths childNodes when there are children', (t) => {
  const { node, child, nodeText, childText } = t.context;

  child.appendChild(childText);
  node.appendChild(nodeText);
  node.appendChild(child);
  t.is(node.textContent, nodeText.textContent + childText.textContent);
  t.is(node.textContent, 'text in node text in child');
});

test('textContent setter removes other child element nodes', (t) => {
  const { node, child } = t.context;
  child.textContent = 'foo';
  node.appendChild(child);

  t.is(node.childNodes.length, 1);
  t.is(node.childNodes[0].nodeType, NodeType.ELEMENT_NODE);
  t.is(node.textContent, 'foo');
  node.textContent = 'bar';
  t.is(node.textContent, 'bar');
  t.is(node.childNodes.length, 1);
  t.is(node.childNodes[0].nodeType, NodeType.TEXT_NODE);
});

test('textContent setter removes other child text nodes', (t) => {
  const { node, document } = t.context;
  node.appendChild(document.createTextNode('f'));
  node.appendChild(document.createTextNode('o'));
  node.appendChild(document.createTextNode('o'));

  t.is(node.textContent, 'foo');
  t.is(node.childNodes.length, 3);
  node.textContent = '';
  t.is(node.textContent, '');
  t.is(node.childNodes.length, 1);
});
