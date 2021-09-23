import anyTest, { TestInterface } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { HTMLLabelElement } from '../../worker-thread/dom/HTMLLabelElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLLabelElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('label') as HTMLLabelElement,
  };
});

testReflectedProperties([{ htmlFor: ['', 'for'] }]);
