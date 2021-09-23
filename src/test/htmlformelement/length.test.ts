import anyTest, { TestInterface } from 'ava';
import { HTMLFormElement } from '../../worker-thread/dom/HTMLFormElement';
import { Element } from '../../worker-thread/dom/Element';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  form: HTMLFormElement;
  button: Element;
  buttonTwo: Element;
  fieldset: Element;
  input: Element;
  output: Element;
  select: Element;
  textarea: Element;
  div: Element;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    form: document.createElement('form') as HTMLFormElement,
    button: document.createElement('button'),
    buttonTwo: document.createElement('button'),
    fieldset: document.createElement('fieldset'),
    input: document.createElement('input'),
    output: document.createElement('output'),
    select: document.createElement('select'),
    textarea: document.createElement('textarea'),
    div: document.createElement('div'),
  };
});

test('length should be 0 by default', (t) => {
  const { form } = t.context;

  t.is(form.length, 0);
});

test('length should contain all valid elements', (t) => {
  const { form, button, fieldset, input, output, select, textarea } = t.context;

  form.appendChild(button);
  form.appendChild(fieldset);
  form.appendChild(input);
  form.appendChild(output);
  form.appendChild(select);
  form.appendChild(textarea);

  t.is(form.length, 6);
});

test('length should contain all valid elements, filtering invalid elements', (t) => {
  const { form, button, fieldset, input, output, select, textarea, div } = t.context;

  form.appendChild(button);
  form.appendChild(fieldset);
  form.appendChild(input);
  form.appendChild(output);
  form.appendChild(select);
  div.appendChild(textarea);
  form.appendChild(div);

  t.is(form.length, 6);
});
