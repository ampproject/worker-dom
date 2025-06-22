import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { HTMLProgressElement } from '../../worker-thread/dom/HTMLProgressElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLProgressElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('progress') as HTMLProgressElement,
  };
});

testReflectedProperties([{ max: [1] }]);
