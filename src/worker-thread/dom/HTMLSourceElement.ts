import { registerSubclass } from './Element.js';
import { HTMLElement } from './HTMLElement.js';
import { reflectProperties } from './enhanceElement.js';

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
