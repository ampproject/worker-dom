import anyTest, { TestInterface } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { HTMLStyleElement } from '../../worker-thread/dom/HTMLStyleElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLStyleElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('style') as HTMLStyleElement,
  };
});

testReflectedProperties([{ media: [''] }, { type: [''] }]);
