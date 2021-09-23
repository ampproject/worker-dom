import { registerSubclass } from './Element';
import { reflectProperties } from './enhanceElement';
import { HTMLFormControlsCollectionMixin } from './HTMLFormControlsMixin';
import { HTMLElement } from './HTMLElement';
import { toLower } from '../../utils';

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
