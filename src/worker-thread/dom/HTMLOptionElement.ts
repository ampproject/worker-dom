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

import { registerSubclass } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';
import { NodeType, NodeName, NamespaceURI } from './Node';

export class HTMLOptionElement extends HTMLElement {
  private isSelected: boolean = false;

  constructor(nodeType: NodeType, nodeName: NodeName, namespaceURI: NamespaceURI) {
    super(nodeType, nodeName, namespaceURI);

    this.propertyBackedAttributes_.selected = [(): string => String(this.isSelected), (value: string): boolean => (this.selected = value === 'true')];
  }

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
  get selected(): boolean {
    return this.isSelected;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement
   * @param value new selected boolean value.
   */
  set selected(value: boolean) {
    this.isSelected = value;
    // TODO(KB) This is a mutation.
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
  get value(): string {
    return this.getAttribute('value') || this.textContent;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement
   * @param value new value for an option element.
   */
  set value(value: string) {
    this.setAttribute('value', value);
  }
}
registerSubclass('option', HTMLOptionElement);

// Reflected Properties
// HTMLOptionElement.defaultSelected => boolean, reflected attribute
// HTMLOptionElement.disabled => boolean, reflected attribute
// HTMLOptionElement.type => string, reflected attribute
reflectProperties([{ defaultSelected: [false, 'selected'] }, { disabled: [false] }, { type: [''] }], HTMLOptionElement);

// Implemented at HTMLElement
// HTMLOptionElement.form, Read only	=> HTMLFormElement
