import anyTest, { TestFn } from 'ava';
import { testReflectedProperty } from '../reflectPropertiesHelper.js';
import { HTMLDataElement } from '../../worker-thread/dom/HTMLDataElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLDataElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('data') as HTMLDataElement,
  };
});

testReflectedProperty({ value: [''] });
