// <blockquote> and <q>

import { registerSubclass } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';

export class HTMLTimeElement extends HTMLElement {}
registerSubclass('time', HTMLTimeElement);

// Reflected Properties
// HTMLTimeElement.dateTime => string, reflected attribute
reflectProperties([{ dateTime: [''] }], HTMLTimeElement);
