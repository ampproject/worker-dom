import { registerSubclass } from './Element';
import { HTMLMediaElement } from './HTMLMediaElement';

export class HTMLAudioElement extends HTMLMediaElement {}

registerSubclass('audio', HTMLAudioElement);
