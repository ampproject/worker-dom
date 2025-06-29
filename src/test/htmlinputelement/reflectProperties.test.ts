import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { HTMLInputElement } from '../../worker-thread/dom/HTMLInputElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLInputElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('input') as HTMLInputElement,
  };
});

testReflectedProperties([
  { accept: [''] },
  { alt: [''] },
  { autocapitalize: [''] },
  { autocomplete: [''] },
  { autofocus: [false] },
  { defaultChecked: [false, 'checked'] },
  { defaultValue: ['', 'value'] },
  { dirName: [''] },
  { disabled: [false] },
  { formAction: [''] },
  { formEncType: [''] },
  { formMethod: [''] },
  { formTarget: [''] },
  { height: [0] },
  { max: [''] },
  { maxLength: [0] },
  { min: [''] },
  { multiple: [false] },
  { name: [''] },
  { pattern: [''] },
  { placeholder: [''] },
  { readOnly: [false] },
  { required: [false] },
  { size: [0] },
  { src: [''] },
  { step: [''] },
  { type: ['text'] },
  { width: [0] },
]);
