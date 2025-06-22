import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { HTMLImageElement } from '../../worker-thread/dom/HTMLImageElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLImageElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('img') as HTMLImageElement,
  };
});

testReflectedProperties([
  { alt: [''] },
  { crossOrigin: [''] },
  { height: [0] },
  { isMap: [false] },
  { referrerPolicy: [''] },
  { src: [''] },
  { sizes: [''] },
  { srcset: [''] },
  { useMap: [''] },
  { width: [0] },
]);
