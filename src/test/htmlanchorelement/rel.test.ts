import anyTest, { TestFn } from 'ava';
import { HTMLAnchorElement } from '../../worker-thread/dom/HTMLAnchorElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLAnchorElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('a') as HTMLAnchorElement,
  };
});

test('rel should be empty by default', (t) => {
  const { element } = t.context;

  t.is(element.rel, '');
});

test('rel should be settable to a single value', (t) => {
  const { element } = t.context;

  element.rel = 'next';
  t.is(element.rel, 'next');
});

test('rel property change should be reflected in attribute', (t) => {
  const { element } = t.context;

  element.rel = 'next';
  t.is(element.getAttribute('rel'), 'next');
});

test('rel attribute change should be reflected in property', (t) => {
  const { element } = t.context;

  element.setAttribute('rel', 'next');
  t.is(element.rel, 'next');
});
