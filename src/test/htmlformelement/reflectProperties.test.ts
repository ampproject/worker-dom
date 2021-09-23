import anyTest, { TestInterface } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { HTMLFormElement } from '../../worker-thread/dom/HTMLFormElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
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
