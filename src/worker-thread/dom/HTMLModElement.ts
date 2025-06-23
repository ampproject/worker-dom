import { registerSubclass } from './Element.js';
import { HTMLElement } from './HTMLElement.js';
import { reflectProperties } from './enhanceElement.js';

export class HTMLModElement extends HTMLElement {}
registerSubclass('del', HTMLModElement);
registerSubclass('ins', HTMLModElement);

// Reflected Properties
// HTMLModElement.cite => string, reflected attribute
// HTMLModElement.datetime => string, reflected attribute
reflectProperties([{ cite: [''] }, { datetime: [''] }], HTMLModElement);
