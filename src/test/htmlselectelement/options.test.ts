import anyTest, { TestFn } from 'ava';
import { Document } from '../../worker-thread/dom/Document.js';
import { HTMLSelectElement } from '../../worker-thread/dom/HTMLSelectElement.js';
import { HTMLOptionElement } from '../../worker-thread/dom/HTMLOptionElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
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

test('options returns empty array by default', (t) => {
  const { select } = t.context;

  t.deepEqual(select.options, []);
});

test('options returns singular array for single option child', (t) => {
  const { document, select } = t.context;
  const option = document.createElement('option') as HTMLOptionElement;

  select.appendChild(option);

  t.deepEqual(select.options, [option]);
});

test('options returns array for multiple option child', (t) => {
  const { document, select } = t.context;
  const option = document.createElement('option') as HTMLOptionElement;
  const optionTwo = document.createElement('option') as HTMLOptionElement;

  select.appendChild(option);
  select.appendChild(optionTwo);

  t.deepEqual(select.options, [option, optionTwo]);
});

test('options returns ordered array for multiple option child', (t) => {
  const { document, select } = t.context;
  const option = document.createElement('option') as HTMLOptionElement;
  const optionTwo = document.createElement('option') as HTMLOptionElement;

  select.appendChild(option);
  select.appendChild(optionTwo);
  select.removeChild(option);
  select.appendChild(option);

  t.deepEqual(select.options, [optionTwo, option]);
});
