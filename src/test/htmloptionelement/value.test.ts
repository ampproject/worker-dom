import anyTest, { TestInterface } from 'ava';
import { HTMLOptionElement } from '../../worker-thread/dom/HTMLOptionElement';
import { Document } from '../../worker-thread/dom/Document';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  document: Document;
  option: HTMLOptionElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();
  const option = document.createElement('option') as HTMLOptionElement;

  t.context = {
    document,
    option,
  };
});

test('value should be an empty string by default', (t) => {
  const { option } = t.context;

  t.is(option.value, '');
});

test('value should be settable with string coercion', (t) => {
  const { option } = t.context;

  option.value = '1931';
  t.is(option.value, '1931');

  option.value = 1930;
  t.is(option.value, '1930');

  option.value = false;
  t.is(option.value, 'false');

  option.value = null;
  t.is(option.value, 'null');
});
