import { Element, registerSubclass } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';
import { matchChildElement, tagNameConditionPredicate } from './matchElements';
import { Document } from './Document';

export class HTMLLabelElement extends HTMLElement {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control
   * @return input element
   */
  get control(): Element | null {
    const htmlFor = this.getAttribute('for');
    if (htmlFor !== null) {
      return this.ownerDocument && (this.ownerDocument as Document).getElementById(htmlFor);
    }
    return matchChildElement(this as Element, tagNameConditionPredicate(['INPUT']));
  }
}
registerSubclass('label', HTMLLabelElement);

// Reflected Properties
// HTMLLabelElement.htmlFor => string, reflected attribute 'for'
reflectProperties([{ htmlFor: ['', 'for'] }], HTMLLabelElement);
