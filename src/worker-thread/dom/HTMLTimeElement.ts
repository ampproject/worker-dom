// <blockquote> and <q>

import { registerSubclass } from './Element.js';
import { HTMLElement } from './HTMLElement.js';
import { reflectProperties } from './enhanceElement.js';

export class HTMLTimeElement extends HTMLElement {}
registerSubclass('time', HTMLTimeElement);

// Reflected Properties
// HTMLTimeElement.dateTime => string, reflected attribute
reflectProperties([{ dateTime: [''] }], HTMLTimeElement);
