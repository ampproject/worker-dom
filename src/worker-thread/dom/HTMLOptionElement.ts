/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { registerSubclass, definePropertyBackedAttributes } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { transfer } from '../MutationTransfer';
import { Document } from './Document';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { store as storeString } from '../strings';
import { NumericBoolean } from '../../utils';

export class HTMLOptionElement extends HTMLElement {
  private [TransferrableKeys.selected]: boolean = false;
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement
   * @return position of the option within the list of options it's within, or zero if there is no valid parent.
   */
  get index(): number {
    return (this.parentNode && this.parentNode.children.indexOf(this)) || 0;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement
   * @return label attribute value or text content if there is no attribute.
   */
  get label(): string {
    return this.getAttribute('label') || this.textContent;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement
   * @param label new label value to store as an attribute.
   */
  set label(label: string) {
    this.setAttribute('label', label);
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement
   * @return boolean based on if the option element is selected.
   */
  get selected(): any {
    return this[TransferrableKeys.selected];
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement
   * @param value new selected boolean value.
   */
  set selected(value: any) {
    this[TransferrableKeys.selected] = !!value;
    transfer(this.ownerDocument as Document, [
      TransferrableMutationType.PROPERTIES,
      this[TransferrableKeys.index],
      storeString('selected'),
      NumericBoolean.TRUE,
      this[TransferrableKeys.selected] ? NumericBoolean.TRUE : NumericBoolean.FALSE,
    ]);
  }

  /**
   * A Synonym for the Node.textContent property getter.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement
   * @return value of text node direct child of this Element.
   */
  get text(): string {
    return this.textContent;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement
   * @param text new text content to store for this Element.
   */
  set text(text: string) {
    this.textContent = text;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement
   * @return value attribute value or text content if there is no attribute.
   */
  get value(): any {
    return this.getAttribute('value') || this.textContent;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement
   * @param value new value for an option element.
   */
  set value(value: any) {
    this.setAttribute('value', value);
  }
}
registerSubclass('option', HTMLOptionElement);
definePropertyBackedAttributes(HTMLOptionElement, {
  selected: [(el): string => String(el[TransferrableKeys.selected]), (el, value: string): boolean => (el.selected = value === 'true')],
});
// Reflected Properties
// HTMLOptionElement.defaultSelected => boolean, reflected attribute
// HTMLOptionElement.disabled => boolean, reflected attribute
// HTMLOptionElement.type => string, reflected attribute
reflectProperties([{ defaultSelected: [false, /* attr */ 'selected'] }, { disabled: [false] }, { type: [''] }], HTMLOptionElement);

// Implemented at HTMLElement
// HTMLOptionElement.form, Read only	=> HTMLFormElement
