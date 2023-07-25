import anyTest, { TestInterface } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { HTMLImageElement } from '../../worker-thread/dom/HTMLImageElement';
import { createTestingDocument } from '../DocumentCreation';
import { testReflectedListenableProperty } from '../reflectListenablePropertiesHelper';

const test = anyTest as TestInterface<{
  element: HTMLImageElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('img') as HTMLImageElement,
  };
});

testReflectedProperties([
  { alt: [''] },
  { crossOrigin: [''] },
  { height: [0] },
  { isMap: [false] },
  { referrerPolicy: [''] },
  { src: [''] },
  { sizes: [''] },
  { srcset: [''] },
  { useMap: [''] },
  { width: [0] },
]);

testReflectedListenableProperty({
  naturalHeight: 0,
  naturalWidth: 0,
  complete: false,
});
