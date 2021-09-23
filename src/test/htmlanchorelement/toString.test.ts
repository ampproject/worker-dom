import anyTest, { TestInterface } from 'ava';
import { HTMLAnchorElement } from '../../worker-thread/dom/HTMLAnchorElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLAnchorElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('a') as HTMLAnchorElement,
  };
});

test('toString should be empty by default', (t) => {
  const { element } = t.context;

  t.is(element.toString(), '');
});

test('toString should return href after property change', (t) => {
  const { element } = t.context;

  element.href = 'https://www.ampbyexample.com';
  t.is(element.toString(), 'https://www.ampbyexample.com');
});
