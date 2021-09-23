import anyTest, { TestInterface } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { HTMLAnchorElement } from '../../worker-thread/dom/HTMLAnchorElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLAnchorElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('a') as HTMLAnchorElement,
  };
});

testReflectedProperties([{ href: [''] }, { hreflang: [''] }, { media: [''] }, { target: [''] }, { type: [''] }]);
