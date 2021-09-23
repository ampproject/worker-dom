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

test('autofocus should be false by default', (t) => {
  const { element } = t.context;

  t.is(element.autofocus, false);
});

test('autofocus should be settable to a single value', (t) => {
  const { element } = t.context;

  element.autofocus = true;
  t.is(element.autofocus, true);
});

test('autofocus property change should be reflected in attribute', (t) => {
  const { element } = t.context;

  element.autofocus = true;
  t.true(element.hasAttribute('autofocus'));

  element.autofocus = false;
  t.false(element.hasAttribute('autofocus'));
});

test('autofocus attribute change should be reflected in property', (t) => {
  const { element } = t.context;

  element.setAttribute('autofocus', '');
  t.true(element.autofocus);

  element.removeAttribute('autofocus');
  t.false(element.autofocus);
});
