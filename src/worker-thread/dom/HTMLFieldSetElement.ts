import { registerSubclass } from './Element.js';
import { reflectProperties } from './enhanceElement.js';
import { HTMLFormControlsCollectionMixin } from './HTMLFormControlsMixin.js';
import { HTMLElement } from './HTMLElement.js';
import { toLower } from '../../utils.js';

export class HTMLFieldSetElement extends HTMLElement {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFieldSetElement
   * @return hardcoded string 'fieldset'
   */
  get type(): string {
    return toLower(this.tagName);
  }
}
registerSubclass('fieldset', HTMLFieldSetElement);
HTMLFormControlsCollectionMixin(HTMLFieldSetElement);

// Reflected properties
// HTMLFieldSetElement.name => string, reflected attribute
// HTMLFieldSetElement.disabled => boolean, reflected attribute
reflectProperties([{ name: [''] }, { disabled: [false] }], HTMLFieldSetElement);

// Unimplemented properties
// HTMLFieldSetElement.validity
// HTMLFieldSetElement.willValidate
// HTMLFieldSetElement.validationMessage
