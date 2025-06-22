import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { HTMLOListElement } from '../../worker-thread/dom/HTMLOListElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLOListElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('ol') as HTMLOListElement,
  };
});

testReflectedProperties([{ reversed: [false] }, { start: [1] }, { type: [''] }]);
