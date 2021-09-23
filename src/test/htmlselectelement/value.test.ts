import anyTest, { TestInterface } from 'ava';
import { HTMLOptionElement } from '../../worker-thread/dom/HTMLOptionElement';
import { Document } from '../../worker-thread/dom/Document';
import { HTMLSelectElement } from '../../worker-thread/dom/HTMLSelectElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  document: Document;
  select: HTMLSelectElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();
  const select = document.createElement('select') as HTMLSelectElement;

  t.context = {
    document,
    select,
  };
});

test('value should be an empty string by default', (t) => {
  const { select } = t.context;

  t.is(select.value, '');
});

test('value should be settable with string coercion', (t) => {
  const { document, select } = t.context;
  const option = document.createElement('option') as HTMLOptionElement;
  const optionTwo = document.createElement('option') as HTMLOptionElement;

  option.value = '1930';
  optionTwo.value = '1931';
  select.appendChild(option);
  select.appendChild(optionTwo);
  select.value = 1931;

  t.is(select.value, '1931');
  t.is(option.selected, false);
  t.is(optionTwo.selected, true);
});

test('singular select: value should be settable to invalid value', (t) => {
  const { document, select } = t.context;
  const option = document.createElement('option') as HTMLOptionElement;
  const optionTwo = document.createElement('option') as HTMLOptionElement;

  option.value = '1930';
  optionTwo.value = '1931';
  select.appendChild(option);
  select.appendChild(optionTwo);
  select.value = 'foo';

  t.is(select.value, '');
  t.is(option.selected, false);
  t.is(optionTwo.selected, false);
});

test('multiple select: value should be settable to invalid value', (t) => {
  const { document, select } = t.context;
  select.multiple = true;
  const option = document.createElement('option') as HTMLOptionElement;
  const optionTwo = document.createElement('option') as HTMLOptionElement;

  option.value = '1930';
  optionTwo.value = '1931';
  select.appendChild(option);
  select.appendChild(optionTwo);
  select.value = 'foo';

  t.is(select.value, '');
  t.is(option.selected, false);
  t.is(optionTwo.selected, false);
});

test('singular select: value should become the only option appended', (t) => {
  const { document, select } = t.context;
  const option = document.createElement('option') as HTMLOptionElement;

  option.value = '1930';
  select.appendChild(option);

  t.is(select.value, '1930');
  t.is(option.selected, true);
});

test('multiple select: value should become the only option appended', (t) => {
  const { document, select } = t.context;
  select.multiple = true;
  const option = document.createElement('option') as HTMLOptionElement;

  option.value = '1930';
  select.appendChild(option);

  t.is(select.value, '1930');
  t.is(option.selected, true);
});

test('singular select: value should become the first of many options appended', (t) => {
  const { document, select } = t.context;
  const option = document.createElement('option') as HTMLOptionElement;
  const optionTwo = document.createElement('option') as HTMLOptionElement;

  option.value = '1930';
  optionTwo.value = '1931';
  select.appendChild(option);
  select.appendChild(optionTwo);

  t.is(select.value, '1930');
  t.is(option.selected, true);
  t.is(optionTwo.selected, false);
});

test('multiple select: value should become the first of many options appended', (t) => {
  const { document, select } = t.context;
  select.multiple = true;
  const option = document.createElement('option') as HTMLOptionElement;
  const optionTwo = document.createElement('option') as HTMLOptionElement;

  option.value = '1930';
  optionTwo.value = '1931';
  select.appendChild(option);
  select.appendChild(optionTwo);

  t.is(select.value, '1930');
  t.is(option.selected, true);
  t.is(optionTwo.selected, false);
});

test('singular select: value should be overwritten by pre-selected option appended', (t) => {
  const { document, select } = t.context;
  const option = document.createElement('option') as HTMLOptionElement;
  const optionTwo = document.createElement('option') as HTMLOptionElement;

  option.value = '1930';
  optionTwo.value = '1931';
  optionTwo.selected = true;
  select.appendChild(option);
  select.appendChild(optionTwo);

  t.is(select.value, '1931');
  t.is(option.selected, false);
  t.is(optionTwo.selected, true);
});

test('multiple select: value should not be overwritten by pre-selected option appended', (t) => {
  const { document, select } = t.context;
  select.multiple = true;
  const option = document.createElement('option') as HTMLOptionElement;
  const optionTwo = document.createElement('option') as HTMLOptionElement;

  option.value = '1930';
  optionTwo.value = '1931';
  optionTwo.selected = true;
  select.appendChild(option);
  select.appendChild(optionTwo);

  t.is(select.value, '1930');
  t.is(option.selected, true);
  t.is(optionTwo.selected, true);
});

test('single select: value should be default when only option removed', (t) => {
  const { document, select } = t.context;
  const option = document.createElement('option') as HTMLOptionElement;

  option.value = '1930';
  select.appendChild(option);
  select.removeChild(option);

  t.is(select.value, '');
  t.is(option.selected, true);
});

test('multiple select: value should be default when only option removed', (t) => {
  const { document, select } = t.context;
  select.multiple = true;
  const option = document.createElement('option') as HTMLOptionElement;

  option.value = '1930';
  select.appendChild(option);
  select.removeChild(option);

  t.is(select.value, '');
  t.is(option.selected, true);
});

test('single select: value should be first option when selected value removed.', (t) => {
  const { document, select } = t.context;
  const option = document.createElement('option') as HTMLOptionElement;
  const optionTwo = document.createElement('option') as HTMLOptionElement;

  option.value = '1930';
  optionTwo.value = '1931';
  select.appendChild(option);
  select.appendChild(optionTwo);
  select.removeChild(option);

  t.is(select.value, '1931');
  t.is(option.selected, true);
  t.is(optionTwo.selected, true);
});

test('multple select: value should become the default when selected value removed.', (t) => {
  const { document, select } = t.context;
  select.multiple = true;
  const option = document.createElement('option') as HTMLOptionElement;
  const optionTwo = document.createElement('option') as HTMLOptionElement;

  option.value = '1930';
  optionTwo.value = '1931';
  select.appendChild(option);
  select.appendChild(optionTwo);
  select.removeChild(option);

  t.is(select.value, '');
  t.is(option.selected, true);
  t.is(optionTwo.selected, false);
});
