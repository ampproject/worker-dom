import anyTest, { TestInterface } from 'ava';
import { HTMLElement } from '../../worker-thread/dom/HTMLElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();
  t.context = {
    element: document.createElement('div') as HTMLElement,
  };
});

test('translate should be true by default', (t) => {
  const { element } = t.context;

  t.is(element.translate, true);
});

test('translate should be settable to a single value', (t) => {
  const { element } = t.context;

  element.translate = false;
  t.is(element.translate, false);
});

test('translate property change should be reflected in attribute', (t) => {
  const { element } = t.context;

  element.translate = false;
  t.is(element.getAttribute('translate'), 'no');

  element.translate = true;
  t.is(element.getAttribute('translate'), 'yes');
});

test('translate attribute change should be reflected in property', (t) => {
  const { element } = t.context;

  element.setAttribute('translate', 'yes');
  t.is(element.translate, true);

  element.setAttribute('translate', 'no');
  t.is(element.translate, false);
});
