import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { HTMLElement } from '../../worker-thread/dom/HTMLElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  document: Document;
  element: HTMLElement;
  form: HTMLElement;
  intermediary: HTMLElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    document,
    element: document.createElement('label') as HTMLElement,
    form: document.createElement('form') as HTMLElement,
    intermediary: document.createElement('div') as HTMLElement,
  };
});

test('form should be null by default', (t) => {
  const { element } = t.context;

  t.is(element.form, null);
});

test('form should return direct parent when a child of a form', (t) => {
  const { element, form } = t.context;

  form.appendChild(element);
  t.is(element.form, form);
});

test('form should return only form parent when deeply nested', (t) => {
  const { element, form, intermediary } = t.context;

  form.appendChild(intermediary);
  intermediary.appendChild(element);
  t.is(element.form, form);
});

test('form should return closest form to the fieldset element', (t) => {
  const { document, element, form, intermediary } = t.context;
  const secondForm = document.createElement('form');

  secondForm.appendChild(form);
  form.appendChild(intermediary);
  intermediary.appendChild(element);
  t.is(element.form, form);
});

test('form should return null when there is no parent form element', (t) => {
  const { element, intermediary } = t.context;

  intermediary.appendChild(element);
  t.is(element.form, null);
});
