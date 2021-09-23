import { registerSubclass } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';

export class HTMLQuoteElement extends HTMLElement {}
registerSubclass('blockquote', HTMLQuoteElement);
registerSubclass('q', HTMLQuoteElement);

// Reflected Properties
// HTMLModElement.cite => string, reflected attribute
reflectProperties([{ cite: [''] }], HTMLQuoteElement);
