import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { HTMLQuoteElement } from '../../worker-thread/dom/HTMLQuoteElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLQuoteElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('blockquote') as HTMLQuoteElement,
  };
});

testReflectedProperties([{ cite: [''] }]);
