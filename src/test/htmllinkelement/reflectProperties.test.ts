import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { HTMLLinkElement } from '../../worker-thread/dom/HTMLLinkElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLLinkElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('link') as HTMLLinkElement,
  };
});

testReflectedProperties([
  { as: [''] },
  { crossOrigin: [''] },
  { disabled: [false] },
  { href: [''] },
  { hreflang: [''] },
  { media: [''] },
  { referrerPolicy: [''] },
  { sizes: [''] },
  { type: [''] },
]);
