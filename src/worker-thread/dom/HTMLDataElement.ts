import { registerSubclass } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';

export class HTMLDataElement extends HTMLElement {}
registerSubclass('data', HTMLDataElement);

// Reflected properties, strings.
// HTMLEmbedElement.value => string, reflected attribute
reflectProperties([{ value: [''] }], HTMLDataElement);
