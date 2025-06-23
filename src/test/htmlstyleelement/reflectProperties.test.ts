import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { HTMLStyleElement } from '../../worker-thread/dom/HTMLStyleElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLStyleElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('style') as HTMLStyleElement,
  };
});

testReflectedProperties([{ media: [''] }, { type: [''] }]);
