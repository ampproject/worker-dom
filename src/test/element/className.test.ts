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

test('className should be empty by default', (t) => {
  const { node } = t.context;

  t.is(node.className, '');
});

test('className should be settable to a single value', (t) => {
  const { node } = t.context;

  node.className = 'foo';
  t.is(node.className, 'foo');
});

test('className should be settable to multiple values', (t) => {
  const { node } = t.context;

  node.className = 'foo bar baz';
  t.is(node.className, 'foo bar baz');
});
