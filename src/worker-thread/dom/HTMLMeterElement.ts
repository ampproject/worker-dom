import { registerSubclass } from './Element.js';
import { HTMLElement } from './HTMLElement.js';
import { reflectProperties } from './enhanceElement.js';
import { HTMLInputLabelsMixin } from './HTMLInputLabelsMixin.js';

export class HTMLMeterElement extends HTMLElement {}
registerSubclass('meter', HTMLMeterElement);
HTMLInputLabelsMixin(HTMLMeterElement);

// Reflected Properties
// HTMLMeterElement.high => number, reflected attribute
// HTMLMeterElement.low => number, reflected attribute
// HTMLMeterElement.max => number, reflected attribute
// HTMLMeterElement.min => number, reflected attribute
// HTMLMeterElement.optimum => number, reflected attribute
// HTMLMeterElement.value => number, reflected attribute
reflectProperties([{ high: [0] }, { low: [0] }, { max: [1] }, { min: [0] }, { optimum: [0] }, { value: [0] }], HTMLMeterElement);
