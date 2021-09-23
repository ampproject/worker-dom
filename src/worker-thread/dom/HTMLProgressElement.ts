import { registerSubclass } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';
import { HTMLInputLabelsMixin } from './HTMLInputLabelsMixin';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';

export class HTMLProgressElement extends HTMLElement {
  private [TransferrableKeys.indeterminate]: boolean = true;
  private [TransferrableKeys.value]: number = 0;
  private dirtyValue: boolean = false;

  get position(): number {
    return this[TransferrableKeys.indeterminate] ? -1 : this.value / this.max;
  }

  get value(): number {
    return !this.dirtyValue ? Number(this.getAttribute('value')) || 0 : this[TransferrableKeys.value];
  }

  set value(value: number) {
    this[TransferrableKeys.indeterminate] = false;
    this[TransferrableKeys.value] = value;
    this.dirtyValue = true;
    // TODO(KB) This is a property mutation needing tracked.
  }
}
registerSubclass('progress', HTMLProgressElement);
HTMLInputLabelsMixin(HTMLProgressElement);

// Reflected Properties
// HTMLModElement.max => number, reflected attribute
reflectProperties([{ max: [1] }], HTMLProgressElement);
