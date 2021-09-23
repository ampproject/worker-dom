import anyTest, { TestInterface } from 'ava';
import { HTMLOptionElement } from '../../worker-thread/dom/HTMLOptionElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  option: HTMLOptionElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    option: document.createElement('option') as HTMLOptionElement,
  };
});

test('selected should be false by default', (t) => {
  const { option } = t.context;

  t.is(option.selected, false);
});

test('selected should be settable to a boolean true value', (t) => {
  const { option } = t.context;

  option.selected = true;
  t.is(option.selected, true);
});

test('selected should be settable to a boolean false value', (t) => {
  const { option } = t.context;

  option.selected = false;
  t.is(option.selected, false);
});

test('selected should be settable to a string truthy value', (t) => {
  const { option } = t.context;

  option.selected = 'true';
  t.is(option.selected as unknown as boolean, true);
});

test('selected should be settable to a string falsy value', (t) => {
  const { option } = t.context;

  option.selected = 'false';
  t.is(option.selected as unknown as boolean, true, 'setting to falsy value causes selected to be true.');
});

test('selected should be settable to an empty string value', (t) => {
  const { option } = t.context;

  option.selected = '';
  t.is(option.selected as unknown as boolean, false, 'setting to an empty string forces the value to be false.');
});

test('selected should be settable to a number truthy value', (t) => {
  const { option } = t.context;

  option.selected = 1;
  t.is(option.selected as unknown as boolean, true);
});

test('selected should be settable to a number falsy value', (t) => {
  const { option } = t.context;

  option.selected = 0;
  t.is(option.selected as unknown as boolean, false);
});

test('selected should be settable to null', (t) => {
  const { option } = t.context;

  option.selected = null;
  t.is(option.selected as unknown as boolean, false);
});
