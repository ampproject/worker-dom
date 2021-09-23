import { registerSubclass } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';

export class HTMLTableColElement extends HTMLElement {}
registerSubclass('col', HTMLTableColElement);

// Reflected Properties
// HTMLTableColElement.span => number, reflected attribute
reflectProperties([{ span: [1] }], HTMLTableColElement);
