import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { HTMLEmbedElement } from '../../worker-thread/dom/HTMLEmbedElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLEmbedElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('embed') as HTMLEmbedElement,
  };
});

testReflectedProperties([{ height: [''] }, { src: [''] }, { type: [''] }, { width: [''] }]);
