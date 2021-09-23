import anyTest, { TestInterface } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { HTMLFieldSetElement } from '../../worker-thread/dom/HTMLFieldSetElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLFieldSetElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('fieldset') as HTMLFieldSetElement,
  };
});

testReflectedProperties([{ name: [''] }, { disabled: [false] }]);
