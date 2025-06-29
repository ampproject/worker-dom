import anyTest, { TestFn } from 'ava';
import { Element } from '../../worker-thread/dom/Element.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
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

test('single direct child with one classname', (t) => {
  const { node, child } = t.context;

  child.className = 'foo';
  node.appendChild(child);

  t.is(node.getElementsByClassName('foo').length, 1);
  t.is(node.getElementsByClassName('bar').length, 0);
  t.deepEqual(node.getElementsByClassName('foo'), [child]);
});

test('multiple direct children with two classnames', (t) => {
  const { node, child } = t.context;

  child.className = 'foo bar';
  node.appendChild(child);

  t.is(node.getElementsByClassName('foo bar').length, 1);
  t.is(node.getElementsByClassName('foo').length, 1);
  t.is(node.getElementsByClassName('bar').length, 1);
  t.is(node.getElementsByClassName('baz').length, 0);
  t.deepEqual(node.getElementsByClassName('foo bar'), [child]);
  t.deepEqual(node.getElementsByClassName('foo'), [child]);
  t.deepEqual(node.getElementsByClassName('bar'), [child]);
});

test('tree with depth > 1', (t) => {
  const { node, child, childTwo } = t.context;

  childTwo.className = child.className = 'foo';
  child.appendChild(childTwo);
  node.appendChild(child);

  t.is(node.getElementsByClassName('foo').length, 2);
  t.is(node.getElementsByClassName('bar').length, 0);
  t.deepEqual(node.getElementsByClassName('foo'), [child, childTwo]);
});
