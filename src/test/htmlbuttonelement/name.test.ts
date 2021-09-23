import anyTest, { TestInterface } from 'ava';
import { HTMLButtonElement } from '../../worker-thread/dom/HTMLButtonElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLButtonElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('button') as HTMLButtonElement,
  };
});

test('name should be empty by default', (t) => {
  const { element } = t.context;

  t.is(element.name, '');
});

test('name should be settable to a single value', (t) => {
  const { element } = t.context;

  element.name = 'awesome-button';
  t.is(element.name, 'awesome-button');
});

test('name property change should be reflected in attribute', (t) => {
  const { element } = t.context;

  element.name = 'awesome-button';
  t.is(element.getAttribute('name'), 'awesome-button');
});

test('name attribute change should be reflected in property', (t) => {
  const { element } = t.context;

  element.setAttribute('name', 'awesome-button');
  t.is(element.name, 'awesome-button');
});
