import anyTest, { TestInterface } from 'ava';
import { Element } from '../../worker-thread/dom/Element';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
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
    childTwo: document.createElement('p'),
    childThree: document.createElement('p'),
  };
});

test('single direct child', (t) => {
  const { node, child } = t.context;

  node.appendChild(child);

  t.is(node.getElementsByTagName('div').length, 1);
  t.is(node.getElementsByTagName('*').length, 1);
  t.is(node.getElementsByTagName('p').length, 0);
  t.deepEqual(node.getElementsByTagName('div'), [child]);
  t.deepEqual(node.getElementsByTagName('*'), [child]);
});

test('multiple direct children', (t) => {
  const { node, child, childTwo } = t.context;

  node.appendChild(child);
  node.appendChild(childTwo);

  t.is(node.getElementsByTagName('div').length, 1);
  t.is(node.getElementsByTagName('p').length, 1);
  t.is(node.getElementsByTagName('*').length, 2);
  t.is(node.getElementsByTagName('amp-state').length, 0);
  t.deepEqual(node.getElementsByTagName('div'), [child]);
  t.deepEqual(node.getElementsByTagName('p'), [childTwo]);
  t.deepEqual(node.getElementsByTagName('*'), [child, childTwo]);
});

test('tree with depth > 1', (t) => {
  const { node, child, childTwo, childThree } = t.context;

  child.appendChild(childTwo);
  child.appendChild(childThree);
  node.appendChild(child);

  t.is(node.getElementsByTagName('div').length, 1);
  t.is(node.getElementsByTagName('p').length, 2);
  t.is(node.getElementsByTagName('*').length, 3);
  t.is(node.getElementsByTagName('amp-state').length, 0);
  t.deepEqual(node.getElementsByTagName('div'), [child]);
  t.deepEqual(node.getElementsByTagName('p'), [childTwo, childThree]);
  t.deepEqual(node.getElementsByTagName('*'), [child, childTwo, childThree]);
});
