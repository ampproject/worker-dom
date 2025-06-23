import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { HTMLLabelElement } from '../../worker-thread/dom/HTMLLabelElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLLabelElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('label') as HTMLLabelElement,
  };
});

testReflectedProperties([{ htmlFor: ['', 'for'] }]);
