import anyTest, { TestInterface } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { HTMLSelectElement } from '../../worker-thread/dom/HTMLSelectElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLSelectElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('select') as HTMLSelectElement,
  };
});

testReflectedProperties([{ multiple: [false] }, { name: [''] }, { required: [false] }]);
