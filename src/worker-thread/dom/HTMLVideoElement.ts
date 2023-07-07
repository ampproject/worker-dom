import { registerSubclass } from './Element';
import { reflectProperties, registerListenableProperties } from './enhanceElement';
import { HTMLMediaElement } from './HTMLMediaElement';

export class HTMLVideoElement extends HTMLMediaElement {}

registerSubclass('video', HTMLVideoElement);

reflectProperties([{ poster: [''] }, { playsInline: [false] }, { width: [0] }, { height: [0] }], HTMLVideoElement);

registerListenableProperties(
  {
    videoWidth: 0,
    videoHeight: 0,
  },
  HTMLVideoElement,
);
