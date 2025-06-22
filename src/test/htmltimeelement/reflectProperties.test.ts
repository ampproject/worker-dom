import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { HTMLTimeElement } from '../../worker-thread/dom/HTMLTimeElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLTimeElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('time') as HTMLTimeElement,
  };
});

testReflectedProperties([{ dateTime: [''] }]);
