import anyTest, { TestInterface } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { HTMLQuoteElement } from '../../worker-thread/dom/HTMLQuoteElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLQuoteElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('blockquote') as HTMLQuoteElement,
  };
});

testReflectedProperties([{ cite: [''] }]);
