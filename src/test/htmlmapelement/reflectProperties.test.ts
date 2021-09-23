import anyTest, { TestInterface } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { HTMLMapElement } from '../../worker-thread/dom/HTMLMapElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLMapElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('map') as HTMLMapElement,
  };
});

testReflectedProperties([{ name: [''] }]);
