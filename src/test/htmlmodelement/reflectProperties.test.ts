import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { HTMLModElement } from '../../worker-thread/dom/HTMLModElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLModElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('del') as HTMLModElement,
  };
});

testReflectedProperties([{ cite: [''] }, { datetime: [''] }]);
