import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { HTMLFormElement } from '../../worker-thread/dom/HTMLFormElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLFormElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('form') as HTMLFormElement,
  };
});

testReflectedProperties([
  { name: [''] },
  { method: ['get'] },
  { target: [''] },
  { action: [''] },
  { enctype: ['application/x-www-form-urlencoded'] },
  { acceptCharset: ['', 'accept-charset'] },
  { autocapitalize: ['sentences'] },
  { autocomplete: ['on'] },
]);
