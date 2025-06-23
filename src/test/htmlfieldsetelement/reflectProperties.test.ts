import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { HTMLFieldSetElement } from '../../worker-thread/dom/HTMLFieldSetElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLFieldSetElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('fieldset') as HTMLFieldSetElement,
  };
});

testReflectedProperties([{ name: [''] }, { disabled: [false] }]);
