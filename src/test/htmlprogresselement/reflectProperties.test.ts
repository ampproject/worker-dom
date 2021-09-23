import anyTest, { TestInterface } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { HTMLProgressElement } from '../../worker-thread/dom/HTMLProgressElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLProgressElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('progress') as HTMLProgressElement,
  };
});

testReflectedProperties([{ max: [1] }]);
