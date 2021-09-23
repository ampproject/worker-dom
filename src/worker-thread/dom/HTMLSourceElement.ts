import { registerSubclass } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';

export class HTMLSourceElement extends HTMLElement {}
registerSubclass('source', HTMLSourceElement);

// Reflected Properties
// HTMLSourceElement.media => string, reflected attribute
// HTMLSourceElement.sizes => string, reflected attribute
// HTMLSourceElement.src => string, reflected attribute
// HTMLSourceElement.srcset => string, reflected attribute
// HTMLSourceElement.type => string, reflected attribute
reflectProperties([{ media: [''] }, { sizes: [''] }, { src: [''] }, { srcset: [''] }, { type: [''] }], HTMLSourceElement);

// Unimplemented Properties
// HTMLSourceElement.keySystem => string
