import { registerSubclass } from './Element.js';
import { HTMLElement } from './HTMLElement.js';
import { reflectProperties } from './enhanceElement.js';

export class HTMLTableColElement extends HTMLElement {}
registerSubclass('col', HTMLTableColElement);

// Reflected Properties
// HTMLTableColElement.span => number, reflected attribute
reflectProperties([{ span: [1] }], HTMLTableColElement);
