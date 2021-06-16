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
