import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { HTMLOptionElement } from '../../worker-thread/dom/HTMLOptionElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLOptionElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('option') as HTMLOptionElement,
  };
});
testReflectedProperties([{ defaultSelected: [false, 'selected'] }, { disabled: [false] }, { type: [''] }]);
