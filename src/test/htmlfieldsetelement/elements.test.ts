import anyTest, { TestFn } from 'ava';
import { HTMLFieldSetElement } from '../../worker-thread/dom/HTMLFieldSetElement.js';
import { Element } from '../../worker-thread/dom/Element.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLFieldSetElement;
  button: Element;
  buttonTwo: Element;
  fieldset: HTMLFieldSetElement;
  input: Element;
  output: Element;
  select: Element;
  textarea: Element;
  div: Element;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('fieldset') as HTMLFieldSetElement,
    button: document.createElement('button'),
    buttonTwo: document.createElement('button'),
    fieldset: document.createElement('fieldset') as HTMLFieldSetElement,
    input: document.createElement('input'),
    output: document.createElement('output'),
    select: document.createElement('select'),
    textarea: document.createElement('textarea'),
    div: document.createElement('div'),
  };
});

test('elements should be empty by default', (t) => {
  const { element } = t.context;

  t.deepEqual(element.elements, []);
});

test('elements should contain a button element', (t) => {
  const { element, button } = t.context;

  element.appendChild(button);
  t.deepEqual(element.elements, [button]);
});

test('elements should contain two button elements', (t) => {
  const { element, button, buttonTwo } = t.context;

  element.appendChild(button);
  element.appendChild(buttonTwo);
  t.deepEqual(element.elements, [button, buttonTwo]);
});

test('elements should contain button element deeply nested, filtering invalid childNodes', (t) => {
  const { element, button, div } = t.context;

  div.appendChild(button);
  element.appendChild(div);
  // Quick note: .elements getter returns only a small subset of elements with specific tagNames.
  // See HTMLFormControlsMixin for the implementation.
  t.deepEqual(element.elements, [button]);
});

test('elements should contain all valid elements, filtering invalid childNodes', (t) => {
  const { element, button, fieldset, input, output, select, textarea, div } = t.context;

  element.appendChild(button);
  element.appendChild(fieldset);
  element.appendChild(input);
  element.appendChild(output);
  element.appendChild(select);
  element.appendChild(textarea);
  element.appendChild(div);

  t.deepEqual(element.elements, [button, fieldset, input, output, select, textarea]);
  t.is(element.elements.length, 6);
});
