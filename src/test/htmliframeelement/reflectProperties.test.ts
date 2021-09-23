import anyTest, { TestInterface } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { HTMLIFrameElement } from '../../worker-thread/dom/HTMLIFrameElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLIFrameElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('iframe') as HTMLIFrameElement,
  };
});

testReflectedProperties([
  { allow: [''] },
  { allowFullscreen: [false] },
  { csp: [''] },
  { height: [''] },
  { name: [''] },
  { referrerPolicy: [''] },
  { src: [''] },
  { srcdoc: [''] },
  { width: [''] },
]);
