import anyTest, { TestInterface } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { createTestingDocument } from '../DocumentCreation';
import { testReflectedListenableProperty } from '../reflectListenablePropertiesHelper';
import { HTMLMediaElement } from '../../worker-thread/dom/HTMLMediaElement';

const test = anyTest as TestInterface<{
  element: HTMLMediaElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('media') as HTMLMediaElement,
  };
});

testReflectedProperties([
  { autoplay: [false] },
  { controls: [false] },
  { crossOrigin: [''] },
  { disableRemotePlayback: [false] },
  { preload: [''] },
  { preservesPitch: [false] },
  { src: [''] },
]);

testReflectedListenableProperty({
  readyState: 0,
  duration: Number.NaN,
  currentSrc: '',
  seeking: false,
  seeked: false,
});
