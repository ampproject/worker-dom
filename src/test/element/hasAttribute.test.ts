import anyTest, { TestInterface } from 'ava';
import { Element } from '../../worker-thread/dom/Element';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  node: Element;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('div'),
  };
});

test('hasAttribute is false by default', (t) => {
  const { node } = t.context;

  t.is(node.hasAttribute('class'), false);
});

test('hasAttribute is true, when attribute is added', (t) => {
  const { node } = t.context;

  node.setAttribute('data-foo', 'bar');
  t.is(node.hasAttribute('data-foo'), true);
});

test('hasAttribute is true, when empty className is added', (t) => {
  const { node } = t.context;

  node.className = '';
  t.is(node.hasAttribute('class'), true);
});

test('hasAttribute is true, when valid className is added', (t) => {
  const { node } = t.context;

  node.className = 'foo';
  t.is(node.hasAttribute('class'), true);
});

test('hasAttribute is true, when DOMTokenList is set to empty string', (t) => {
  const { node } = t.context;

  node.classList.value = '';
  t.is(node.hasAttribute('class'), true);
});

test('hasAttribute is true when last value is removed from DOMTokenList driven attribute', (t) => {
  const { node } = t.context;

  node.classList.value = 'foo';
  node.classList.toggle('foo');
  t.is(node.hasAttribute('class'), true);
});
