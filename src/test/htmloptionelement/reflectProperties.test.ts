import anyTest, { TestInterface } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { HTMLOptionElement } from '../../worker-thread/dom/HTMLOptionElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLOptionElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('option') as HTMLOptionElement,
  };
});
testReflectedProperties([{ defaultSelected: [false, 'selected'] }, { disabled: [false] }, { type: [''] }]);
