import anyTest, { TestFn } from 'ava';
import { testReflectedProperty } from '../reflectPropertiesHelper.js';
import { HTMLButtonElement } from '../../worker-thread/dom/HTMLButtonElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLButtonElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('button') as HTMLButtonElement,
  };
});

testReflectedProperty({ disabled: [false] });
testReflectedProperty({ formAction: [''] }, 'hello');
testReflectedProperty({ formEnctype: [''] });
testReflectedProperty({ formMethod: [''] });
testReflectedProperty({ formTarget: [''] });
testReflectedProperty({ name: [''] });
testReflectedProperty({ type: ['submit'] });
testReflectedProperty({ value: [''] });
testReflectedProperty({ autofocus: [false] });
