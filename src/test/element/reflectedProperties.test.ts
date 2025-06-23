import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { Element } from '../../worker-thread/dom/Element.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: Element;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('div'),
  };
});

testReflectedProperties([{ id: [''] }]);
