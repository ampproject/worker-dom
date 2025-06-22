import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { HTMLSourceElement } from '../../worker-thread/dom/HTMLSourceElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLSourceElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('source') as HTMLSourceElement,
  };
});

testReflectedProperties([{ media: [''] }, { sizes: [''] }, { src: [''] }, { srcset: [''] }, { type: [''] }]);
