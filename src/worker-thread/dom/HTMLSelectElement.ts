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

import { registerSubclass, Element } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';
import { HTMLInputLabelsMixin } from './HTMLInputLabelsMixin';
import { matchChildrenElements, matchChildElement, tagNameConditionPredicate } from './matchElements';
import { HTMLOptionElement } from './HTMLOptionElement';

const isOptionPredicate = tagNameConditionPredicate(['option']);
const isSelectedOptionPredicate = (element: Element): boolean => element.tagName === 'option' && (element as HTMLOptionElement).selected;

const enum SizeDefaults {
  SINGLE = 1,
  MULTIPLE = 4,
  UNMODIFIED = -1,
}

const enum TypeDefaults {
  SINGLE = 'select-multiple',
  MULTIPLE = 'select-one',
}

export class HTMLSelectElement extends HTMLElement {
  private _size_: number = SizeDefaults.UNMODIFIED;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/length
   * @return number of controls in the form
   */
  get length(): number {
    return matchChildrenElements(this, isOptionPredicate).length;
  }

  /**
   * Getter returning option elements that are direct children of a HTMLSelectElement
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement
   * @return Element "options" objects that are direct children.
   */
  get options(): Array<Element> {
    return this.children.filter(isOptionPredicate);
  }

  /**
   * Getter returning the index of the first selected <option> element.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/selectedIndex
   * @return the index of the first selected option element, or -1 if no element is selected.
   */
  get selectedIndex(): number {
    const firstSelectedChild = matchChildElement(this, isSelectedOptionPredicate);
    return firstSelectedChild ? this.children.indexOf(firstSelectedChild) : -1;
  }

  /**
   * Setter making the <option> element at the passed index selected.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/selectedIndex
   * @param selectedIndex index number to make selected.
   */
  set selectedIndex(selectedIndex: number) {
    this.children.forEach((element: Element, index: number) => {
      element.selected = index === selectedIndex;
    });
  }

  /**
   * Getter returning the <option> elements selected.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/selectedOptions
   * @return array of Elements currently selected.
   */
  get selectedOptions(): Array<Element> {
    return matchChildrenElements(this, isSelectedOptionPredicate);
  }

  /**
   * Getter returning the size of the select element (by default 1 for single and 4 for multiple)
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement
   * @return size of the select element.
   */
  get size(): number {
    return this._size_ === SizeDefaults.UNMODIFIED ? (this.multiple ? SizeDefaults.MULTIPLE : SizeDefaults.SINGLE) : this._size_;
  }

  /**
   * Override the size of this element (each positive unit is the height of a single option)
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement
   * @param size number to set the size to.
   */
  set size(size: number) {
    this._size_ = size > 0 ? size : this.multiple ? SizeDefaults.MULTIPLE : SizeDefaults.SINGLE;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement
   * @return string representing the select element type.
   */
  get type(): string {
    return this.multiple ? TypeDefaults.MULTIPLE : TypeDefaults.SINGLE;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement
   * @return the value of the first selected option
   */
  get value(): string {
    const firstSelectedChild = matchChildElement(this, isSelectedOptionPredicate);
    return firstSelectedChild ? (firstSelectedChild as HTMLOptionElement).value : '';
  }
}
registerSubclass('select', HTMLSelectElement);
HTMLInputLabelsMixin(HTMLSelectElement);

// Reflected Properties
// HTMLSelectElement.multiple => boolean, reflected attribute
// HTMLSelectElement.name => string, reflected attribute
// HTMLSelectElement.required => boolean, reflected attribute
reflectProperties([{ multiple: [false] }, { name: [''] }, { required: [false] }], HTMLSelectElement);

// Implemented on HTMLElement
// HTMLSelectElement.form => HTMLFormElement, readonly

// Unimplemented Properties
// HTMLSelectElement.validation => string
// HTMLSelectElement.validity => ValidityState
// HTMLSelectElement.willValidate => boolean
