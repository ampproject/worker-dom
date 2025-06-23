import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { HTMLMeterElement } from '../../worker-thread/dom/HTMLMeterElement.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  element: HTMLMeterElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('meter') as HTMLMeterElement,
  };
});

testReflectedProperties([{ high: [0] }, { low: [0] }, { max: [1] }, { min: [0] }, { optimum: [0] }, { value: [0] }]);
