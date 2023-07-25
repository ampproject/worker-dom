import anyTest, { TestInterface } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { createTestingDocument } from '../DocumentCreation';
import { testReflectedListenableProperty } from '../reflectListenablePropertiesHelper';
import { HTMLAudioElement } from '../../worker-thread/dom/HTMLAudioElement';

const test = anyTest as TestInterface<{
  element: HTMLAudioElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('audio') as HTMLAudioElement,
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
});
