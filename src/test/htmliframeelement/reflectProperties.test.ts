import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { HTMLIFrameElement } from '../../worker-thread/dom/HTMLIFrameElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLIFrameElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('iframe') as HTMLIFrameElement,
  };
});

testReflectedProperties([
  { allow: [''] },
  { allowFullscreen: [false] },
  { csp: [''] },
  { height: [''] },
  { name: [''] },
  { referrerPolicy: [''] },
  { src: [''] },
  { srcdoc: [''] },
  { width: [''] },
]);
