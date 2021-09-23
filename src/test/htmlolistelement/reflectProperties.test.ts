import anyTest, { TestInterface } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { HTMLOListElement } from '../../worker-thread/dom/HTMLOListElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLOListElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('ol') as HTMLOListElement,
  };
});

testReflectedProperties([{ reversed: [false] }, { start: [1] }, { type: [''] }]);
