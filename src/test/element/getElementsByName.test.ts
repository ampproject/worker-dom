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
    childTwo: document.createElement('p'),
  };
});

test('single direct child with matching name', (t) => {
  const { node, child } = t.context;

  child.setAttribute('name', 'foo');
  node.appendChild(child);

  t.is(node.getElementsByName('foo').length, 1);
  t.is(node.getElementsByName('bar').length, 0);
  t.deepEqual(node.getElementsByName('foo'), [child]);
});

test('single direct child, calling with name null', (t) => {
  const { node, child } = t.context;
  node.appendChild(child);

  t.is(node.getElementsByName(null).length, 0);
  t.is(node.getElementsByName('null').length, 0);

  child.setAttribute('name', null);
  t.is(node.getElementsByName(null).length, 1);
  t.is(node.getElementsByName('null').length, 1);
  t.deepEqual(node.getElementsByName(null), [child]);
  t.deepEqual(node.getElementsByName('null'), [child]);

  child.setAttribute('name', 'null');
  t.is(node.getElementsByName(null).length, 1);
  t.is(node.getElementsByName('null').length, 1);
  t.deepEqual(node.getElementsByName(null), [child]);
  t.deepEqual(node.getElementsByName('null'), [child]);
});

test('multiple direct children with matching name', (t) => {
  const { node, child, childTwo } = t.context;

  child.setAttribute('name', 'foo');
  childTwo.setAttribute('name', 'foo');
  node.appendChild(child);
  node.appendChild(childTwo);

  t.is(node.getElementsByName('foo').length, 2);
  t.is(node.getElementsByName('bar').length, 0);
  t.deepEqual(node.getElementsByName('foo'), [child, childTwo]);
});

test('tree with depth > 1, multiple matches', (t) => {
  const { node, child, childTwo } = t.context;

  child.setAttribute('name', 'foo');
  childTwo.setAttribute('name', 'foo');
  child.appendChild(childTwo);
  node.appendChild(child);

  t.is(node.getElementsByName('foo').length, 2);
  t.is(node.getElementsByName('bar').length, 0);
  t.deepEqual(node.getElementsByName('foo'), [child, childTwo]);
});

test('tree with depth > 1, singular match', (t) => {
  const { node, child, childTwo } = t.context;

  childTwo.setAttribute('name', 'foo');
  child.appendChild(childTwo);
  node.appendChild(child);

  t.is(node.getElementsByName('foo').length, 1);
  t.is(node.getElementsByName('bar').length, 0);
  t.deepEqual(node.getElementsByName('foo'), [childTwo]);
});
