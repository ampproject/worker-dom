import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { HTMLAnchorElement } from '../../worker-thread/dom/HTMLAnchorElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLAnchorElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('a') as HTMLAnchorElement,
  };
});

testReflectedProperties([{ href: [''] }, { hreflang: [''] }, { media: [''] }, { target: [''] }, { type: [''] }]);
