import anyTest, { TestInterface } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { createTestingDocument } from '../DocumentCreation';
import { testReflectedListenableProperty } from '../reflectListenablePropertiesHelper';
import { HTMLVideoElement } from '../../worker-thread/dom/HTMLVideoElement';

const test = anyTest as TestInterface<{
  element: HTMLVideoElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('video') as HTMLVideoElement,
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
  { poster: [''] },
  { playsInline: [false] },
  { width: [0] },
  { height: [0] },
]);

testReflectedListenableProperty({
  readyState: 0,
  duration: Number.NaN,
  currentSrc: '',
  seeking: false,
  seeked: false,
  videoWidth: 0,
  videoHeight: 0,
});
