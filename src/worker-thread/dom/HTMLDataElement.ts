import { registerSubclass } from './Element.js';
import { HTMLElement } from './HTMLElement.js';
import { reflectProperties } from './enhanceElement.js';

export class HTMLDataElement extends HTMLElement {}
registerSubclass('data', HTMLDataElement);

// Reflected properties, strings.
// HTMLEmbedElement.value => string, reflected attribute
reflectProperties([{ value: [''] }], HTMLDataElement);
