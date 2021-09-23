import { registerSubclass } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';

export class HTMLOListElement extends HTMLElement {}
registerSubclass('ol', HTMLOListElement);

// Reflected Properties
// HTMLModElement.reversed => boolean, reflected attribute
// HTMLModElement.start => number, reflected attribute
// HTMLOListElement.type => string, reflected attribute
reflectProperties([{ reversed: [false] }, { start: [1] }, { type: [''] }], HTMLOListElement);
