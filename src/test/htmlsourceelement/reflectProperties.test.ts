import anyTest, { TestInterface } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { HTMLSourceElement } from '../../worker-thread/dom/HTMLSourceElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLSourceElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('source') as HTMLSourceElement,
  };
});

testReflectedProperties([{ media: [''] }, { sizes: [''] }, { src: [''] }, { srcset: [''] }, { type: [''] }]);
