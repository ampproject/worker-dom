import { registerSubclass } from './Element.js';
import { HTMLElement } from './HTMLElement.js';
import { reflectProperties } from './enhanceElement.js';

export class HTMLQuoteElement extends HTMLElement {}
registerSubclass('blockquote', HTMLQuoteElement);
registerSubclass('q', HTMLQuoteElement);

// Reflected Properties
// HTMLModElement.cite => string, reflected attribute
reflectProperties([{ cite: [''] }], HTMLQuoteElement);
