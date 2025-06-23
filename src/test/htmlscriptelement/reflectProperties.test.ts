import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { HTMLScriptElement } from '../../worker-thread/dom/HTMLScriptElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLScriptElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('script') as HTMLScriptElement,
  };
});

testReflectedProperties([
  { type: [''] },
  { src: [''] },
  { charset: [''] },
  { async: [false] },
  { defer: [false] },
  { crossOrigin: [''] },
  { noModule: [false] },
]);
