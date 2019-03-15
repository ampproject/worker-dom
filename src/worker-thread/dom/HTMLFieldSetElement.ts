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
