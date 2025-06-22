import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { HTMLSelectElement } from '../../worker-thread/dom/HTMLSelectElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLSelectElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('select') as HTMLSelectElement,
  };
});

testReflectedProperties([{ multiple: [false] }, { name: [''] }, { required: [false] }]);
