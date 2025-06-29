import anyTest, { TestFn } from 'ava';
import { Node } from '../../worker-thread/dom/Node.js';
import { Element } from '../../worker-thread/dom/Element.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  node: Element;
  child: Element;
  childTwo: Element;
  childThree: Element;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('div'),
    child: document.createElement('div'),
    childTwo: document.createElement('div'),
    childThree: document.createElement('div'),
  };
});

test('will not insert child when ref is not a direct child of Node', (t) => {
  const { node, child, childTwo } = t.context;
  t.is(node.insertBefore(child, childTwo), null);
});

test('will append child when ref is null or undefined', (t) => {
  const { node, child, childTwo } = t.context;
  t.is(node.insertBefore(child, undefined), child, 'inserting child before undefined ref returns the appended child');
  t.deepEqual(node.childNodes[0], child, 'child is appended when ref is undefined in insertBefore');
  t.is(node.insertBefore(childTwo, null), childTwo, 'inserting child before null ref returns the appended child');
  t.deepEqual(node.childNodes[1], childTwo, 'child is appended when ref is null in insertBefore');
});

test('will NOOP when requested to insert a child before the same child', (t) => {
  const { node, child } = t.context;
  const inserted: Node = node.insertBefore(child, null) as Node;
  t.is(node.childNodes.indexOf(child), 0);
  t.deepEqual(node.insertBefore(inserted, child), child, 'returns the child that passed as both arguments');
  t.is(node.childNodes.indexOf(child), 0, 'position of child inserted remains when Node.insertBefore');
});

test('will insert a child before ref', (t) => {
  const { node, child, childTwo } = t.context;
  node.insertBefore(child, null);
  t.deepEqual(node.insertBefore(childTwo, child), childTwo, 'will return childTwo inserted before child');
  t.is(node.childNodes.indexOf(childTwo), 0, 'childTwo was inserted before ref (child)');
});

test('will insert a child in the middle of Node.childNodes, when ref is later within Node.childNodes', (t) => {
  const { node, child, childTwo, childThree } = t.context;
  node.insertBefore(child, null);
  node.insertBefore(childTwo, null);
  t.deepEqual(node.insertBefore(childThree, childTwo), childThree);
  t.is(node.childNodes.indexOf(childThree), node.childNodes.indexOf(childTwo) - 1, 'childThree was inserted before childTwo');
});
